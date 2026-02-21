/*
Path: src/infrastructure/content/contentRepository.ts
*/

import type {
  AboutContentPort,
  ConsentContentPort,
  ContactContentPort,
  ContentPort,
  FooterContentPort,
  HeroContentPort,
  LegalContentPort,
  NavbarContentPort,
  ProfileContentPort,
  ServicesContentPort
} from '@/application/ports/Content'
import type { AppContent } from '@/domain/types/content'
import { AppContentSchema } from '@/domain/schemas/contentSchema'
import { content } from '@/infrastructure/content/Appcontent'

export class ContentRepository
  implements
    ContentPort,
    NavbarContentPort,
    FooterContentPort,
    ContactContentPort,
    HeroContentPort,
    AboutContentPort,
    ProfileContentPort,
    LegalContentPort,
    ConsentContentPort,
    ServicesContentPort
{
  private parsedContentCache: AppContent | undefined

  getContent(): AppContent {
    const parsedContent = this.getParsedContent()
    return {
      ...parsedContent,
      navbar: this.getNormalizedNavbarContent(parsedContent.navbar)
    }
  }

  getNavbarContent() {
    return this.getNormalizedNavbarContent(this.getParsedContent().navbar)
  }

  getFooterContent() {
    return this.getParsedContent().footer
  }

  getContactContent() {
    return this.getParsedContent().contact
  }

  getHeroContent() {
    return this.getParsedContent().hero
  }

  getAboutContent() {
    return this.getParsedContent().about
  }

  getProfileContent() {
    return this.getParsedContent().profile
  }

  getLegalContent() {
    return this.getParsedContent().legal
  }

  getConsentContent() {
    return this.getParsedContent().consent
  }

  getServicesContent() {
    return this.getParsedContent().services
  }

  private getParsedContent(): AppContent {
    if (this.parsedContentCache) {
      return this.parsedContentCache
    }

    const parsed = AppContentSchema.safeParse(content)
    if (!parsed.success) {
      throw new Error('Invalid content schema')
    }
    this.parsedContentCache = parsed.data as AppContent
    return this.parsedContentCache
  }

  private getNormalizedNavbarContent(navbar: AppContent['navbar']): AppContent['navbar'] {
    const labelsByHref = new Map(navbar.links.map((link) => [link.href, link.label]))

    return {
      ...navbar,
      links: [
        { href: '#servicios', label: labelsByHref.get('#servicios') ?? 'Servicios' },
        { href: '#proceso', label: labelsByHref.get('#proceso') ?? 'Proceso' },
        { href: '#tarifas', label: labelsByHref.get('#tarifas') ?? 'Tarifas' },
        { href: '#cobertura', label: labelsByHref.get('#cobertura') ?? 'Cobertura' },
        { href: '#faq', label: labelsByHref.get('#faq') ?? 'FAQ' },
        { href: '#contacto', label: labelsByHref.get('#contacto') ?? 'Contacto' }
      ]
    }
  }
}
