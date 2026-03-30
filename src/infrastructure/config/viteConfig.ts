import type { ConfigPort } from '@/application/ports/Config'
import { publicConfig } from '@/infrastructure/config/publicConfig'
import {
  resolveBackendConfigEndpoint,
  resolveBackendEndpointPolicyMode
} from '@/infrastructure/backend/backendConfigEndpoint'

type NullableString = string | undefined

const CONTACT_EMAIL_FALLBACK = 'contacto@example.com'

export class ViteConfig implements ConfigPort {
  brandId: NullableString
  storageNamespace: NullableString
  inquiryApiUrl: NullableString
  pricingApiUrl: NullableString
  siteApiUrl: NullableString
  healthApiUrl: NullableString
  requireRemoteContent: boolean
  contactEmail: NullableString
  contactFormActive: boolean
  analyticsEnabled: boolean | undefined
  ga4Id: NullableString
  clarityProjectId: NullableString
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

  constructor() {
    this.brandId = normalize(publicConfig.brandId)
    this.storageNamespace = normalize(publicConfig.storageNamespace)
    this.contactEmail = normalize(publicConfig.contactEmail) ?? CONTACT_EMAIL_FALLBACK
    const endpointOptions = {
      isDev: import.meta.env.DEV,
      policyMode: resolveBackendEndpointPolicyMode({
        isDev: import.meta.env.DEV,
        policyMode: normalizePolicyMode(import.meta.env.VITE_BACKEND_POLICY_MODE)
      }),
      warn: (message: string) => console.warn(message)
    }
    const inquiryApiUrl = resolveEndpointFromEnv(
      import.meta.env.VITE_INQUIRY_API_URL,
      publicConfig.inquiryApiUrl
    )
    const healthApiUrl = resolveEndpointFromEnv(
      import.meta.env.VITE_HEALTH_API_URL,
      publicConfig.healthApiUrl
    )
    this.inquiryApiUrl = resolveBackendConfigEndpoint({
      directUrl: inquiryApiUrl,
      configKey: 'inquiryApiUrl',
      ...endpointOptions
    })
    this.pricingApiUrl = resolveBackendConfigEndpoint({
      directUrl: normalize(publicConfig.pricingApiUrl),
      configKey: 'pricingApiUrl',
      ...endpointOptions
    })
    this.siteApiUrl = resolveBackendConfigEndpoint({
      directUrl: normalize(publicConfig.siteApiUrl),
      configKey: 'siteApiUrl',
      ...endpointOptions
    })
    this.healthApiUrl = resolveBackendConfigEndpoint({
      directUrl: healthApiUrl,
      configKey: 'healthApiUrl',
      ...endpointOptions
    })
    this.requireRemoteContent = Boolean(publicConfig.requireRemoteContent)
    this.contactFormActive = publicConfig.contactFormActive
    this.analyticsEnabled = publicConfig.analyticsEnabled
    this.ga4Id = normalize(publicConfig.ga4Id)
    this.clarityProjectId = normalize(publicConfig.clarityProjectId)
    this.siteUrl = normalize(publicConfig.siteUrl)
    this.siteName = normalize(publicConfig.siteName)
    this.siteDescription = normalize(publicConfig.siteDescription)
    this.siteOgImage = normalize(publicConfig.siteOgImage)
    this.siteLocale = normalize(publicConfig.siteLocale)
    this.gscVerification = normalize(publicConfig.gscVerification)
    this.businessName = normalize(publicConfig.businessName)
    this.businessTelephone = normalize(publicConfig.businessTelephone)
    this.businessEmail = normalize(publicConfig.businessEmail)
    this.businessStreet = normalize(publicConfig.businessStreet)
    this.businessLocality = normalize(publicConfig.businessLocality)
    this.businessRegion = normalize(publicConfig.businessRegion)
    this.businessPostalCode = normalize(publicConfig.businessPostalCode)
    this.businessCountry = normalize(publicConfig.businessCountry)
    this.businessLat = normalize(publicConfig.businessLat)
    this.businessLng = normalize(publicConfig.businessLng)
    this.businessArea = normalize(publicConfig.businessArea)
  }
}

function normalize(value: string | undefined): NullableString {
  const trimmed = value?.trim()
  return trimmed ? trimmed : undefined
}

function resolveEndpointFromEnv(
  envValue: string | undefined,
  fallback: string | undefined
): NullableString {
  return normalize(envValue) ?? normalize(fallback)
}

function normalizePolicyMode(value: string | undefined) {
  const normalizedValue = normalize(value)?.toLowerCase()
  if (
    normalizedValue === 'development' ||
    normalizedValue === 'local-preview' ||
    normalizedValue === 'production'
  ) {
    return normalizedValue
  }

  return undefined
}
