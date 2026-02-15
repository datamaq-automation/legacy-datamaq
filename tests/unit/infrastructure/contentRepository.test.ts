import { afterEach, describe, expect, it, vi } from 'vitest'
import { AppContentSchema } from '@/domain/schemas/contentSchema'
import { ContentRepository } from '@/infrastructure/content/contentRepository'

describe('ContentRepository', () => {
  afterEach(() => {
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
})
