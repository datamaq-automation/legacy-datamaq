/*
Path: src/appLogic.ts
*/



import { config } from './infrastructure/config'
import { registrarConversion } from './interface_adapters/gateways/conversionGateway'
import { ref } from 'vue'

// Timestamp de entrada a la página
const pageEntryTimestamp = Date.now()

export const CHAT_URL = config.CHAT_URL

export const conversionMsg = ref<string | null>(null)
export const CHAT_ENABLED = !!config.WHATSAPP_NUMBER

function getTrafficSource(): string {
  // Prioriza UTM, luego referer
  const urlParams = new URLSearchParams(window.location.search)
  const utmSource = urlParams.get('utm_source')
  if (utmSource) return utmSource
  return document.referrer || 'direct'
}

export async function openWhatsApp(): Promise<void> {
  const url = `https://wa.me/${config.WHATSAPP_NUMBER}?text=${encodeURIComponent(config.PRESET_MSG)}`
  window.open(url, "_blank", "noopener")
  ;(window as any).dataLayer?.push({ event: "conversion_whatsapp_click" })
  window.dispatchEvent(new CustomEvent("conversion:whatsapp_click"))

  const tiempoNavegacion = Date.now() - pageEntryTimestamp

  try {
    const response = await registrarConversion({
      tipo: 'whatsapp',
      timestamp: new Date().toISOString(),
      seccion: 'fab',
      web: window.location.href,
      tiempo_navegacion: tiempoNavegacion,
      fuente_trafico: getTrafficSource() // Nuevo campo
    })
    const data = await response.json()
    if (response.ok && data.success) {
      console.log("¡Conversión registrada correctamente!")
    } else if (response.status === 429) {
      conversionMsg.value = "Conversión duplicada detectada. Espera unos segundos antes de volver a intentar."
    } else if (response.status === 400) {
      conversionMsg.value = "Datos incompletos o formato inválido."
    } else if (response.status === 500) {
      conversionMsg.value = "Ocurrió un error técnico. Intenta nuevamente más tarde."
    } else {
      conversionMsg.value = "No se pudo registrar la conversión. Intenta nuevamente."
    }
    if (data.error) {
      console.error("Error conversión:", data.error)
    }
  } catch (err) {
    conversionMsg.value = "Error de red al registrar conversión."
    // Solo muestra un mensaje simple, sin detalles ni stacktrace
    console.log("Error de red conversión.")
  }
}
