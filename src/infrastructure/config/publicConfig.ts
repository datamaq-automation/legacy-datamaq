/*
Path: src/infrastructure/config/publicConfig.ts
*/

import { activeRuntimeProfile } from '@/infrastructure/content/runtimeProfile'
import { resolveBackendEndpointOverride } from '@/infrastructure/config/backendEndpointOverrides'

type NullableString = string | undefined
type PublicBoolean = boolean | undefined

export type PublicConfig = {
  brandId: string
  storageNamespace: string
  clarityProjectId: NullableString
  ga4Id: NullableString
  analyticsEnabled: PublicBoolean
  siteUrl: NullableString
  siteName: NullableString
  siteDescription: NullableString
  siteOgImage: NullableString
  siteLocale: NullableString
  gscVerification: NullableString
  businessName: NullableString
  businessTelephone: NullableString
  businessEmail: NullableString
  businessStreet: NullableString
  businessLocality: NullableString
  businessRegion: NullableString
  businessPostalCode: NullableString
  businessCountry: NullableString
  businessLat: NullableString
  businessLng: NullableString
  businessArea: NullableString
  contactEmail: NullableString
  contactFormActive: boolean
  inquiryApiUrl: NullableString
  healthApiUrl: NullableString
  whatsappUrl: NullableString
  whatsappQrPhoneE164: NullableString
  whatsappQrMessage: NullableString
  whatsappQrSourceTag: NullableString
}

export const publicConfig: PublicConfig = {
  brandId: activeRuntimeProfile.brandId,
  storageNamespace: activeRuntimeProfile.storageNamespace,
  clarityProjectId: activeRuntimeProfile.clarityProjectId,
  ga4Id: activeRuntimeProfile.ga4Id,
  analyticsEnabled: activeRuntimeProfile.analyticsEnabled,
  siteUrl: activeRuntimeProfile.siteUrl,
  siteName: activeRuntimeProfile.siteName,
  siteDescription: activeRuntimeProfile.siteDescription,
  siteOgImage: activeRuntimeProfile.siteOgImage,
  siteLocale: activeRuntimeProfile.siteLocale,
  gscVerification: activeRuntimeProfile.gscVerification,
  businessName: activeRuntimeProfile.businessName,
  businessTelephone: activeRuntimeProfile.businessTelephone,
  businessEmail: activeRuntimeProfile.businessEmail,
  businessStreet: activeRuntimeProfile.businessStreet,
  businessLocality: activeRuntimeProfile.businessLocality,
  businessRegion: activeRuntimeProfile.businessRegion,
  businessPostalCode: activeRuntimeProfile.businessPostalCode,
  businessCountry: activeRuntimeProfile.businessCountry,
  businessLat: activeRuntimeProfile.businessLat,
  businessLng: activeRuntimeProfile.businessLng,
  businessArea: activeRuntimeProfile.businessArea,
  contactEmail: activeRuntimeProfile.contactEmail,
  contactFormActive: activeRuntimeProfile.contactFormActive,
  inquiryApiUrl: resolveBackendEndpointOverride('inquiryApiUrl', activeRuntimeProfile.inquiryApiUrl),
  healthApiUrl: resolveBackendEndpointOverride('healthApiUrl', activeRuntimeProfile.healthApiUrl),
  whatsappUrl: activeRuntimeProfile.whatsappUrl,
  whatsappQrPhoneE164: activeRuntimeProfile.whatsappQrPhoneE164,
  whatsappQrMessage: activeRuntimeProfile.whatsappQrMessage,
  whatsappQrSourceTag: activeRuntimeProfile.whatsappQrSourceTag
}
