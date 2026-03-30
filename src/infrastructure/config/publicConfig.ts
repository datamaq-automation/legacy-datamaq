/*
Path: src/infrastructure/config/publicConfig.ts
*/

import { datamaqSiteSnapshot } from '@/infrastructure/content/siteSnapshot.datamaq'
import { resolveBackendEndpointOverride } from '@/infrastructure/config/backendEndpointOverrides'

type NullableString = string | undefined
type PublicBoolean = boolean | undefined

const DATAMAQ_INQUIRY_API_URL = 'https://n8n.datamaq.com.ar/webhook/contact-form'
const DATAMAQ_HEALTH_API_URL = 'https://api.datamaq.com.ar/v1/health'
const DATAMAQ_STORAGE_NAMESPACE = 'datamaq'
const DATAMAQ_GA4_ID = 'G-X1ZQB8QLJC'
const DATAMAQ_CLARITY_PROJECT_ID = 'u24qtujrmg'

const { brand, seo } = datamaqSiteSnapshot

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
  brandId: brand.brandId,
  storageNamespace: DATAMAQ_STORAGE_NAMESPACE,
  clarityProjectId: DATAMAQ_CLARITY_PROJECT_ID,
  ga4Id: DATAMAQ_GA4_ID,
  analyticsEnabled: true,
  siteUrl: seo.siteUrl,
  siteName: seo.siteName,
  siteDescription: seo.siteDescription,
  siteOgImage: seo.siteOgImage,
  siteLocale: seo.siteLocale,
  gscVerification: seo.gscVerification,
  businessName: seo.business.name,
  businessTelephone: seo.business.telephone,
  businessEmail: seo.business.email,
  businessStreet: seo.business.street,
  businessLocality: seo.business.locality,
  businessRegion: seo.business.region,
  businessPostalCode: seo.business.postalCode,
  businessCountry: seo.business.country,
  businessLat: typeof seo.business.lat === 'number' ? String(seo.business.lat) : undefined,
  businessLng: typeof seo.business.lng === 'number' ? String(seo.business.lng) : undefined,
  businessArea: seo.business.areaServed?.join(', '),
  contactEmail: brand.contactEmail,
  contactFormActive: brand.contactFormActive,
  inquiryApiUrl: resolveBackendEndpointOverride('inquiryApiUrl', DATAMAQ_INQUIRY_API_URL),
  healthApiUrl: resolveBackendEndpointOverride('healthApiUrl', DATAMAQ_HEALTH_API_URL),
  whatsappUrl: brand.whatsappUrl,
  whatsappQrPhoneE164: brand.whatsappQr.phoneE164,
  whatsappQrMessage: brand.whatsappQr.message,
  whatsappQrSourceTag: brand.whatsappQr.sourceTag
}
