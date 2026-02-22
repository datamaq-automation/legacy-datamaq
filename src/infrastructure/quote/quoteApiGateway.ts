import type {
  DiagnosticQuoteRequest,
  DiagnosticQuoteResponse,
  QuotePdfDownloadResult
} from '@/application/dto/quote'
import { useContainer } from '@/di/container'

export async function createDiagnosticQuote(
  payload: DiagnosticQuoteRequest
): Promise<DiagnosticQuoteResponse> {
  const endpoint = useContainer().config.quoteDiagnosticApiUrl
  if (!endpoint) {
    throw new Error('Cotizador no disponible: falta VITE_BACKEND_BASE_URL')
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })

  if (!response.ok) {
    const errorText = await response.text().catch(() => '')
    throw new Error(
      `Error al generar cotizacion (${response.status})${errorText ? `: ${errorText}` : ''}`
    )
  }

  const data = (await response.json()) as DiagnosticQuoteResponse
  return data
}

export async function fetchQuotePdf(quoteId: string): Promise<QuotePdfDownloadResult> {
  const endpoint = buildQuotePdfEndpoint(quoteId)
  const response = await fetch(endpoint, {
    method: 'GET'
  })

  if (!response.ok) {
    const errorText = await response.text().catch(() => '')
    throw new Error(
      `Error al descargar PDF (${response.status})${errorText ? `: ${errorText}` : ''}`
    )
  }

  const blob = await response.blob()
  const contentDisposition = response.headers.get('content-disposition')
  const filename = parseFilenameFromContentDisposition(contentDisposition)
  return { blob, ...(filename ? { filename } : {}) }
}

function buildQuotePdfEndpoint(quoteId: string): string {
  const endpoint = useContainer().config.quoteDiagnosticApiUrl
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
