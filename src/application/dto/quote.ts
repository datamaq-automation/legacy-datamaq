export type QuoteBureaucracyLevel = 'low' | 'medium' | 'high'

export interface DiagnosticQuoteRequest {
  company: string
  contact_name: string
  locality: string
  scheduled: boolean
  access_ready: boolean
  safe_window_confirmed: boolean
  bureaucracy: QuoteBureaucracyLevel
  email?: string
  notes?: string
}

export interface QuoteDiscount {
  code: string
  label: string
  amount_ars: number
}

export interface DiagnosticQuoteResponse {
  quote_id: string
  list_price_ars: number
  discounts: QuoteDiscount[]
  final_price_ars: number
  deposit_pct: number
  deposit_ars: number
  valid_until: string
  whatsapp_message: string
  whatsapp_url: string
}

export interface QuotePdfDownloadResult {
  blob: Blob
  filename?: string
}
