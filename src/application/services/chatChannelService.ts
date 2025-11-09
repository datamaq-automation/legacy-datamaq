import { config, isWhatsappConfigured } from '../../infrastructure/config'

export function isChatEnabled(): boolean {
  return isWhatsappConfigured()
}

export function getChatUrl(): string {
  return config.CHAT_URL ?? ''
}

export function buildWhatsappUrl(): string {
  if (!config.WHATSAPP_NUMBER) {
    throw new Error('WhatsApp number is not configured')
  }

  const presetMessage = config.WHATSAPP_PRESET_MESSAGE ?? ''
  return `https://wa.me/${config.WHATSAPP_NUMBER}?text=${encodeURIComponent(presetMessage)}`
}
