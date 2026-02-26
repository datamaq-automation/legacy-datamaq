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
import type { ConfigPort } from '@/application/ports/Config'
import type { LoggerPort } from '@/application/ports/Logger'
import { buildAppContent, commercialConfig } from '@/infrastructure/content/Appcontent.active'
import { ContentStore } from '@/infrastructure/content/contentStore'
import { DynamicPricingService } from '@/infrastructure/content/dynamicPricingService'
import { normalizeNavbarContent } from '@/infrastructure/content/navbarNormalizer'
import { NoopLogger } from '@/infrastructure/logging/noopLogger'
import type { AppContent } from '@/domain/types/content'

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
  private readonly contentStore: ContentStore
  private readonly dynamicPricingService: DynamicPricingService

  constructor(
    private config?: Pick<ConfigPort, 'pricingApiUrl'>,
    private logger: LoggerPort = new NoopLogger()
  ) {
    this.contentStore = new ContentStore(commercialConfig, buildAppContent)
    this.dynamicPricingService = new DynamicPricingService(
      this.config?.pricingApiUrl,
      this.logger,
      (snapshot) => this.contentStore.applyCommercialPricingSnapshot(snapshot, this.logger)
    )
    this.dynamicPricingService.bootstrap()
  }

  getContent(): AppContent {
    const parsedContent = this.contentStore.getParsedContent()
    return {
      ...parsedContent,
      navbar: normalizeNavbarContent(parsedContent.navbar)
    }
  }

  getNavbarContent() {
    return normalizeNavbarContent(this.contentStore.getParsedContent().navbar)
  }

  getFooterContent() {
    return this.contentStore.getParsedContent().footer
  }

  getContactContent() {
    return this.contentStore.getParsedContent().contact
  }

  getHeroContent() {
    return this.contentStore.getParsedContent().hero
  }

  getAboutContent() {
    return this.contentStore.getParsedContent().about
  }

  getProfileContent() {
    return this.contentStore.getParsedContent().profile
  }

  getLegalContent() {
    return this.contentStore.getParsedContent().legal
  }

  getConsentContent() {
    return this.contentStore.getParsedContent().consent
  }

  getServicesContent() {
    return this.contentStore.getParsedContent().services
  }
}
