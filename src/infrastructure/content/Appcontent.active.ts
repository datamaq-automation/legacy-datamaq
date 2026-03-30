import type { CommercialConfig } from '@/domain/types/content'
import { activeRuntimeProfile } from '@/infrastructure/content/runtimeProfile'
import type { AppContent } from '@/domain/types/content'
import type { BrandContent, SeoContent } from '@/domain/types/site'
import { datamaqSiteSnapshot } from '@/infrastructure/content/siteSnapshot.datamaq'

const { brandName, brandAriaLabel, baseOperativa, whatsappUrl } = activeRuntimeProfile

export const commercialConfig: CommercialConfig = {
  brandName,
  brandAriaLabel,
  baseOperativa,
  whatsappUrl: whatsappUrl ?? 'https://wa.me/5491100000000',
  ...activeRuntimeProfile.commercialConfig
}

export function buildAppContent(_config: CommercialConfig): AppContent {
  return datamaqSiteSnapshot.content
}

export function buildBrandContent(_config: CommercialConfig): BrandContent {
  return datamaqSiteSnapshot.brand
}

export function buildSeoContent(): SeoContent {
  return datamaqSiteSnapshot.seo
}
