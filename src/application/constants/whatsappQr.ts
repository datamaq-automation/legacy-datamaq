/**
 * Constantes y builders para configuración de QR de WhatsApp.
 * 
 * Nota: Este módulo contiene la lógica pura (sin dependencias de Vue/composables)
 * para facilitar testing y reuso. El composable useWhatsAppQr.ts en ui/
 * es el punto de entrada para componentes Vue.
 */

export interface WhatsAppQrConfig {
  phoneE164: string
  message: string
  sourceTag: string
}

export function buildWhatsAppQrMessage(config: WhatsAppQrConfig): string {
  const normalizedMessage = config.message.trim()
  const normalizedTag = config.sourceTag.trim()
  if (!normalizedTag) {
    return normalizedMessage
  }
  return `${normalizedMessage}\n\nOrigen: ${normalizedTag}`
}

export function buildWhatsAppQrHref(config: WhatsAppQrConfig): string {
  const phoneE164 = normalizePhone(config.phoneE164)
  if (!phoneE164) {
    return ''
  }
  const text = encodeURIComponent(buildWhatsAppQrMessage(config))
  return `https://wa.me/${phoneE164}?text=${text}`
}

function normalizePhone(value: string): string {
  return value.replace(/[^\d]/g, '').trim()
}
