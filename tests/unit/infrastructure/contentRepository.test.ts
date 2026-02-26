import { afterEach, describe, expect, it, vi } from 'vitest'
import type { LoggerPort } from '@/application/ports/Logger'
import { AppContentSchema } from '@/domain/schemas/contentSchema'
import { commercialConfig } from '@/infrastructure/content/Appcontent.active'
import { ContentRepository } from '@/infrastructure/content/contentRepository'

describe('ContentRepository', () => {
  afterEach(() => {
    resetCommercialConfig()
    vi.restoreAllMocks()
  })

  it('parses content once and reuses cached result across getters', () => {
    const originalSafeParse = AppContentSchema.safeParse.bind(AppContentSchema)
    const safeParseSpy = vi
      .spyOn(AppContentSchema, 'safeParse')
      .mockImplementation((value) => originalSafeParse(value))
    const repository = new ContentRepository()

    const fullContent = repository.getContent()
    const navbar = repository.getNavbarContent()
    const contact = repository.getContactContent()
    const hero = repository.getHeroContent()
    const services = repository.getServicesContent()

    expect(fullContent.navbar).toEqual(navbar)
    expect(fullContent.contact).toEqual(contact)
    expect(fullContent.hero).toEqual(hero)
    expect(fullContent.services).toEqual(services)
    expect(safeParseSpy).toHaveBeenCalledTimes(1)
  })

  it('throws when content schema is invalid', () => {
    vi.spyOn(AppContentSchema, 'safeParse').mockReturnValue({
      success: false
    } as any)
    const repository = new ContentRepository()

    expect(() => repository.getContent()).toThrowError('Invalid content schema')
  })

  it('exposes navbar anchors for the landing decision flow sections', () => {
    const repository = new ContentRepository()

    const links = repository.getNavbarContent().links.map((link) => link.href)

    expect(links).toEqual([
      '#servicios',
      '#proceso',
      '#tarifas',
      '#cobertura',
      '#faq',
      '#contacto'
    ])
  })

  it('hydrates diagnostic list pricing from backend JSON and renders ARS amount', async () => {
    const logger = createLoggerSpy()
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          data: {
            tarifa_base_desde_ars: '410000',
            traslado_minimo_ars: '15000',
            diagnostico_lista_2h_ars: '275000',
            diagnostico_hora_adicional_ars: '130000'
          }
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    )

    const repository = new ContentRepository(
      { pricingApiUrl: 'https://api.example.com/v1/public/pricing' },
      logger
    )

    const heroRef = repository.getHeroContent()
    const servicesRef = repository.getServicesContent()

    expect(heroRef.responseNote).toContain('Consultar al WhatsApp')

    await flushRuntimePricing()
    await flushRuntimePricing()

    expect(heroRef.responseNote).toContain('Consultar al WhatsApp')
    expect(servicesRef.cards[0].figure?.caption).toContain('Consultar al WhatsApp')
    expect(servicesRef.cards[1].note).toContain('ARS 275.000')
    expect(commercialConfig.visitaDiagnosticoHasta2hARS).toBe(275000)
    expect(commercialConfig.tarifaBaseDesdeARS).toBeNull()
    expect(commercialConfig.trasladoMinimoARS).toBeNull()
    expect(commercialConfig.diagnosticoHoraAdicionalARS).toBeNull()
    expect(logger.debug).toHaveBeenCalled()
  })

  it('supports plain-text payloads for diagnostic list field aliases', async () => {
    const logger = createLoggerSpy()
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        'tarifa_base_desde_ars=380.000,00 diagnostico_lista_2h_ars=260.000,00 diagnostico_hora_adicional_ars=130.000,00',
        {
          status: 200,
          headers: { 'Content-Type': 'text/plain' }
        }
      )
    )

    const repository = new ContentRepository(
      { pricingApiUrl: 'https://api.example.com/v1/public/pricing' },
      logger
    )

    await flushRuntimePricing()
    await flushRuntimePricing()

    expect(repository.getHeroContent().responseNote).toContain('Consultar al WhatsApp')
    expect(repository.getServicesContent().cards[1].note).toContain('ARS 260.000')
    expect(commercialConfig.visitaDiagnosticoHasta2hARS).toBe(260000)
    expect(commercialConfig.tarifaBaseDesdeARS).toBeNull()
    expect(commercialConfig.trasladoMinimoARS).toBeNull()
    expect(commercialConfig.diagnosticoHoraAdicionalARS).toBeNull()
    expect(logger.debug).toHaveBeenCalled()
  })

  it('hydrates hero.title from content backend payload', async () => {
    const logger = createLoggerSpy()
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockImplementation((input) => {
      const url = String(input)
      if (url.includes('/content')) {
        return Promise.resolve(
          new Response(
            JSON.stringify({
              status: 'ok',
              data: { hero: { title: 'Titulo remoto por marca' } }
            }),
            {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            }
          )
        )
      }
      return Promise.resolve(
        new Response(JSON.stringify({ data: { diagnostico_lista_2h_ars: '275000' } }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        })
      )
    })

    const repository = new ContentRepository(
      {
        contentApiUrl: 'https://api.example.com/v1/public/content'
      },
      logger
    )

    await flushRuntimePricing()

    expect(repository.getHeroContent().title).toBe('Titulo remoto por marca')
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.example.com/v1/public/content',
      expect.objectContaining({ method: 'GET' })
    )
    expect(logger.debug).toHaveBeenCalled()
  })

  it('keeps local hero.title fallback when content payload lacks usable title', async () => {
    const logger = createLoggerSpy()
    vi.spyOn(globalThis, 'fetch').mockImplementation((input) => {
      const url = String(input)
      if (url.includes('/content')) {
        return Promise.resolve(
          new Response(JSON.stringify({ status: 'ok', data: { hero: { title: '   ' } } }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          })
        )
      }
      return Promise.resolve(
        new Response(JSON.stringify({ data: { diagnostico_lista_2h_ars: '275000' } }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        })
      )
    })

    const repository = new ContentRepository(
      {
        contentApiUrl: 'https://api.example.com/v1/public/content'
      },
      logger
    )
    const localTitle = repository.getHeroContent().title

    await flushRuntimePricing()

    expect(repository.getHeroContent().title).toBe(localTitle)
    expect(logger.warn).toHaveBeenCalled()
  })

  it('keeps fallback "Consultar al WhatsApp" when backend responds with non-ok status', async () => {
    const logger = createLoggerSpy()
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('backend-down', {
        status: 503
      })
    )

    const repository = new ContentRepository(
      { pricingApiUrl: 'https://api.example.com/v1/public/pricing' },
      logger
    )
    const heroRef = repository.getHeroContent()

    await flushRuntimePricing()

    expect(heroRef.responseNote).toContain('Consultar al WhatsApp')
    expect(logger.warn).toHaveBeenCalled()
  })

  it('keeps fallback "Consultar al WhatsApp" when payload has no recognized pricing keys', async () => {
    const logger = createLoggerSpy()
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ ok: true, data: { foo: 'bar' } }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    )

    const repository = new ContentRepository(
      { pricingApiUrl: 'https://api.example.com/v1/public/pricing' },
      logger
    )

    await flushRuntimePricing()

    expect(repository.getHeroContent().responseNote).toContain('Consultar al WhatsApp')
    expect(logger.warn).toHaveBeenCalled()
  })

  it('does not call fetch when pricing endpoint is missing', async () => {
    const logger = createLoggerSpy()
    const fetchSpy = vi.spyOn(globalThis, 'fetch')

    new ContentRepository({ pricingApiUrl: '   ' }, logger)

    await flushRuntimePricing()

    expect(fetchSpy).not.toHaveBeenCalled()
    expect(logger.warn).toHaveBeenCalled()
  })
})

function createLoggerSpy(): LoggerPort & {
  debug: ReturnType<typeof vi.fn>
  warn: ReturnType<typeof vi.fn>
  error: ReturnType<typeof vi.fn>
} {
  return {
    debug: vi.fn(),
    warn: vi.fn(),
    error: vi.fn()
  }
}

async function flushRuntimePricing(): Promise<void> {
  await Promise.resolve()
  await Promise.resolve()
  await new Promise((resolve) => setTimeout(resolve, 0))
}

function resetCommercialConfig(): void {
  commercialConfig.tarifaBaseDesdeARS = null
  commercialConfig.trasladoMinimoARS = null
  commercialConfig.visitaDiagnosticoHasta2hARS = null
  commercialConfig.diagnosticoHoraAdicionalARS = null
}

