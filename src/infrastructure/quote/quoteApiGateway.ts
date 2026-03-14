import type {
  DiagnosticQuoteRequest,
  DiagnosticQuoteResponse,
  QuotePdfDownloadResult
} from '@/application/dto/quote'
import type { QuoteGateway } from '@/application/quote/ports/QuoteGateway'
import type { ConfigPort } from '@/application/ports/Config'
import type { HttpClient } from '@/application/ports/HttpClient'
import {
  summarizeDiagnosticQuoteRequest,
  summarizeDiagnosticQuoteResponse,
  summarizeQuotePdfDownload
} from '@/application/quote/quoteRuntimeDiagnostics'
import { QuoteApiError, type QuoteValidationIssue } from '@/application/quote/quoteApiError'
import { buildRuntimeLogArgs } from '@/application/utils/runtimeConsole'
import { isValidQuoteId } from '@/application/quote/quoteId'
import { FetchHttpClient } from '@/infrastructure/http/fetchHttpClient'
import { NoopLogger } from '@/infrastructure/logging/noopLogger'
import { mapKeysToCamelCase } from '@/infrastructure/mappers/caseMapper'
import { describeBackendEndpoint, resolveBackendPathname } from '@/shared/backend/backendEndpoint'

export class QuoteApiGateway implements QuoteGateway {
  constructor(
    private config: ConfigPort,
    private http: HttpClient = new FetchHttpClient(new NoopLogger())
  ) {}

  async createDiagnosticQuote(payload: DiagnosticQuoteRequest): Promise<DiagnosticQuoteResponse> {
    const endpoint = this.config.quoteDiagnosticApiUrl
    if (!endpoint) {
      throw new Error('Cotizador no disponible: falta configuración de backend')
    }
    const endpointContext = buildQuoteEndpointLogContext(endpoint)

    logQuoteGatewayDebug('generar propuesta iniciado', {
      ...endpointContext,
      payload: summarizeDiagnosticQuoteRequest(payload)
    })

    const response = await this.http.postJson<DiagnosticQuoteResponse>(endpoint, payload, undefined, {
      timeoutMs: 10_000,
      retries: 1
    })

    if (!response.ok || response.status === 0) {
      if (response.status === 0) {
        logQuoteGatewayWarn('generar propuesta error de red', {
          ...endpointContext,
          status: 0,
          reason: 'network-error'
        })
        throw QuoteApiError.network('Error de red al generar cotización')
      }
      const quoteError = await buildQuoteApiError(response, 'Error al generar cotización')
      logQuoteGatewayWarn('generar propuesta respuesta no OK', {
        ...endpointContext,
        status: quoteError.status,
        detail: quoteError.detail ?? null,
        retryAfterSeconds: quoteError.retryAfterSeconds ?? null,
        validationIssues: quoteError.validationIssues
      })
      throw quoteError
    }

    const data = response.data as DiagnosticQuoteResponse
    logQuoteGatewayInfo('generar propuesta OK', {
      ...endpointContext,
      status: response.status,
      quote: summarizeDiagnosticQuoteResponse(data)
    })
    return data
  }

