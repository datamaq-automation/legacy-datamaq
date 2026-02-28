import { describe, expect, it } from 'vitest'
import {
  summarizeDiagnosticQuoteRequest,
  summarizeDiagnosticQuoteResponse,
  summarizeQuoteError,
  summarizeQuotePdfDownload
} from '@/application/quote/quoteRuntimeDiagnostics'
import { QuoteApiError } from '@/application/quote/quoteApiError'

describe('quoteRuntimeDiagnostics', () => {
  it('summarizes quote requests without exposing raw contact values', () => {
    expect(
      summarizeDiagnosticQuoteRequest({
        company: 'ACME',
        contact_name: 'Juan',
        locality: 'Escobar',
        scheduled: true,
        access_ready: false,
        safe_window_confirmed: true,
        bureaucracy: 'medium',
        email: 'juan@example.com',
        phone: '+54 11 5555 4444',
        notes: 'Necesitamos acceso coordinado'
      })
    ).toEqual({
      hasCompany: true,
      hasContactName: true,
      hasLocality: true,
      scheduled: true,
      accessReady: false,
      safeWindowConfirmed: true,
      bureaucracy: 'medium',
      hasEmail: true,
      hasPhone: true,
      hasNotes: true,
      notesLength: 29
    })
  })

  it('summarizes quote responses and PDF downloads with compact metadata', () => {
    expect(
      summarizeDiagnosticQuoteResponse({
        quote_id: 'Q-20260222-000111',
        list_price_ars: 280000,
        discounts: [{ code: 'DISC1', label: 'Turno', amount_ars: 14000 }],
        discount_pct: 5,
        discount_total_ars: 14000,
        final_price_ars: 266000,
        deposit_pct: 50,
        deposit_ars: 133000,
        valid_until: '2026-03-01T00:00:00Z',
        whatsapp_message: 'Hola DataMaq...',
        whatsapp_url: 'https://wa.me/5491168758623?text=Hola'
      })
    ).toEqual({
      quoteId: 'Q-20260222-000111',
      listPriceArs: 280000,
      finalPriceArs: 266000,
      discountPct: 5,
      discountCount: 1,
      depositPct: 50,
      whatsappEnabled: true,
      validUntil: '2026-03-01T00:00:00Z'
    })

    expect(
      summarizeQuotePdfDownload('Q-20260222-000111', {
        blob: new Blob(['pdf'], { type: 'application/pdf' }),
        filename: 'quote-Q-20260222-000111.pdf'
      })
    ).toEqual({
      quoteId: 'Q-20260222-000111',
      filename: 'quote-Q-20260222-000111.pdf',
      blobSize: 3,
      contentType: 'application/pdf'
    })
  })

  it('summarizes API errors into loggable metadata', () => {
    expect(
      summarizeQuoteError(
        new QuoteApiError({
          message: 'Error al generar cotizacion (429): rate limit exceeded',
          status: 429,
          detail: 'rate limit exceeded',
          retryAfterSeconds: 12,
          validationIssues: [{ loc: ['body', 'company'], message: 'Field required' }],
          kind: 'http'
        })
      )
    ).toEqual({
      name: 'QuoteApiError',
      message: 'Error al generar cotizacion (429): rate limit exceeded',
      kind: 'http',
      status: 429,
      detail: 'rate limit exceeded',
      retryAfterSeconds: 12,
      validationIssueCount: 1
    })
  })
})
