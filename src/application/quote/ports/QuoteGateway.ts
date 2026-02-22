import type {
  DiagnosticQuoteRequest,
  DiagnosticQuoteResponse,
  QuotePdfDownloadResult
} from '@/application/dto/quote'

export interface QuoteGateway {
  createDiagnosticQuote(payload: DiagnosticQuoteRequest): Promise<DiagnosticQuoteResponse>
  fetchQuotePdf(quoteId: string): Promise<QuotePdfDownloadResult>
}
