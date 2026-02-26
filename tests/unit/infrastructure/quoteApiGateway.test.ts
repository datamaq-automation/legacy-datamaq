import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { QuoteApiGateway } from '@/infrastructure/quote/quoteApiGateway'
import type { ConfigPort } from '@/application/ports/Config'
import type { DiagnosticQuoteResponse } from '@/application/dto/quote'
import { QuoteApiError } from '@/application/quote/quoteApiError'

function createConfig(overrides: Partial<ConfigPort> = {}): ConfigPort {
  return {
    inquiryApiUrl: undefined,
    mailApiUrl: undefined,
    pricingApiUrl: undefined,
    quoteDiagnosticApiUrl: 'https://api.example.com/v1/public/quote/diagnostic',
    quotePdfApiUrl: undefined,
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
      discount_pct: 5,
      discount_total_ars: 14000,
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
    const request = gateway.createDiagnosticQuote({
      company: 'ACME',
      contact_name: 'Juan',
      locality: 'Escobar',
      scheduled: true,
      access_ready: true,
      safe_window_confirmed: true,
      bureaucracy: 'medium'
    })

    await expect(request).rejects.toBeInstanceOf(QuoteApiError)
    await request.catch((error: unknown) => {
      expect(QuoteApiError.is(error)).toBe(true)
      if (!QuoteApiError.is(error)) {
        throw error
      }
      expect(error.message).toContain('Error al generar cotizacion (503)')
      expect(error.status).toBe(503)
      expect(error.detail).toBe('backend error')
    })
  })

  it('throws for network error in diagnostic quote', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')))

    const gateway = new QuoteApiGateway(createConfig())
    const request = gateway.createDiagnosticQuote({
      company: 'ACME',
      contact_name: 'Juan',
      locality: 'Escobar',
      scheduled: true,
      access_ready: true,
      safe_window_confirmed: true,
      bureaucracy: 'medium'
    })

    await expect(request).rejects.toBeInstanceOf(QuoteApiError)
    await request.catch((error: unknown) => {
      expect(QuoteApiError.is(error)).toBe(true)
      if (!QuoteApiError.is(error)) {
        throw error
      }
      expect(error.message).toBe('Error de red al generar cotizacion')
      expect(error.status).toBe(0)
      expect(error.kind).toBe('network')
    })
  })

  it('maps 422 validation detail[] to validationIssues', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            detail: [
              {
                loc: ['body', 'company'],
                msg: 'Field required',
                type: 'missing'
              }
            ]
          }),
          {
            status: 422,
            headers: { 'Content-Type': 'application/json' }
          }
        )
      )
    )

    const gateway = new QuoteApiGateway(createConfig())
    const request = gateway.createDiagnosticQuote({
      company: '',
      contact_name: 'Juan',
      locality: 'Escobar',
      scheduled: true,
      access_ready: true,
      safe_window_confirmed: true
    })

    await expect(request).rejects.toBeInstanceOf(QuoteApiError)
    await request.catch((error: unknown) => {
      expect(QuoteApiError.is(error)).toBe(true)
      if (!QuoteApiError.is(error)) {
        throw error
      }
      expect(error.status).toBe(422)
      expect(error.detail).toBe('Field required')
      expect(error.validationIssues).toEqual([
        {
          field: 'company',
          loc: ['body', 'company'],
          message: 'Field required',
          type: 'missing'
        }
      ])
    })
  })

  it('maps 429 with retry-after header for quote creation', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ detail: 'rate limit exceeded' }), {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': '12'
          }
        })
      )
    )

    const gateway = new QuoteApiGateway(createConfig())
    const request = gateway.createDiagnosticQuote({
      company: 'ACME',
      contact_name: 'Juan',
      locality: 'Escobar',
      scheduled: true,
      access_ready: true,
      safe_window_confirmed: true
    })

    await expect(request).rejects.toBeInstanceOf(QuoteApiError)
    await request.catch((error: unknown) => {
      expect(QuoteApiError.is(error)).toBe(true)
      if (!QuoteApiError.is(error)) {
        throw error
      }
      expect(error.status).toBe(429)
      expect(error.detail).toBe('rate limit exceeded')
      expect(error.retryAfterSeconds).toBe(12)
    })
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
            'Content-Disposition': 'attachment; filename="quote-Q-20260222-000001.pdf"'
          }
        })
      )
    )

    const gateway = new QuoteApiGateway(createConfig())
    const result = await gateway.fetchQuotePdf('Q-20260222-000001')

    expect(result.blob.size).toBeGreaterThan(0)
    expect(result.blob.type).toBe('application/pdf')
    expect(result.filename).toBe('quote-Q-20260222-000001.pdf')
  })

  it('uses explicit quotePdfApiUrl template when configured', async () => {
    const blobBody = new Blob(['pdf-bytes'], { type: 'application/pdf' })
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(blobBody, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf'
        }
      })
    )
    vi.stubGlobal('fetch', fetchMock)

    const gateway = new QuoteApiGateway(
      createConfig({
        quoteDiagnosticApiUrl: '/api/v1/quote/diagnostic',
        quotePdfApiUrl: '/api/v1/quote/pdf?quote_id={quote_id}'
      })
    )
    await gateway.fetchQuotePdf('Q-20260222-000321')

    expect(fetchMock).toHaveBeenCalledWith('/api/v1/quote/pdf?quote_id=Q-20260222-000321', {
      method: 'GET'
    })
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
    const result = await gateway.fetchQuotePdf('Q-20260222-000002')

    expect(result.filename).toBe('cotizacion Q-2.pdf')
  })

  it('maps 429 with retry-after header for quote PDF download', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ detail: 'rate limit exceeded' }), {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': '7'
          }
        })
      )
    )

    const gateway = new QuoteApiGateway(createConfig())
    const request = gateway.fetchQuotePdf('Q-20260222-000003')

    await expect(request).rejects.toBeInstanceOf(QuoteApiError)
    await request.catch((error: unknown) => {
      expect(QuoteApiError.is(error)).toBe(true)
      if (!QuoteApiError.is(error)) {
        throw error
      }
      expect(error.status).toBe(429)
      expect(error.detail).toBe('rate limit exceeded')
      expect(error.retryAfterSeconds).toBe(7)
    })
  })

  it('maps 404 detail for quote PDF download', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ detail: 'quote not found' }), {
          status: 404,
          headers: {
            'Content-Type': 'application/json'
          }
        })
      )
    )

    const gateway = new QuoteApiGateway(createConfig())
    const request = gateway.fetchQuotePdf('Q-20260222-000404')

    await expect(request).rejects.toBeInstanceOf(QuoteApiError)
    await request.catch((error: unknown) => {
      expect(QuoteApiError.is(error)).toBe(true)
      if (!QuoteApiError.is(error)) {
        throw error
      }
      expect(error.status).toBe(404)
      expect(error.detail).toBe('quote not found')
    })
  })

  it('returns 422 QuoteApiError on empty quote id for pdf', async () => {
    const gateway = new QuoteApiGateway(createConfig())
    const request = gateway.fetchQuotePdf('   ')

    await expect(request).rejects.toBeInstanceOf(QuoteApiError)
    await request.catch((error: unknown) => {
      expect(QuoteApiError.is(error)).toBe(true)
      if (!QuoteApiError.is(error)) {
        throw error
      }
      expect(error.status).toBe(422)
      expect(error.detail).toBe('quote_id invalido')
    })
  })

  it('returns 422 QuoteApiError on malformed quote id for pdf', async () => {
    const gateway = new QuoteApiGateway(createConfig())
    const request = gateway.fetchQuotePdf('Q-1')

    await expect(request).rejects.toBeInstanceOf(QuoteApiError)
    await request.catch((error: unknown) => {
      expect(QuoteApiError.is(error)).toBe(true)
      if (!QuoteApiError.is(error)) {
        throw error
      }
      expect(error.status).toBe(422)
      expect(error.detail).toBe('quote_id invalido')
    })
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
    ).rejects.toThrow('Cotizador no disponible: falta configuracion de backend')

    await expect(gateway.fetchQuotePdf('Q-1')).rejects.toThrow(
      'Cotizador no disponible: falta configuracion de backend'
    )
  })
})


