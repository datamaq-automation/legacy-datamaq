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
  ServicesContentPort
} from '@/application/ports/Content'
import type { AppContent } from '@/domain/types/content'
import { AppContentSchema } from '@/domain/schemas/contentSchema'
import { content } from '@/infrastructure/content/content'

export class ContentRepository
  implements
    ContentPort,
    NavbarContentPort,
    FooterContentPort,
    ContactContentPort,
    HeroContentPort,
    AboutContentPort,
    LegalContentPort,
    ConsentContentPort,
    ServicesContentPort
{
  getContent(): AppContent {
    return this.getParsedContent()
  }

  getNavbarContent() {
    return this.getParsedContent().navbar
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
    const parsed = AppContentSchema.safeParse(content)
    if (!parsed.success) {
      throw new Error('Invalid content schema')
    }
    return parsed.data as AppContent
  }
}
