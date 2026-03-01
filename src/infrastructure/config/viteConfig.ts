import type { ConfigPort } from '@/application/ports/Config'
import { publicConfig } from '@/infrastructure/config/publicConfig'
import {
  ensureBackendConfigEndpointUrl,
  resolveBackendConfigEndpoint,
  resolveBackendEndpointPolicyMode
} from '@/infrastructure/backend/backendConfigEndpoint'

type NullableString = string | undefined

const CONTACT_EMAIL_FALLBACK = 'contacto@example.com'

export class ViteConfig implements ConfigPort {
  brandId: NullableString
  storageNamespace: NullableString
  inquiryApiUrl: NullableString
  mailApiUrl: NullableString
  pricingApiUrl: NullableString
  siteApiUrl: NullableString
  healthApiUrl: NullableString
  requireRemoteContent: boolean
  quoteDiagnosticApiUrl: NullableString
  quotePdfApiUrl: NullableString
  contactEmail: NullableString
  contactFormActive: boolean
  emailFormActive: boolean
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
    this.inquiryApiUrl = resolveBackendConfigEndpoint({
      directUrl: normalize(publicConfig.inquiryApiUrl),
      configKey: 'inquiryApiUrl',
      ...endpointOptions
    })
    this.mailApiUrl = resolveBackendConfigEndpoint({
      directUrl: normalize(publicConfig.mailApiUrl),
      configKey: 'mailApiUrl',
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
      directUrl: normalize(publicConfig.healthApiUrl),
      configKey: 'healthApiUrl',
      ...endpointOptions
    })
    this.requireRemoteContent = Boolean(publicConfig.requireRemoteContent)
    this.quoteDiagnosticApiUrl = resolveBackendConfigEndpoint({
      directUrl: normalize(publicConfig.quoteDiagnosticApiUrl),
      configKey: 'quoteDiagnosticApiUrl',
      ...endpointOptions
    })
    this.quotePdfApiUrl = ensureBackendConfigEndpointUrl({
      value: normalize(publicConfig.quotePdfApiUrl),
      configKey: 'quotePdfApiUrl',
      ...endpointOptions
    })
    this.contactFormActive = publicConfig.contactFormActive
    this.emailFormActive = publicConfig.emailFormActive
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
