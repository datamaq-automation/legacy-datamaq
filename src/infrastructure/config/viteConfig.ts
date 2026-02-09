import type { ConfigPort } from '@/application/ports/Config'
import { publicConfig } from '@/infrastructure/config/publicConfig'

type NullableString = string | undefined

const CONTACT_EMAIL_FALLBACK = 'contacto@datamaq.com.ar'

export class ViteConfig implements ConfigPort {
  contactApiUrl: NullableString
  contactEmail: NullableString
  originVerifySecret: NullableString
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
    this.contactEmail =
      ensureEmail(
        normalize(import.meta.env.VITE_CONTACT_EMAIL) ??
          normalize(publicConfig.contactEmail),
        'contactEmail'
      ) ?? CONTACT_EMAIL_FALLBACK
    this.contactApiUrl = ensureApiUrl(
      normalize(import.meta.env.VITE_CONTACT_API_URL) ??
        normalize(publicConfig.contactApiUrl),
      'contactApiUrl'
    )
    this.originVerifySecret = normalize(import.meta.env.VITE_ORIGIN_VERIFY_SECRET)
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

function ensureEmail(value: NullableString, envKey: string): NullableString {
  if (!value) {
    return undefined
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailPattern.test(value)) {
      console.warn(
        `[config] La variable ${envKey} debe ser un correo electronico valido. Valor recibido: ${value}`
      )
    return undefined
  }

  return value
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
