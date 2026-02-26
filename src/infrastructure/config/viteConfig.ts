import type { ConfigPort } from '@/application/ports/Config'
import { publicConfig } from '@/infrastructure/config/publicConfig'

type NullableString = string | undefined

const CONTACT_EMAIL_FALLBACK = 'contacto@example.com'
const ALLOW_INSECURE_BACKEND_FLAG = 'runtimeProfile.allowInsecureBackend'
const E2E_BUILD_MODE = 'e2e'

export class ViteConfig implements ConfigPort {
  brandId: NullableString
  storageNamespace: NullableString
  inquiryApiUrl: NullableString
  mailApiUrl: NullableString
  pricingApiUrl: NullableString
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
    const allowInsecureBackend = publicConfig.allowInsecureBackend
    const backendBaseUrl = ensureApiBaseUrl(
      normalize(publicConfig.backendBaseUrl),
      'backendBaseUrl',
      allowInsecureBackend
    )
    this.inquiryApiUrl = resolveApiEndpoint(
      normalize(publicConfig.inquiryApiUrl),
      backendBaseUrl,
      '/v1/contact',
      'inquiryApiUrl',
      allowInsecureBackend
    )
    this.mailApiUrl = resolveApiEndpoint(
      normalize(publicConfig.mailApiUrl),
      backendBaseUrl,
      '/v1/mail',
      'mailApiUrl',
      allowInsecureBackend
    )
    this.pricingApiUrl = resolveApiEndpoint(
      normalize(publicConfig.pricingApiUrl),
      backendBaseUrl,
      '/v1/public/pricing',
      'pricingApiUrl',
      allowInsecureBackend
    )
    this.quoteDiagnosticApiUrl = resolveApiEndpoint(
      normalize(publicConfig.quoteDiagnosticApiUrl),
      backendBaseUrl,
      '/v1/public/quote/diagnostic',
      'quoteDiagnosticApiUrl',
      allowInsecureBackend
    )
    this.quotePdfApiUrl = ensureEndpointUrl(
      normalize(publicConfig.quotePdfApiUrl),
      'quotePdfApiUrl',
      allowInsecureBackend
    )
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

function resolveApiEndpoint(
  directUrl: NullableString,
  baseUrl: NullableString,
  path: string,
  configKey: string,
  allowInsecureBackend: boolean
): NullableString {
  const normalizedEndpoint = ensureEndpointUrl(directUrl, configKey, allowInsecureBackend)
  if (normalizedEndpoint) {
    return normalizedEndpoint
  }
  return buildEndpointUrl(baseUrl, path)
}

function ensureApiBaseUrl(
  value: NullableString,
  configKey: string,
  allowInsecureBackend: boolean
): NullableString {
  if (!value) {
    return undefined
  }

  if (import.meta.env.DEV) {
    if (!value.startsWith('http://') && !value.startsWith('https://')) {
      console.warn(
        `[config] El campo ${configKey} debe comenzar con "http://" o "https://" en desarrollo. Valor recibido: ${value}`
      )
      return undefined
    }
    return value
  }

  if (!value.startsWith('https://')) {
    const canUseLocalBypass = allowInsecureBackend && import.meta.env.MODE === E2E_BUILD_MODE
    if (canUseLocalBypass) {
      try {
        const parsedUrl = new URL(value)
        const normalizedHost = parsedUrl.hostname.trim().toLowerCase()
        const isLoopbackHost =
          normalizedHost === 'localhost' || normalizedHost === '127.0.0.1' || normalizedHost === '::1'

        if (parsedUrl.protocol === 'http:' && isLoopbackHost) {
          console.warn(
            `[config] Se habilito bypass local para ${configKey} via ${ALLOW_INSECURE_BACKEND_FLAG}=true. Valor recibido: ${value}`
          )
          return value
        }
      } catch {
        // No-op: si URL no parsea, cae en validacion estricta de produccion.
      }
    }
    console.warn(
      `[config] El campo ${configKey} debe comenzar con "https://" en produccion. Valor recibido: ${value}`
    )
    return undefined
  }
  return value
}

function ensureEndpointUrl(
  value: NullableString,
  configKey: string,
  allowInsecureBackend: boolean
): NullableString {
  if (!value) {
    return undefined
  }

  if (value.startsWith('/')) {
    return value
  }

  return ensureApiBaseUrl(value, configKey, allowInsecureBackend)
}

function buildEndpointUrl(baseUrl: NullableString, path: string): NullableString {
  if (!baseUrl) {
    return undefined
  }
  return `${baseUrl.replace(/\/+$/, '')}${path}`
}
