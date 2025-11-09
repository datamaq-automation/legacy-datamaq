/*
Path: src/infrastructure/config.ts
*/

type NullableString = string | undefined

function normalize(value: string | undefined): NullableString {
  const trimmed = value?.trim()
  return trimmed ? trimmed : undefined
}

function ensureHttpsUrl(value: NullableString, envKey: string): NullableString {
  if (!value) {
    return undefined
  }

  if (!value.startsWith('https://')) {
    if (import.meta.env.DEV) {
      console.warn(
        `[config] La variable ${envKey} debe comenzar con "https://". Valor recibido: ${value}`
      )
    }

    return undefined
  }

  return value
}

const WHATSAPP_PRESET_FALLBACK = 'Vengo de la página web, quiero más información.'

const whatsappNumber = normalize(import.meta.env.VITE_WHATSAPP_NUMBER)
const chatUrl = ensureHttpsUrl(normalize(import.meta.env.VITE_CHAT_URL), 'VITE_CHAT_URL')
const whatsappPresetMessage =
  normalize(import.meta.env.VITE_WHATSAPP_PRESET_MESSAGE) ?? WHATSAPP_PRESET_FALLBACK
const clarityProjectId = normalize(import.meta.env.VITE_CLARITY_PROJECT_ID)
const ga4Id = normalize(import.meta.env.VITE_GA4_ID)

export const config = {
  WHATSAPP_NUMBER: whatsappNumber,
  CHAT_URL: chatUrl,
  WHATSAPP_PRESET_MESSAGE: whatsappPresetMessage,
  CLARITY_PROJECT_ID: clarityProjectId,
  GA4_ID: ga4Id
} as const

export function isWhatsappConfigured(): boolean {
  return Boolean(whatsappNumber)
}

export function getAnalyticsIds(): {
  clarityProjectId?: string
  ga4Id?: string
} {
  return {
    clarityProjectId,
    ga4Id
  }
}
