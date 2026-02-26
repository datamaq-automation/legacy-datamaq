import type {
  DiagnosticQuoteRequest,
  DiagnosticQuoteResponse,
  QuotePdfDownloadResult
} from '@/application/dto/quote'
import type { QuoteGateway } from '@/application/quote/ports/QuoteGateway'
import type { ConfigPort } from '@/application/ports/Config'
import type { HttpClient } from '@/application/ports/HttpClient'
import { QuoteApiError, type QuoteValidationIssue } from '@/application/quote/quoteApiError'
import { isValidQuoteId } from '@/application/quote/quoteId'
import { FetchHttpClient } from '@/infrastructure/http/fetchHttpClient'
import { NoopLogger } from '@/infrastructure/logging/noopLogger'

export class QuoteApiGateway implements QuoteGateway {
  constructor(
    private config: ConfigPort,
    private http: HttpClient = new FetchHttpClient(new NoopLogger())
  ) {}

  async createDiagnosticQuote(payload: DiagnosticQuoteRequest): Promise<DiagnosticQuoteResponse> {
    const endpoint = this.config.quoteDiagnosticApiUrl
    if (!endpoint) {
      throw new Error('Cotizador no disponible: falta configuracion de backend')
    }

    const response = await this.http.postJson<DiagnosticQuoteResponse>(endpoint, payload, undefined, {
      timeoutMs: 10_000,
      retries: 1
    })

    if (!response.ok || response.status === 0) {
      if (response.status === 0) {
        debugQuote('createDiagnosticQuote network error', { endpoint })
        throw QuoteApiError.network('Error de red al generar cotizacion')
      }
      const quoteError = await buildQuoteApiError(response, 'Error al generar cotizacion')
      debugQuote('createDiagnosticQuote non-ok response', {
        endpoint,
        status: quoteError.status,
        detail: quoteError.detail,
        retryAfterSeconds: quoteError.retryAfterSeconds,
        validationIssues: quoteError.validationIssues
      })
      throw quoteError
    }

    const data = response.data as DiagnosticQuoteResponse
    return data
  }

  async fetchQuotePdf(quoteId: string): Promise<QuotePdfDownloadResult> {
    const endpoint = this.buildQuotePdfEndpoint(quoteId)
    const response = await this.http.get<QuotePdfResponsePayload>(endpoint, {
      headers: {
        Accept: 'application/pdf, application/json'
      },
      timeoutMs: 10_000,
      retries: 1
    })

    if (!response.ok || response.status === 0) {
      if (response.status === 0) {
        debugQuote('fetchQuotePdf network error', { endpoint, quoteId })
        throw QuoteApiError.network('Error de red al descargar PDF')
      }
      const quoteError = await buildQuoteApiError(response, 'Error al descargar PDF')
      debugQuote('fetchQuotePdf non-ok response', {
        endpoint,
        quoteId,
        status: quoteError.status,
        detail: quoteError.detail,
        retryAfterSeconds: quoteError.retryAfterSeconds
      })
      throw quoteError
    }

    const filename = parseFilenameFromContentDisposition(response.headers?.['content-disposition'] ?? null)
    const maybePdfData = response.data
    if (isQuotePdfPayload(maybePdfData)) {
      return {
        blob: maybePdfData.blob,
        ...(filename ? { filename } : {})
      }
    }
    if (maybePdfData instanceof Blob) {
      return {
        blob: maybePdfData,
        ...(filename ? { filename } : {})
      }
    }
    if (typeof response.text === 'string' && response.text.length > 0) {
      return {
        blob: new Blob([response.text], { type: 'application/pdf' }),
        ...(filename ? { filename } : {})
      }
    }
    return {
      blob: new Blob(['pdf-unavailable'], { type: 'application/pdf' }),
      ...(filename ? { filename } : {})
    }
  }

  private buildQuotePdfEndpoint(quoteId: string): string {
    const endpoint = this.config.quoteDiagnosticApiUrl
    if (!endpoint) {
      throw new Error('Cotizador no disponible: falta configuracion de backend')
    }
    const normalizedQuoteId = quoteId.trim()
    if (!isValidQuoteId(normalizedQuoteId)) {
      throw new QuoteApiError({
        message: 'Error al descargar PDF (422): quote_id invalido',
        status: 422,
        detail: 'quote_id invalido'
      })
    }
    const explicitPdfEndpoint = normalizeText(this.config.quotePdfApiUrl ?? '')
    if (explicitPdfEndpoint) {
      return buildQuotePdfUrlFromTemplate(explicitPdfEndpoint, normalizedQuoteId)
    }
    return endpoint
      .replace(/\/v1\/public\/quote\/diagnostic\/?$/, '')
      .concat(`/v1/public/quote/${encodeURIComponent(normalizedQuoteId)}/pdf`)
  }
}

type QuotePdfResponsePayload = Blob | Record<string, unknown>

