export interface WhatsAppQrConfig {
  phoneE164: string
  message: string
  sourceTag: string
}

export const whatsappQrConfig: WhatsAppQrConfig = {
  phoneE164: 'TODO_REEMPLAZAR',
  message: 'Hola, te contacto por la tarjeta de DataMaq. ¿Podemos coordinar?',
  sourceTag: 'qr_card'
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
  const phoneE164 = config.phoneE164.trim()
  const text = encodeURIComponent(buildWhatsAppQrMessage(config))
  return `https://wa.me/${phoneE164}?text=${text}`
}
