import type { ContentPort } from '@/application/ports/Content'
import { reactive } from 'vue'
import { SiteSnapshotSchema } from '@/domain/schemas/siteSchema'
import { normalizeNavbarContent } from '@/infrastructure/content/navbarNormalizer'
import { datamaqSiteSnapshot } from '@/infrastructure/content/siteSnapshot.datamaq'
import type { AppContent } from '@/domain/types/content'
import type { SiteSnapshot } from '@/domain/types/site'

export class ContentRepository implements ContentPort {
  private parsedSiteCache: SiteSnapshot | undefined

  getContent(): AppContent {
    const parsedContent = this.getParsedSiteSnapshot().content
    return {
      ...parsedContent,
      navbar: normalizeNavbarContent(parsedContent.navbar)
    }
  }

  getSiteSnapshot(): SiteSnapshot {
    const snapshot = this.getParsedSiteSnapshot()
    return {
      ...snapshot,
      content: this.getContent()
    }
  }

  getNavbarContent() {
    return normalizeNavbarContent(this.getParsedSiteSnapshot().content.navbar)
  }

  getFooterContent() {
    return this.getParsedSiteSnapshot().content.footer
  }

  getContactContent() {
    return this.getParsedSiteSnapshot().content.contact
  }

  getHeroContent() {
    return this.getParsedSiteSnapshot().content.hero
  }

  getAboutContent() {
    return this.getParsedSiteSnapshot().content.about
  }

  getProfileContent() {
    return this.getParsedSiteSnapshot().content.profile
  }

  getLegalContent() {
    return this.getParsedSiteSnapshot().content.legal
  }

  getConsentContent() {
    return this.getParsedSiteSnapshot().content.consent
  }

  getServicesContent() {
    return this.getParsedSiteSnapshot().content.services
  }

  getBrandContent() {
    return this.getParsedSiteSnapshot().brand
  }

  getSeoContent() {
    return this.getParsedSiteSnapshot().seo
  }

  getHomePageContent() {
    return this.getParsedSiteSnapshot().content.homePage
  }

  getContactPageContent() {
    return this.getParsedSiteSnapshot().content.contactPage
  }

  private getParsedSiteSnapshot(): SiteSnapshot {
    if (this.parsedSiteCache) {
      return this.parsedSiteCache
    }

    const parsed = SiteSnapshotSchema.safeParse(datamaqSiteSnapshot)
    if (!parsed.success) {
      throw new Error('Invalid site schema')
    }

    this.parsedSiteCache = reactive(parsed.data as SiteSnapshot) as SiteSnapshot
    return this.parsedSiteCache
  }
}
