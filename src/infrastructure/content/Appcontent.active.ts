import type { CommercialConfig } from '@/domain/types/content'
import { activeRuntimeProfile } from '@/infrastructure/content/runtimeProfile'
import { buildLandingAppContent } from '@/infrastructure/content/landingContentBuilder'

const { brandName, brandAriaLabel, baseOperativa, whatsappUrl } = activeRuntimeProfile

export const commercialConfig: CommercialConfig = {
  brandName,
  brandAriaLabel,
  baseOperativa,
  whatsappUrl: whatsappUrl ?? 'https://wa.me/5491100000000',
  ...activeRuntimeProfile.commercialConfig
}

export const buildAppContent = buildLandingAppContent
