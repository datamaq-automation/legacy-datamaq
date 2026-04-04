import { afterEach, describe, expect, it, vi } from 'vitest'
import { SiteSnapshotSchema } from '@/domain/schemas/siteSchema'
import { ContentRepository } from '@/infrastructure/content/contentRepository'

describe('ContentRepository', () => {
  afterEach(() => {
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

  it('exposes the frozen local snapshot as the initial content source', () => {
    const repository = new ContentRepository()

    expect(repository.getHeroContent().title).toBe('Instalación e integración de equipos IoT para energía y producción')
    expect(repository.getContactPageContent().supportTitle).toBe('Canales disponibles')
    expect(repository.getBrandContent().technician.name).toBe('Agustin Bustos')
    expect(repository.getSeoContent().siteName).toBe('DataMaq')
  })
})
