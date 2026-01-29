import type { ConfigPort } from '@/application/ports/Config'
import { publicConfig } from '@/infrastructure/content/content'

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
    this.whatsappNumber = normalize(publicConfig.whatsappNumber)
    this.whatsappPresetMessage =
      normalize(publicConfig.whatsappPresetMessage) ?? WHATSAPP_PRESET_FALLBACK
    this.contactEmail =
      ensureEmail(normalize(publicConfig.contactEmail), 'contactEmail') ??
      CONTACT_EMAIL_FALLBACK
    this.contactApiUrl = ensureApiUrl(
      normalize(publicConfig.contactApiUrl),
      'contactApiUrl'
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
