import type { ConfigPort } from '@/application/ports/Config'

type NullableString = string | undefined

const WHATSAPP_PRESET_FALLBACK = 'Vengo de la pagina web, quiero mas informacion.'
const CONTACT_EMAIL_FALLBACK = 'contacto@profebustos.com.ar'

export class ViteConfig implements ConfigPort {
  contactApiUrl: NullableString
  contactEmail: NullableString
  whatsappNumber: NullableString
  whatsappPresetMessage: NullableString
  originVerifySecret: NullableString

  constructor() {
    this.whatsappNumber = normalize(import.meta.env.VITE_WHATSAPP_NUMBER)
    this.whatsappPresetMessage =
      normalize(import.meta.env.VITE_WHATSAPP_PRESET_MESSAGE) ?? WHATSAPP_PRESET_FALLBACK
    this.contactEmail =
      ensureEmail(normalize(import.meta.env.VITE_CONTACT_EMAIL), 'VITE_CONTACT_EMAIL') ??
      CONTACT_EMAIL_FALLBACK
    this.contactApiUrl = ensureApiUrl(
      normalize(import.meta.env.VITE_CONTACT_API_URL),
      'VITE_CONTACT_API_URL'
    )
    this.originVerifySecret = normalize(import.meta.env.VITE_ORIGIN_VERIFY_SECRET)
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
    if (import.meta.env.DEV) {
      console.warn(
        `[config] La variable ${envKey} debe ser un correo electronico valido. Valor recibido: ${value}`
      )
    }

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
