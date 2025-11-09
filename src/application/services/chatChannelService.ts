import { config } from '../../infrastructure/config'

export function isChatEnabled(): boolean {
  return Boolean(config.WHATSAPP_NUMBER)
}

export function getChatUrl(): string {
  return config.CHAT_URL ?? ''
}

export function buildWhatsappUrl(): string {
  if (!config.WHATSAPP_NUMBER) {
    throw new Error('WhatsApp number is not configured')
  }

  const presetMessage = config.PRESET_MSG ?? ''
  return `https://wa.me/${config.WHATSAPP_NUMBER}?text=${encodeURIComponent(presetMessage)}`
}
