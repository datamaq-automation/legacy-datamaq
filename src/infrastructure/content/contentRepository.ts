/*
Path: src/infrastructure/content/contentRepository.ts
*/

import type {
  AboutContentPort,
  BrandContentPort,
  ContactPageContentPort,
  ConsentContentPort,
  ContactContentPort,
  ContentPort,
  FooterContentPort,
  HeroContentPort,
  HomePageContentPort,
  LegalContentPort,
  NavbarContentPort,
  ProfileContentPort,
  RemoteContentStatus,
  RemoteContentStatusPort,
  SeoContentPort,
  SiteSnapshotPort,
  ServicesContentPort
} from '@/application/ports/Content'
import type { ConfigPort } from '@/application/ports/Config'
import type { LoggerPort } from '@/application/ports/Logger'
import type { HttpClient } from '@/application/ports/HttpClient'
import {
  buildAppContent,
  buildBrandContent,
  buildSeoContent,
  commercialConfig
} from '@/infrastructure/content/Appcontent.active'
import { ContentStore } from '@/infrastructure/content/contentStore'
import { DynamicContentService } from '@/infrastructure/content/dynamicContentService'
import { DynamicPricingService } from '@/infrastructure/content/dynamicPricingService'
import { FetchHttpClient } from '@/infrastructure/http/fetchHttpClient'
import { normalizeNavbarContent } from '@/infrastructure/content/navbarNormalizer'
import { NoopLogger } from '@/infrastructure/logging/noopLogger'
import type { AppContent } from '@/domain/types/content'
import type { SiteSnapshot } from '@/domain/types/site'

export class ContentRepository
  implements
    ContentPort,
    SiteSnapshotPort,
    RemoteContentStatusPort,
    NavbarContentPort,
    FooterContentPort,
    ContactContentPort,
    HeroContentPort,
    AboutContentPort,
    ProfileContentPort,
    LegalContentPort,
    ConsentContentPort,
    ServicesContentPort,
    BrandContentPort,
    SeoContentPort,
    HomePageContentPort,
    ContactPageContentPort
{
  private readonly contentStore: ContentStore
  private readonly dynamicContentService: DynamicContentService
  private readonly dynamicPricingService: DynamicPricingService
  private readonly remoteContentStatusListeners = new Set<(status: RemoteContentStatus) => void>()
  private remoteBootstrapStarted = false
  private remoteContentStatus: RemoteContentStatus

  constructor(
    private config?: Pick<ConfigPort, 'pricingApiUrl' | 'siteApiUrl' | 'requireRemoteContent'>,
    private logger: LoggerPort = new NoopLogger(),
    private http: HttpClient = new FetchHttpClient(logger)
  ) {
    this.contentStore = new ContentStore(commercialConfig, buildAppContent, buildBrandContent, buildSeoContent)
    const requiresRemoteContent = Boolean(this.config?.requireRemoteContent)
    this.remoteContentStatus = this.config?.siteApiUrl && requiresRemoteContent ? 'pending' : 'not-required'
    this.dynamicContentService = new DynamicContentService(
      this.http,
      this.config?.siteApiUrl,
      this.logger,
      (snapshot) => this.contentStore.applyRemoteSiteSnapshot(snapshot, this.logger),
      () => {
        this.setRemoteContentStatus('ready')
      },
      () => {
        if (requiresRemoteContent) {
          this.setRemoteContentStatus('unavailable')
        }
      }
    )
    this.dynamicPricingService = new DynamicPricingService(
      this.http,
      this.config?.pricingApiUrl,
      this.logger,
      (snapshot) => this.contentStore.applyCommercialPricingSnapshot(snapshot, this.logger)
    )
  }

  getRemoteContentStatus(): RemoteContentStatus {
    return this.remoteContentStatus
  }

  subscribeRemoteContentStatus(listener: (status: RemoteContentStatus) => void): () => void {
    this.remoteContentStatusListeners.add(listener)

    return () => {
      this.remoteContentStatusListeners.delete(listener)
    }
  }

  bootstrapRemoteData(): void {
    if (this.remoteBootstrapStarted) {
      return
    }

    this.remoteBootstrapStarted = true
    this.dynamicContentService.bootstrap()
    this.dynamicPricingService.bootstrap()
  }

  getContent(): AppContent {
    const parsedContent = this.contentStore.getParsedContent()
    return {
      ...parsedContent,
      navbar: normalizeNavbarContent(parsedContent.navbar)
    }
  }

  getSiteSnapshot(): SiteSnapshot {
    const snapshot = this.contentStore.getParsedSiteSnapshot()
    return {
      ...snapshot,
      content: this.getContent()
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

  getBrandContent() {
    return this.contentStore.getParsedBrand()
  }

  getSeoContent() {
    return this.contentStore.getParsedSeo()
  }

  getHomePageContent() {
    return this.contentStore.getParsedContent().homePage
  }

  getContactPageContent() {
    return this.contentStore.getParsedContent().contactPage
  }

  private setRemoteContentStatus(status: RemoteContentStatus): void {
    if (this.remoteContentStatus === status) {
      return
    }

    this.remoteContentStatus = status
    this.remoteContentStatusListeners.forEach((listener) => listener(status))
  }
}
