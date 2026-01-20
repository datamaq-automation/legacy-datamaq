/*
Path: src/infrastructure/config.ts
*/

type NullableString = string | undefined

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
        `[config] La variable ${envKey} debe ser un correo electrónico válido. Valor recibido: ${value}`
      )
    return undefined
  }

  return value
}

function ensureApiUrl(value: NullableString, envKey: string): NullableString {
  if (!value) {
    return undefined
  }

  // Permitir http en desarrollo, exigir https en producción.
  if (import.meta.env.DEV) {
    if (!value.startsWith('http://') && !value.startsWith('https://')) {
      console.warn(
        `[config] La variable ${envKey} debe comenzar con "http://" o "https://" en desarrollo. Valor recibido: ${value}`
      )
      return undefined
    }
    return value
  } else {
    if (!value.startsWith('https://')) {
      console.warn(
        `[config] La variable ${envKey} debe comenzar con "https://" en producción. Valor recibido: ${value}`
      )
      return undefined
    }
    return value
  }
}

const WHATSAPP_PRESET_FALLBACK = 'Vengo de la página web, quiero más información.'
const CONTACT_EMAIL_FALLBACK = 'contacto@profebustos.com.ar'


const whatsappNumber = normalize(import.meta.env.VITE_WHATSAPP_NUMBER)
const whatsappPresetMessage =
  normalize(import.meta.env.VITE_WHATSAPP_PRESET_MESSAGE) ?? WHATSAPP_PRESET_FALLBACK
const clarityProjectId = normalize(import.meta.env.VITE_CLARITY_PROJECT_ID)
const ga4Id = normalize(import.meta.env.VITE_GA4_ID)
const contactEmail =
  ensureEmail(normalize(import.meta.env.VITE_CONTACT_EMAIL), 'VITE_CONTACT_EMAIL') ??
  CONTACT_EMAIL_FALLBACK
const contactApiUrl = ensureApiUrl(
  normalize(import.meta.env.VITE_CONTACT_API_URL),
  'VITE_CONTACT_API_URL'
)

export const config = {
  WHATSAPP_NUMBER: whatsappNumber,
  WHATSAPP_PRESET_MESSAGE: whatsappPresetMessage,
  CLARITY_PROJECT_ID: clarityProjectId,
  GA4_ID: ga4Id,
  CONTACT_EMAIL: contactEmail,
  CONTACT_API_URL: contactApiUrl
} as const

export function isWhatsappConfigured(): boolean {
  return Boolean(whatsappNumber)
}

export function getAnalyticsIds(): {
  clarityProjectId: NullableString
  ga4Id: NullableString
} {
  return {
    clarityProjectId: clarityProjectId ?? undefined,
    ga4Id: ga4Id ?? undefined
  }
}

export function getContactEmail(): string {
  return contactEmail
}
