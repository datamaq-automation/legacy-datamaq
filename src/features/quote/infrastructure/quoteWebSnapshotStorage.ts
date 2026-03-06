import type { DiagnosticQuoteResponse } from '@/application/dto/quote'

const QUOTE_WEB_STORAGE_KEY = 'quote-web:last-generated'

interface StoredQuoteRecord {
  quote: DiagnosticQuoteResponse
  savedAt: string
}

export function saveQuoteWebSnapshot(quote: DiagnosticQuoteResponse): void {
  if (typeof window === 'undefined') {
    return
  }

  const payload: StoredQuoteRecord = {
    quote,
    savedAt: new Date().toISOString()
  }

  window.sessionStorage.setItem(QUOTE_WEB_STORAGE_KEY, JSON.stringify(payload))
}

export function readQuoteWebSnapshot(quoteId: string): DiagnosticQuoteResponse | undefined {
  if (typeof window === 'undefined') {
    return undefined
  }

  const raw = window.sessionStorage.getItem(QUOTE_WEB_STORAGE_KEY)
  if (!raw) {
    return undefined
  }

  try {
    const parsed = JSON.parse(raw) as Partial<StoredQuoteRecord>
    if (!parsed || typeof parsed !== 'object' || !parsed.quote) {
      return undefined
    }

    return parsed.quote.quote_id === quoteId ? parsed.quote : undefined
  } catch {
    return undefined
  }
}