  async fetchQuotePdf(quoteId: string): Promise<QuotePdfDownloadResult> {
    const endpoint = this.buildQuotePdfEndpoint(quoteId)
    const endpointContext = buildQuoteEndpointLogContext(endpoint)

    logQuoteGatewayDebug('descargar PDF iniciado', {
      ...endpointContext,
      quoteId
    })
    const response = await this.http.get<QuotePdfResponsePayload>(endpoint, {
      headers: {
        Accept: 'application/pdf, application/json',
        ...this.buildQuoteReadAuthHeaders()
      },
      timeoutMs: 10_000,
      retries: 1
    })

    if (!response.ok || response.status === 0) {
      if (response.status === 0) {
        logQuoteGatewayWarn('descargar PDF error de red', {
          ...endpointContext,
          quoteId,
          status: 0,
          reason: 'network-error'
        })
        throw QuoteApiError.network('Error de red al descargar PDF')
      }
      const quoteError = await buildQuoteApiError(response, 'Error al descargar PDF')
      logQuoteGatewayWarn('descargar PDF respuesta no OK', {
        ...endpointContext,
        quoteId,
        status: quoteError.status,
        detail: quoteError.detail ?? null,
        retryAfterSeconds: quoteError.retryAfterSeconds ?? null
      })
      throw quoteError
    }

    const filename = parseFilenameFromContentDisposition(response.headers?.['content-disposition'] ?? null)
    const maybePdfData = response.data
    if (isQuotePdfPayload(maybePdfData)) {
      const result = {
        blob: maybePdfData.blob,
        ...(filename ? { filename } : {})
      }
      logQuoteGatewayInfo('descargar PDF OK', {
        ...endpointContext,
        status: response.status,
        download: summarizeQuotePdfDownload(quoteId, result)
      })
      return result
    }
    if (maybePdfData instanceof Blob) {
      const result = {
        blob: maybePdfData,
        ...(filename ? { filename } : {})
      }
      logQuoteGatewayInfo('descargar PDF OK', {
        ...endpointContext,
        status: response.status,
        download: summarizeQuotePdfDownload(quoteId, result)
      })
      return result
    }
    if (typeof response.text === 'string' && response.text.length > 0) {
      const result = {
        blob: new Blob([response.text], { type: 'application/pdf' }),
        ...(filename ? { filename } : {})
      }
      logQuoteGatewayInfo('descargar PDF OK', {
        ...endpointContext,
        status: response.status,
        download: summarizeQuotePdfDownload(quoteId, result)
      })
      return result
    }
    const result = {
      blob: new Blob(['pdf-unavailable'], { type: 'application/pdf' }),
      ...(filename ? { filename } : {})
    }
    logQuoteGatewayInfo('descargar PDF OK', {
      ...endpointContext,
      status: response.status,
      download: summarizeQuotePdfDownload(quoteId, result)
    })
    return result
  }

  private buildQuotePdfEndpoint(quoteId: string): string {
    const endpoint = this.config.quoteDiagnosticApiUrl
    if (!endpoint) {
      throw new Error('Cotizador no disponible: falta configuración de backend')
    }
    const normalizedQuoteId = quoteId.trim()
    if (!isValidQuoteId(normalizedQuoteId)) {
      throw new QuoteApiError({
        message: 'Error al descargar PDF (422): quote_id inválido',
        status: 422,
        detail: 'quote_id inválido'
      })
    }
    const explicitPdfEndpoint = normalizeText(this.config.quotePdfApiUrl ?? '')
    if (explicitPdfEndpoint) {
      return buildQuotePdfUrlFromTemplate(explicitPdfEndpoint, normalizedQuoteId)
    }
    return endpoint
      .replace(/\/v1\/quote\/diagnostic\/?$/, '')
      .concat(`/v1/quote/${encodeURIComponent(normalizedQuoteId)}/pdf`)
  }

  private buildQuoteReadAuthHeaders(): Record<string, string> {
    const apiKey = normalizeText(this.config.quoteReadApiKey ?? '')
    if (!apiKey) {
      return {}
    }

    return {
      'X-API-Key': apiKey
    }
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
  const normalizedPayload = mapKeysToCamelCase(payload)
  if (!isRecord(normalizedPayload)) {
    return { detail: rawText, validationIssues: [] }
  }

  const detailValue = normalizedPayload['detail']
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

  const messageValue = normalizedPayload['message']
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
  if (!template.includes('{quote_id}')) {
    throw new Error('quotePdfApiUrl debe incluir el placeholder {quote_id}')
  }
  return template.replace(/\{quote_id\}/g, encodedQuoteId)
}

function logQuoteGatewayWarn(event: string, context: Record<string, unknown>): void {
  if (!import.meta.env.DEV) {
    return
  }

  console.warn(...buildRuntimeLogArgs(`[quote:gateway] ${event}`, context))
}

function logQuoteGatewayDebug(event: string, context: Record<string, unknown>): void {
  if (!import.meta.env.DEV) {
    return
  }

  console.debug(...buildRuntimeLogArgs(`[quote:gateway] ${event}`, context))
}

function logQuoteGatewayInfo(event: string, context: Record<string, unknown>): void {
  if (!import.meta.env.DEV) {
    return
  }

  console.info(...buildRuntimeLogArgs(`[quote:gateway] ${event}`, context))
}

function buildQuoteEndpointLogContext(endpoint: string): {
  endpoint: string
  pathname: string | null
  transportMode: 'direct' | 'proxy'
} {
  const endpointContext = describeBackendEndpoint(endpoint)

  return {
    endpoint: endpointContext.browserUrl,
    pathname: resolveBackendPathname(endpoint),
    transportMode: endpointContext.transportMode
  }
}

function isQuotePdfPayload(value: unknown): value is { blob: Blob } {
  if (!isRecord(value)) {
    return false
  }
  return value['blob'] instanceof Blob
}
