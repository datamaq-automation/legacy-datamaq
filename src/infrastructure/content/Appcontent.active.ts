import type { CommercialConfig } from '@/domain/types/content'
import { activeRuntimeProfile } from '@/infrastructure/content/runtimeProfile'
import { buildAppContent } from '@/infrastructure/content/Appcontent.shared'

const { brandName, brandAriaLabel, baseOperativa, whatsappUrl } = activeRuntimeProfile

export const commercialConfig: CommercialConfig = {
  brandName,
  brandAriaLabel,
  baseOperativa,
  whatsappUrl: whatsappUrl ?? 'https://wa.me/5491100000000',
  ...activeRuntimeProfile.commercialConfig
}

export { buildAppContent }
