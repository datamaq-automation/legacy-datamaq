import { reactive } from 'vue'
import { SiteSnapshotSchema } from '@/domain/schemas/siteSchema'
import type { AppContent, CommercialConfig } from '@/domain/types/content'
import type { BrandContent, SeoContent, SiteSnapshot } from '@/domain/types/site'

export class ContentStore {
  private parsedSiteCache: SiteSnapshot | undefined

  constructor(
    private commercialConfig: CommercialConfig,
    private buildContent: (config: CommercialConfig) => AppContent,
    private buildBrand: (config: CommercialConfig) => BrandContent,
    private buildSeo: () => SeoContent
  ) {}

  getParsedSiteSnapshot(): SiteSnapshot {
    if (this.parsedSiteCache) {
      return this.parsedSiteCache
    }

    const parsed = SiteSnapshotSchema.safeParse(this.buildFallbackSiteSnapshot())
    if (!parsed.success) {
      throw new Error('Invalid site schema')
    }

    this.parsedSiteCache = reactive(parsed.data as SiteSnapshot) as SiteSnapshot
    return this.parsedSiteCache
  }

  getParsedContent(): AppContent {
    return this.getParsedSiteSnapshot().content
  }

  getParsedBrand(): BrandContent {
    return this.getParsedSiteSnapshot().brand
  }

  getParsedSeo(): SeoContent {
    return this.getParsedSiteSnapshot().seo
  }

  private buildFallbackSiteSnapshot(): SiteSnapshot {
    return {
      content: this.buildContent(this.commercialConfig),
      brand: this.buildBrand(this.commercialConfig),
      seo: this.buildSeo()
    }
  }
}
