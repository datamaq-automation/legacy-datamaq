import type {
  DiagnosticQuoteRequest,
  DiagnosticQuoteResponse,
  QuotePdfDownloadResult
} from '@/application/dto/quote'
import type { QuoteGateway } from '@/application/quote/ports/QuoteGateway'
import type { ConfigPort } from '@/application/ports/Config'

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
      throw new Error('Error de red al generar cotizacion')
    }

    if (!response.ok) {
      const errorText = await response.text().catch(() => '')
      debugQuote('createDiagnosticQuote non-ok response', {
        endpoint,
        status: response.status,
        errorText
      })
      throw new Error(
        `Error al generar cotizacion (${response.status})${errorText ? `: ${errorText}` : ''}`
      )
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
      throw new Error('Error de red al descargar PDF')
    }

    if (!response.ok) {
      const errorText = await response.text().catch(() => '')
      debugQuote('fetchQuotePdf non-ok response', {
        endpoint,
        quoteId,
        status: response.status,
        errorText
      })
      throw new Error(
        `Error al descargar PDF (${response.status})${errorText ? `: ${errorText}` : ''}`
      )
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
    if (!normalizedQuoteId) {
      throw new Error('quote_id invalido')
    }
    return endpoint
      .replace(/\/v1\/public\/quote\/diagnostic\/?$/, '')
      .concat(`/v1/public/quote/${encodeURIComponent(normalizedQuoteId)}/pdf`)
  }
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