function buildQuoteApiError(
  response: { status: number; text?: string; data?: unknown; headers?: Record<string, string> },
  actionLabel: string
): QuoteApiError {
  const rawText = normalizeText(response.text ?? '')
  const parsed = parseErrorPayload(response.data, rawText)
  const detail = parsed.detail ?? rawText
  const message = `${actionLabel} (${response.status})${detail ? `: ${detail}` : ''}`
  return new QuoteApiError({
    message,
    status: response.status,
    detail,
    retryAfterSeconds: parseRetryAfter(response.headers?.['retry-after'] ?? null),
    validationIssues: parsed.validationIssues
  })
}

function parseErrorPayload(payload: unknown, rawText: string | undefined): {
  detail: string | undefined
  validationIssues: QuoteValidationIssue[]
} {
  if (!isRecord(payload)) {
    return { detail: rawText, validationIssues: [] }
  }

  const detailValue = payload['detail']
  if (Array.isArray(detailValue)) {
    const validationIssues = extractValidationIssues(detailValue)
    return {
      detail: validationIssues[0]?.message ?? rawText,
      validationIssues
    }
  }

  if (typeof detailValue === 'string') {
    return {
      detail: normalizeText(detailValue) ?? rawText,
      validationIssues: []
    }
  }

  const messageValue = payload['message']
  if (typeof messageValue === 'string') {
    return {
      detail: normalizeText(messageValue) ?? rawText,
      validationIssues: []
    }
  }

  if (!rawText) {
    return { detail: undefined, validationIssues: [] }
  }

  return {
    detail: rawText,
    validationIssues: []
  }
}

function extractValidationIssues(items: unknown[]): QuoteValidationIssue[] {
  const validationIssues: QuoteValidationIssue[] = []

  items.forEach((item) => {
    if (!isRecord(item)) {
      return
    }

    const locValue = item['loc']
    const loc = Array.isArray(locValue)
      ? locValue
          .map((entry) => (typeof entry === 'string' || typeof entry === 'number' ? String(entry) : ''))
          .filter(Boolean)
      : []
    const messageValue = item['msg']
    const message = typeof messageValue === 'string' ? messageValue.trim() : ''
    if (!message) {
      return
    }

    const validationIssue: QuoteValidationIssue = {
      loc,
      message
    }
    const field = extractFieldFromLoc(loc)
    if (field) {
      validationIssue.field = field
    }

    const typeValue = item['type']
    if (typeof typeValue === 'string') {
      validationIssue.type = typeValue
    }

    validationIssues.push(validationIssue)
  })

  return validationIssues
}

function extractFieldFromLoc(loc: string[]): string | undefined {
  const ignoredSegments = new Set(['body', 'query', 'path'])
  for (let index = loc.length - 1; index >= 0; index -= 1) {
    const segment = loc[index]
    if (!segment || ignoredSegments.has(segment) || /^\d+$/.test(segment)) {
      continue
    }
    return segment
  }
  return undefined
}

function parseRetryAfter(value: string | null): number | undefined {
  const normalized = value?.trim()
  if (!normalized) {
    return undefined
  }

  const seconds = Number.parseInt(normalized, 10)
  if (Number.isFinite(seconds) && seconds >= 0) {
    return seconds
  }

  const retryAt = Date.parse(normalized)
  if (!Number.isFinite(retryAt)) {
    return undefined
  }

  const deltaSeconds = Math.ceil((retryAt - Date.now()) / 1000)
  return Math.max(deltaSeconds, 0)
}

function normalizeText(value: string): string | undefined {
  const normalized = value.trim()
  return normalized ? normalized : undefined
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function parseFilenameFromContentDisposition(value: string | null): string | undefined {
  if (!value) {
    return undefined
  }

  const utf8Match = /filename\*=UTF-8''([^;]+)/i.exec(value)
  if (utf8Match?.[1]) {
    return decodeURIComponent(utf8Match[1]).trim()
  }

  const asciiMatch = /filename=\"?([^\";]+)\"?/i.exec(value)
  if (asciiMatch?.[1]) {
    return asciiMatch[1].trim()
  }

  return undefined
}

function buildQuotePdfUrlFromTemplate(template: string, quoteId: string): string {
  const encodedQuoteId = encodeURIComponent(quoteId)
  if (template.includes('{quote_id}')) {
    return template.replace(/\{quote_id\}/g, encodedQuoteId)
  }
  return appendQueryParam(template, 'quote_id', encodedQuoteId)
}

function appendQueryParam(url: string, key: string, encodedValue: string): string {
  const hashIndex = url.indexOf('#')
  const baseWithQuery = hashIndex >= 0 ? url.slice(0, hashIndex) : url
  const hashSuffix = hashIndex >= 0 ? url.slice(hashIndex) : ''
  const separator = baseWithQuery.includes('?') ? '&' : '?'
  return `${baseWithQuery}${separator}${encodeURIComponent(key)}=${encodedValue}${hashSuffix}`
}

function debugQuote(message: string, context: Record<string, unknown>): void {
  if (!import.meta.env.DEV) {
    return
  }
  console.warn(`[quoteApiGateway] ${message}`, context)
}

function isQuotePdfPayload(value: unknown): value is { blob: Blob } {
  if (!isRecord(value)) {
    return false
  }
  return value['blob'] instanceof Blob
}
