import type { CommercialConfig } from '@/domain/types/content'
import { activeRuntimeProfile } from '@/infrastructure/content/runtimeProfile'
import { buildLandingAppContent } from '@/infrastructure/content/landingContentBuilder'
import { buildFallbackBrandContent, buildFallbackSeoContent } from '@/infrastructure/content/siteFallback'

const { brandName, brandAriaLabel, baseOperativa, whatsappUrl } = activeRuntimeProfile

export const commercialConfig: CommercialConfig = {
  brandName,
  brandAriaLabel,
  baseOperativa,
  whatsappUrl: whatsappUrl ?? 'https://wa.me/5491100000000',
  ...activeRuntimeProfile.commercialConfig
}

export const buildAppContent = buildLandingAppContent
export const buildBrandContent = buildFallbackBrandContent
export const buildSeoContent = buildFallbackSeoContent
