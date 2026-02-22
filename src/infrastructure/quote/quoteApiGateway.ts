import type {
  DiagnosticQuoteRequest,
  DiagnosticQuoteResponse,
  QuotePdfDownloadResult
} from '@/application/dto/quote'
import type { QuoteGateway } from '@/application/quote/ports/QuoteGateway'
import type { ConfigPort } from '@/application/ports/Config'
import { QuoteApiError, type QuoteValidationIssue } from '@/application/quote/quoteApiError'
import { isValidQuoteId } from '@/application/quote/quoteId'

export class QuoteApiGateway implements QuoteGateway {
  constructor(private config: ConfigPort) {}

  async createDiagnosticQuote(payload: DiagnosticQuoteRequest): Promise<DiagnosticQuoteResponse> {
    const endpoint = this.config.quoteDiagnosticApiUrl
    if (!endpoint) {
      throw new Error('Cotizador no disponible: falta VITE_BACKEND_BASE_URL')
    }

    let response: Response
    try {
      response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
    } catch (error) {
      debugQuote('createDiagnosticQuote network error', {
        endpoint,
        error
      })
      throw QuoteApiError.network('Error de red al generar cotizacion')
    }

    if (!response.ok) {
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

    const data = (await response.json()) as DiagnosticQuoteResponse
    return data
  }

  async fetchQuotePdf(quoteId: string): Promise<QuotePdfDownloadResult> {
    const endpoint = this.buildQuotePdfEndpoint(quoteId)
    let response: Response
    try {
      response = await fetch(endpoint, {
        method: 'GET'
      })
    } catch (error) {
      debugQuote('fetchQuotePdf network error', {
        endpoint,
        quoteId,
        error
      })
      throw QuoteApiError.network('Error de red al descargar PDF')
    }

    if (!response.ok) {
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

    const blob = await response.blob()
    const contentDisposition = response.headers.get('content-disposition')
    const filename = parseFilenameFromContentDisposition(contentDisposition)
    return { blob, ...(filename ? { filename } : {}) }
  }

  private buildQuotePdfEndpoint(quoteId: string): string {
    const endpoint = this.config.quoteDiagnosticApiUrl
    if (!endpoint) {
      throw new Error('Cotizador no disponible: falta VITE_BACKEND_BASE_URL')
    }
    const normalizedQuoteId = quoteId.trim()
    if (!isValidQuoteId(normalizedQuoteId)) {
      throw new QuoteApiError({
        message: 'Error al descargar PDF (422): quote_id invalido',
        status: 422,
        detail: 'quote_id invalido'
      })
    }
    return endpoint
      .replace(/\/v1\/public\/quote\/diagnostic\/?$/, '')
      .concat(`/v1/public/quote/${encodeURIComponent(normalizedQuoteId)}/pdf`)
  }
}

async function buildQuoteApiError(response: Response, actionLabel: string): Promise<QuoteApiError> {
  const rawText = await response.text().catch(() => '')
  const parsed = parseErrorPayload(rawText)
  const detail = parsed.detail ?? normalizeText(rawText)
  const message = `${actionLabel} (${response.status})${detail ? `: ${detail}` : ''}`
  return new QuoteApiError({
    message,
    status: response.status,
    detail,
    retryAfterSeconds: parseRetryAfter(response.headers.get('retry-after')),
    validationIssues: parsed.validationIssues
  })
}

function parseErrorPayload(rawText: string): {
  detail: string | undefined
  validationIssues: QuoteValidationIssue[]
} {
  const normalizedText = normalizeText(rawText)
  if (!normalizedText) {
    return { detail: undefined, validationIssues: [] }
  }

  const payload = parseJson(normalizedText)
  if (!isRecord(payload)) {
    return { detail: normalizedText, validationIssues: [] }
  }

  const detailValue = payload['detail']
  if (Array.isArray(detailValue)) {
    const validationIssues = extractValidationIssues(detailValue)
    return {
      detail: validationIssues[0]?.message,
      validationIssues
    }
  }

  if (typeof detailValue === 'string') {
    return {
      detail: normalizeText(detailValue),
      validationIssues: []
    }
  }

  return {
    detail: normalizedText,
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

function parseJson(value: string): unknown {
  try {
    return JSON.parse(value) as unknown
  } catch {
    return undefined
  }
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

function debugQuote(message: string, context: Record<string, unknown>): void {
  if (!import.meta.env.DEV) {
    return
  }
  console.warn(`[quoteApiGateway] ${message}`, context)
}
