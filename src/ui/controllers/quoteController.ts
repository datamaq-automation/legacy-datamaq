import type { DiagnosticQuoteRequest, QuotePdfDownloadResult } from '@/application/dto/quote'
import { useContainer } from '@/di/container'

export function createDiagnosticQuote(payload: DiagnosticQuoteRequest) {
  return useContainer().quoteGateway.createDiagnosticQuote(payload)
}

export function fetchQuotePdf(quoteId: string): Promise<QuotePdfDownloadResult> {
  return useContainer().quoteGateway.fetchQuotePdf(quoteId)
}
