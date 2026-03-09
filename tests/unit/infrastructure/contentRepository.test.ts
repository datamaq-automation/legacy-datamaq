import { afterEach, describe, expect, it, vi } from 'vitest'
import type { LoggerPort } from '@/application/ports/Logger'
import { SiteSnapshotSchema } from '@/domain/schemas/siteSchema'
import { commercialConfig } from '@/infrastructure/content/Appcontent.active'
import { ContentRepository } from '@/infrastructure/content/contentRepository'

describe('ContentRepository', () => {
  afterEach(() => {
    resetCommercialConfig()
    vi.restoreAllMocks()
  })

  it('parses site snapshot once and reuses cached getters', () => {
    const originalSafeParse = SiteSnapshotSchema.safeParse.bind(SiteSnapshotSchema)
    const safeParseSpy = vi.spyOn(SiteSnapshotSchema, 'safeParse').mockImplementation((value) => originalSafeParse(value))
    const repository = new ContentRepository()

    const content = repository.getContent()
    const hero = repository.getHeroContent()
    const brand = repository.getBrandContent()
    const seo = repository.getSeoContent()

    expect(content.hero).toEqual(hero)
    expect(brand.brandName).toBeTypeOf('string')
    expect(seo.siteName).toBeTypeOf('string')
    expect(safeParseSpy).toHaveBeenCalledTimes(1)
  })

  it('throws when fallback site schema is invalid', () => {
    vi.spyOn(SiteSnapshotSchema, 'safeParse').mockReturnValue({ success: false } as never)

    expect(() => new ContentRepository().getContent()).toThrowError('Invalid site schema')
  })

  it('does not fetch remote site or pricing until bootstrapRemoteData is called', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch')

    new ContentRepository(
      {
        pricingApiUrl: 'https://api.example.com/v1/pricing',
        siteApiUrl: 'https://api.example.com/v1/site'
      },
      createLoggerSpy()
    )

    await flushAsync()

    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('applies full site snapshot from backend', async () => {
    const logger = createLoggerSpy()
    const baseRepository = new ContentRepository(undefined, logger)
    const baseSite = baseRepository.getSiteSnapshot()
    const remoteSite = {
      ...baseSite,
      content: {
        ...baseSite.content,
        hero: {
          ...baseSite.content.hero,
          title: 'Titulo remoto site',
          subtitle: 'Subtitulo remoto site'
        },
        contactPage: {
          ...baseSite.content.contactPage,
          supportTitle: 'Canales remotos'
        }
      },
      brand: {
        ...baseSite.brand,
        technician: {
          ...baseSite.brand.technician,
          name: 'Tecnico remoto'
        }
      },
      seo: {
        ...baseSite.seo,
        siteName: 'Marca remota'
      }
    }

    vi.spyOn(globalThis, 'fetch').mockImplementation((input) => {
      const url = String(input)
      if (url.includes('/site')) {
        return Promise.resolve(
          new Response(JSON.stringify({ status: 'ok', data: remoteSite }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          })
        )
      }

      return Promise.resolve(
        new Response(JSON.stringify({ data: { diagnostico_lista_2h_ars: 275000 } }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        })
      )
    })

    const repository = new ContentRepository(
      {
        siteApiUrl: 'https://api.example.com/v1/site',
        pricingApiUrl: 'https://api.example.com/v1/pricing'
      },
      logger
    )
    repository.bootstrapRemoteData()

    await flushAsync()
    await flushAsync()

    expect(repository.getHeroContent().title).toBe('Titulo remoto site')
    expect(repository.getContactPageContent().supportTitle).toBe('Canales remotos')
    expect(repository.getBrandContent().technician.name).toBe('Tecnico remoto')
    expect(repository.getSeoContent().siteName).toBe('Marca remota')
  })

  it('keeps fallback content when remote site payload is invalid', async () => {
    const logger = createLoggerSpy()
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ status: 'ok', data: { hero: { title: 'invalido' } } }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    )

    const repository = new ContentRepository(
      {
        siteApiUrl: 'https://api.example.com/v1/site'
      },
      logger
    )
    const localTitle = repository.getHeroContent().title
    repository.bootstrapRemoteData()

    await flushAsync()

    expect(repository.getHeroContent().title).toBe(localTitle)
    expect(logger.warn).toHaveBeenCalled()
  })

  it('marks remote content as unavailable when required site endpoint fails', async () => {
    vi.useFakeTimers()
    const logger = createLoggerSpy()
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('backend-down', { status: 503 }))

    const repository = new ContentRepository(
      {
        siteApiUrl: 'https://api.example.com/v1/site',
        requireRemoteContent: true
      },
      logger
    )

    expect(repository.getRemoteContentStatus()).toBe('pending')

    repository.bootstrapRemoteData()
    await flushAsync()
    
    // Retry delay es de 1000ms (backoff exponencial base)
    await vi.advanceTimersByTimeAsync(1500)
    await flushAsync()

    expect(repository.getRemoteContentStatus()).toBe('unavailable')
    vi.useRealTimers()
  })

  it('marks remote content as ready when required site endpoint succeeds', async () => {
    const logger = createLoggerSpy()
    const baseSite = new ContentRepository(undefined, logger).getSiteSnapshot()

    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ status: 'ok', data: baseSite }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    )

    const repository = new ContentRepository(
      {
        siteApiUrl: 'https://api.example.com/v1/site',
        requireRemoteContent: true
      },
      logger
    )

    repository.bootstrapRemoteData()
    await flushAsync()
    await flushAsync()

    expect(repository.getRemoteContentStatus()).toBe('ready')
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

async function flushAsync(): Promise<void> {
  await Promise.resolve()
  await Promise.resolve()
  if (vi.isFakeTimers()) {
    await vi.advanceTimersByTimeAsync(0)
    return
  }

  await new Promise((resolve) => setTimeout(resolve, 0))
}

function resetCommercialConfig(): void {
  commercialConfig.tarifaBaseDesdeARS = null
  commercialConfig.trasladoMinimoARS = null
  commercialConfig.visitaDiagnosticoHasta2hARS = null
  commercialConfig.diagnosticoHoraAdicionalARS = null
}
