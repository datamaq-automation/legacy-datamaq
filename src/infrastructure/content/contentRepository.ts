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
import { DynamicContentService } from '@/infrastructure/content/dynamicContentService'
import { DynamicPricingService } from '@/infrastructure/content/dynamicPricingService'
import { normalizeNavbarContent } from '@/infrastructure/content/navbarNormalizer'
import { NoopLogger } from '@/infrastructure/logging/noopLogger'
import type { AppContent } from '@/domain/types/content'

type RemoteContentStatus = 'pending' | 'ready' | 'unavailable' | 'not-required'

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
  private readonly dynamicContentService: DynamicContentService
  private readonly dynamicPricingService: DynamicPricingService
  private remoteContentStatus: RemoteContentStatus

  constructor(
    private config?: Pick<ConfigPort, 'pricingApiUrl' | 'contentApiUrl'>,
    private logger: LoggerPort = new NoopLogger()
  ) {
    this.contentStore = new ContentStore(commercialConfig, buildAppContent)
    this.remoteContentStatus = this.config?.contentApiUrl ? 'pending' : 'not-required'
    this.dynamicContentService = new DynamicContentService(
      this.config?.contentApiUrl,
      this.logger,
      (snapshot) => this.contentStore.applyRemoteContentSnapshot(snapshot, this.logger),
      (title) => this.contentStore.applyHeroTitle(title, this.logger),
      () => {
        this.remoteContentStatus = 'ready'
      },
      () => {
        this.remoteContentStatus = 'unavailable'
      }
    )
    this.dynamicPricingService = new DynamicPricingService(
      this.config?.pricingApiUrl,
      this.logger,
      (snapshot) => this.contentStore.applyCommercialPricingSnapshot(snapshot, this.logger)
    )
    this.dynamicContentService.bootstrap()
    this.dynamicPricingService.bootstrap()
  }

  getRemoteContentStatus(): RemoteContentStatus {
    return this.remoteContentStatus
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
