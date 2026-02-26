/*
Path: src/infrastructure/content/Appcontent.datamaq.ts
*/

import type { CommercialConfig } from '@/domain/types/content'
import { getRuntimeProfile } from '@/infrastructure/content/runtimeProfile'

const profile = getRuntimeProfile('datamaq')

export const commercialConfig: CommercialConfig = {
  brandName: profile.brandName,
  brandAriaLabel: profile.brandAriaLabel,
  baseOperativa: profile.baseOperativa,
  whatsappUrl: profile.whatsappUrl ?? 'https://wa.me/5491100000000',
  ...profile.commercialConfig
}
