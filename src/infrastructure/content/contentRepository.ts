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
import { content } from '@/infrastructure/content/content'

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
}
