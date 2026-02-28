import type {
  DiagnosticQuoteRequest,
  DiagnosticQuoteResponse,
  QuotePdfDownloadResult
} from '@/application/dto/quote'
import { QuoteApiError } from '@/application/quote/quoteApiError'

type DiagnosticQuoteRequestLike = Partial<DiagnosticQuoteRequest>

export function summarizeDiagnosticQuoteRequest(payload: DiagnosticQuoteRequestLike): {
  hasCompany: boolean
  hasContactName: boolean
  hasLocality: boolean
  scheduled: boolean | null
  accessReady: boolean | null
  safeWindowConfirmed: boolean | null
  bureaucracy: DiagnosticQuoteRequest['bureaucracy'] | null
  hasEmail: boolean
  hasPhone: boolean
  hasNotes: boolean
  notesLength: number
} {
  const notes = normalize(payload.notes)

  return {
    hasCompany: Boolean(normalize(payload.company)),
    hasContactName: Boolean(normalize(payload.contact_name)),
    hasLocality: Boolean(normalize(payload.locality)),
    scheduled: typeof payload.scheduled === 'boolean' ? payload.scheduled : null,
    accessReady: typeof payload.access_ready === 'boolean' ? payload.access_ready : null,
    safeWindowConfirmed:
      typeof payload.safe_window_confirmed === 'boolean' ? payload.safe_window_confirmed : null,
    bureaucracy: payload.bureaucracy ?? null,
    hasEmail: Boolean(normalize(payload.email)),
    hasPhone: Boolean(normalize(payload.phone)),
    hasNotes: Boolean(notes),
    notesLength: notes.length
  }
}

export function summarizeDiagnosticQuoteResponse(response: DiagnosticQuoteResponse): {
  quoteId: string
  listPriceArs: number
  finalPriceArs: number
  discountPct: number
  discountCount: number
  depositPct: number
  whatsappEnabled: boolean
  validUntil: string
} {
  return {
    quoteId: response.quote_id,
    listPriceArs: response.list_price_ars,
    finalPriceArs: response.final_price_ars,
    discountPct: response.discount_pct,
    discountCount: response.discounts.length,
    depositPct: response.deposit_pct,
    whatsappEnabled: Boolean(normalize(response.whatsapp_url)),
    validUntil: response.valid_until
  }
}

export function summarizeQuotePdfDownload(
  quoteId: string,
  result: QuotePdfDownloadResult
): {
  quoteId: string
  filename: string | null
  blobSize: number
  contentType: string | null
} {
  return {
    quoteId,
    filename: normalize(result.filename) || null,
    blobSize: result.blob.size,
    contentType: normalize(result.blob.type) || null
  }
}

export function summarizeQuoteError(error: unknown): {
  name: string
  message: string
  kind?: string
  status?: number
  detail?: string | null
  retryAfterSeconds?: number | null
  validationIssueCount?: number
} | null {
  if (QuoteApiError.is(error)) {
    return {
      name: error.name,
      message: error.message,
      kind: error.kind,
      status: error.status,
      detail: error.detail ?? null,
      retryAfterSeconds: error.retryAfterSeconds ?? null,
      validationIssueCount: error.validationIssues.length
    }
  }

  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message
    }
  }

  if (error === undefined || error === null) {
    return null
  }

  return {
    name: typeof error,
    message: String(error)
  }
}

function normalize(value: string | undefined): string {
  return value?.trim() ?? ''
}
