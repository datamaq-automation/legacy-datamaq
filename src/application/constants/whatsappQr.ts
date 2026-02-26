import { publicConfig } from '@/infrastructure/config/publicConfig'

export interface WhatsAppQrConfig {
  phoneE164: string
  message: string
  sourceTag: string
}

export const whatsappQrConfig: WhatsAppQrConfig = {
  phoneE164: publicConfig.whatsappQrPhoneE164?.trim() ?? '',
  message:
    publicConfig.whatsappQrMessage?.trim() ??
    'Hola, te contacto desde la web. Podemos coordinar?',
  sourceTag: publicConfig.whatsappQrSourceTag?.trim() ?? 'qr_card'
}

export function buildWhatsAppQrMessage(config: WhatsAppQrConfig = whatsappQrConfig): string {
  const normalizedMessage = config.message.trim()
  const normalizedTag = config.sourceTag.trim()
  if (!normalizedTag) {
    return normalizedMessage
  }
  return `${normalizedMessage}\n\nOrigen: ${normalizedTag}`
}

export function buildWhatsAppQrHref(config: WhatsAppQrConfig = whatsappQrConfig): string {
  const phoneE164 = normalizePhone(config.phoneE164)
  if (!phoneE164) {
    return publicConfig.whatsappUrl?.trim() ?? ''
  }
  const text = encodeURIComponent(buildWhatsAppQrMessage(config))
  return `https://wa.me/${phoneE164}?text=${text}`
}

function normalizePhone(value: string): string {
  return value.replace(/[^\d]/g, '').trim()
}
