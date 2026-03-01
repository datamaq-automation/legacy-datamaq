import { useContainer } from '@/di/container'

export interface WhatsAppQrConfig {
  phoneE164: string
  message: string
  sourceTag: string
}

export function getWhatsAppQrConfig(): WhatsAppQrConfig {
  const qr = useContainer().content.getBrandContent().whatsappQr
  return {
    phoneE164: qr.phoneE164?.trim() ?? '',
    message: qr.message.trim(),
    sourceTag: qr.sourceTag.trim()
  }
}

export function buildWhatsAppQrMessage(config: WhatsAppQrConfig = getWhatsAppQrConfig()): string {
  const normalizedMessage = config.message.trim()
  const normalizedTag = config.sourceTag.trim()
  if (!normalizedTag) {
    return normalizedMessage
  }
  return `${normalizedMessage}\n\nOrigen: ${normalizedTag}`
}

export function buildWhatsAppQrHref(config: WhatsAppQrConfig = getWhatsAppQrConfig()): string {
  const phoneE164 = normalizePhone(config.phoneE164)
  if (!phoneE164) {
    return useContainer().content.getBrandContent().whatsappUrl?.trim() ?? ''
  }
  const text = encodeURIComponent(buildWhatsAppQrMessage(config))
  return `https://wa.me/${phoneE164}?text=${text}`
}

function normalizePhone(value: string): string {
  return value.replace(/[^\d]/g, '').trim()
}
