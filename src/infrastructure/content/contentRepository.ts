import type { ContentPort } from '@/application/ports/Content'
import {
  buildAppContent,
  buildBrandContent,
  buildSeoContent,
  commercialConfig
} from '@/infrastructure/content/Appcontent.active'
import { ContentStore } from '@/infrastructure/content/contentStore'
import { normalizeNavbarContent } from '@/infrastructure/content/navbarNormalizer'
import type { AppContent } from '@/domain/types/content'
import type { SiteSnapshot } from '@/domain/types/site'

export class ContentRepository implements ContentPort {
  private readonly contentStore: ContentStore

  constructor() {
    this.contentStore = new ContentStore(commercialConfig, buildAppContent, buildBrandContent, buildSeoContent)
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
}
