import type { ConfigPort } from '@/application/ports/Config'
import { publicConfig } from '@/infrastructure/config/publicConfig'

type NullableString = string | undefined

const CONTACT_EMAIL_FALLBACK = 'contacto@datamaq.com.ar'

export class ViteConfig implements ConfigPort {
  inquiryApiUrl: NullableString
  mailApiUrl: NullableString
  contactEmail: NullableString
  contactFormActive: boolean
  emailFormActive: boolean
  analyticsEnabled: boolean | undefined
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
    this.contactEmail = normalize(publicConfig.contactEmail) ?? CONTACT_EMAIL_FALLBACK
    this.inquiryApiUrl = ensureApiUrl(
      normalize(import.meta.env.VITE_CONTACT_API_URL) ??
        normalize(publicConfig.inquiryApiUrl),
      'inquiryApiUrl'
    )
    this.mailApiUrl = ensureApiUrl(
      normalize(import.meta.env.VITE_MAIL_API_URL) ??
        normalize(publicConfig.mailApiUrl),
      'mailApiUrl'
    )
    this.contactFormActive = normalizeBoolean(
      import.meta.env.VITE_CONTACT_FORM_ACTIVE,
      publicConfig.contactFormActive,
      'VITE_CONTACT_FORM_ACTIVE'
    )
    this.emailFormActive = normalizeBoolean(
      import.meta.env.VITE_EMAIL_FORM_ACTIVE,
      publicConfig.emailFormActive,
      'VITE_EMAIL_FORM_ACTIVE'
    )
    this.analyticsEnabled = publicConfig.analyticsEnabled
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

function ensureApiUrl(value: NullableString, envKey: string): NullableString {
  if (!value) {
    return undefined
  }

  if (import.meta.env.DEV) {
    if (!value.startsWith('http://') && !value.startsWith('https://')) {
      console.warn(
        `[config] La variable ${envKey} debe comenzar con "http://" o "https://" en desarrollo. Valor recibido: ${value}`
      )
      return undefined
    }
    return value
  }

  if (!value.startsWith('https://')) {
    console.warn(
      `[config] La variable ${envKey} debe comenzar con "https://" en produccion. Valor recibido: ${value}`
    )
    return undefined
  }
  return value
}

function normalizeBoolean(
  rawValue: string | undefined,
  fallback: boolean,
  envKey: string
): boolean {
  if (rawValue === undefined) {
    return fallback
  }

  const normalized = rawValue.trim().toLowerCase()
  if (normalized === 'true') {
    return true
  }
  if (normalized === 'false') {
    return false
  }

  console.warn(
    `[config] La variable ${envKey} debe ser "true" o "false". Valor recibido: ${rawValue}`
  )
  return fallback
}
