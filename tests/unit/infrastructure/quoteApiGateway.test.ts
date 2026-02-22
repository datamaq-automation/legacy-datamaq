import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { QuoteApiGateway } from '@/infrastructure/quote/quoteApiGateway'
import type { ConfigPort } from '@/application/ports/Config'
import type { DiagnosticQuoteResponse } from '@/application/dto/quote'

function createConfig(overrides: Partial<ConfigPort> = {}): ConfigPort {
  return {
    inquiryApiUrl: undefined,
    mailApiUrl: undefined,
    pricingApiUrl: undefined,
    quoteDiagnosticApiUrl: 'https://api.example.com/v1/public/quote/diagnostic',
    contactEmail: undefined,
    contactFormActive: true,
    emailFormActive: true,
    analyticsEnabled: true,
    siteUrl: undefined,
    siteName: undefined,
    siteDescription: undefined,
    siteOgImage: undefined,
    siteLocale: undefined,
    gscVerification: undefined,
    businessName: undefined,
    businessTelephone: undefined,
    businessEmail: undefined,
    businessStreet: undefined,
    businessLocality: undefined,
    businessRegion: undefined,
    businessPostalCode: undefined,
    businessCountry: undefined,
    businessLat: undefined,
    businessLng: undefined,
    businessArea: undefined,
    ...overrides
  }
}

describe('QuoteApiGateway', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('creates diagnostic quote successfully', async () => {
    const responseBody: DiagnosticQuoteResponse = {
      quote_id: 'Q-20260222-000111',
      list_price_ars: 280000,
      discounts: [{ code: 'DISC1', label: 'Turno', amount_ars: 14000 }],
      final_price_ars: 266000,
      deposit_pct: 50,
      deposit_ars: 133000,
      valid_until: '2026-03-01T00:00:00Z',
      whatsapp_message: 'Hola DataMaq...',
      whatsapp_url: 'https://wa.me/5491168758623?text=Hola'
    }

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify(responseBody), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        })
      )
    )

    const gateway = new QuoteApiGateway(createConfig())
    const result = await gateway.createDiagnosticQuote({
      company: 'ACME',
      contact_name: 'Juan',
      locality: 'Escobar',
      scheduled: true,
      access_ready: true,
      safe_window_confirmed: true,
      bureaucracy: 'medium'
    })

    expect(result.quote_id).toBe('Q-20260222-000111')
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it('throws for non-ok diagnostic response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response('backend error', {
          status: 503
        })
      )
    )

    const gateway = new QuoteApiGateway(createConfig())
    await expect(
      gateway.createDiagnosticQuote({
        company: 'ACME',
        contact_name: 'Juan',
        locality: 'Escobar',
        scheduled: true,
        access_ready: true,
        safe_window_confirmed: true,
        bureaucracy: 'medium'
      })
    ).rejects.toThrow('Error al generar cotizacion (503)')
  })

  it('throws for network error in diagnostic quote', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')))

    const gateway = new QuoteApiGateway(createConfig())
    await expect(
      gateway.createDiagnosticQuote({
        company: 'ACME',
        contact_name: 'Juan',
        locality: 'Escobar',
        scheduled: true,
        access_ready: true,
        safe_window_confirmed: true,
        bureaucracy: 'medium'
      })
    ).rejects.toThrow('Error de red al generar cotizacion')
  })

  it('fetches quote pdf and extracts filename from content-disposition', async () => {
    const blobBody = new Blob(['pdf-bytes'], { type: 'application/pdf' })
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(blobBody, {
          status: 200,
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename="quote-Q-1.pdf"'
          }
        })
      )
    )

    const gateway = new QuoteApiGateway(createConfig())
    const result = await gateway.fetchQuotePdf('Q-1')

    expect(result.blob.size).toBeGreaterThan(0)
    expect(result.blob.type).toBe('application/pdf')
    expect(result.filename).toBe('quote-Q-1.pdf')
  })

  it('supports utf-8 filename* from content-disposition', async () => {
    const blobBody = new Blob(['pdf-bytes'], { type: 'application/pdf' })
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(blobBody, {
          status: 200,
          headers: {
            'Content-Disposition': "attachment; filename*=UTF-8''cotizacion%20Q-2.pdf"
          }
        })
      )
    )

    const gateway = new QuoteApiGateway(createConfig())
    const result = await gateway.fetchQuotePdf('Q-2')

    expect(result.filename).toBe('cotizacion Q-2.pdf')
  })

  it('throws on empty quote id for pdf', async () => {
    const gateway = new QuoteApiGateway(createConfig())
    await expect(gateway.fetchQuotePdf('   ')).rejects.toThrow('quote_id invalido')
  })

  it('throws when quote endpoint config is missing', async () => {
    const gateway = new QuoteApiGateway(createConfig({ quoteDiagnosticApiUrl: undefined }))

    await expect(
      gateway.createDiagnosticQuote({
        company: 'ACME',
        contact_name: 'Juan',
        locality: 'Escobar',
        scheduled: true,
        access_ready: true,
        safe_window_confirmed: true,
        bureaucracy: 'medium'
      })
    ).rejects.toThrow('Cotizador no disponible: falta VITE_BACKEND_BASE_URL')

    await expect(gateway.fetchQuotePdf('Q-1')).rejects.toThrow(
      'Cotizador no disponible: falta VITE_BACKEND_BASE_URL'
    )
  })
})
