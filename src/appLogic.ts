/*
Path: src/appLogic.ts
*/

import {
  buildWhatsappUrl,
  getChatUrl,
  isChatEnabled
} from './application/services/chatChannelService'
import {
  getContactEmail,
  type EmailContactPayload
} from './application/services/emailChannelService'
import { config } from './infrastructure/config'
import {
  recordEmailEngagement,
  recordWhatsappEngagement,
  type ContactEngagementContext
} from './application/services/analyticsTracker'
import {
  ensureContactBackendStatus,
  markContactBackendAvailable,
  markContactBackendUnavailable
} from './application/services/contactBackendStatus'

export const CHAT_URL = getChatUrl()
export const CHAT_ENABLED = isChatEnabled()
export const CONTACT_EMAIL = getContactEmail()
const isDev = import.meta.env.DEV
const pageEntryTimestamp = Date.now()

void ensureContactBackendStatus()

function getTrafficSource(): string {
  const urlParams = new URLSearchParams(window.location.search)
  const utmSource = urlParams.get('utm_source')
  if (utmSource) return utmSource
  return document.referrer || 'direct'
}

function buildEngagementContext(section: string): ContactEngagementContext {
  const now = Date.now()

  return {
    section,
    pageUrl: window.location.href,
    trafficSource: getTrafficSource(),
    navigationTimeMs: Math.max(now - pageEntryTimestamp, 0)
  }
}

async function sendWhatsappContactEvent(section: string): Promise<void> {
  const apiUrl = config.CONTACT_API_URL
  if (!apiUrl) {
    if (isDev) {
      console.error('CONTACT_API_URL no está configurada')
    }
    markContactBackendUnavailable()
    return
  }

  const backendStatus = await ensureContactBackendStatus()

  if (backendStatus !== 'available') {
    if (isDev) {
      console.warn('[sendWhatsappContactEvent] Backend de contacto no disponible, omitiendo envío.')
    }
    return
  }

  const payload = {
    name: 'from_whatsapp',
    email: 'whatsapp@profebustos.com.ar',
    company: 'from_whatsapp',
    message: 'from_whatsapp',
    page_location: window.location.href,
    traffic_source: getTrafficSource(),
    user_agent: navigator.userAgent,
    created_at: new Date().toISOString()
    // IP la debe agregar el backend
  }

  if (isDev) {
    console.debug('[sendWhatsappContactEvent] Payload:', payload)
  }

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok && response.status >= 500) {
      markContactBackendUnavailable()
      if (isDev) {
        console.warn(
          `[sendWhatsappContactEvent] Respuesta no exitosa del backend (${response.status}).`
        )
      }
    } else {
      markContactBackendAvailable()
    }
  } catch (err) {
    markContactBackendUnavailable()
    if (isDev) {
      console.error('Error al enviar evento de WhatsApp:', err)
    }
    // Silencioso, no feedback al usuario
  }
}

export function openWhatsApp(seccion: string = 'fab'): void {
  if (!CHAT_ENABLED) {
    if (isDev) {
      console.warn('Intento de abrir WhatsApp cuando el canal está deshabilitado')
    }
    return
  }

  // Enviar evento silencioso al backend
  void sendWhatsappContactEvent(seccion)

  let url: string

  try {
    url = buildWhatsappUrl()
  } catch (error) {
    if (isDev) {
      console.error('Error al construir la URL de WhatsApp:', error)
    }
    return
  }

  window.open(url, '_blank', 'noopener')
  const context = buildEngagementContext(seccion)

  recordWhatsappEngagement(context)
}

export async function submitEmailContact(
  section: string,
  payload: EmailContactPayload
): Promise<{ ok: boolean; error?: string }> {
  const apiUrl = config.CONTACT_API_URL
  if (!apiUrl) {
    if (isDev) {
      console.error('CONTACT_API_URL no está configurada')
    }
    markContactBackendUnavailable()
    return { ok: false, error: 'No se encuentra configurado el backend de contacto.' }
  }

  const backendStatus = await ensureContactBackendStatus()
  if (backendStatus !== 'available') {
    return {
      ok: false,
      error: 'El canal de correo electrónico no se encuentra disponible en este momento.'
    }
  }

  const context = buildEngagementContext(section)

  if (isDev) {
    console.debug('[submitEmailContact] Enviando payload:', payload)
    console.debug('[submitEmailContact] URL:', apiUrl)
  }

  // Si message está vacío, poner "Null"
  const extendedPayload = {
    ...payload,
    message: !payload.message ? 'Null' : payload.message,
    page_location: window.location.href,
    traffic_source: getTrafficSource()
  }

  try {
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(extendedPayload)
    })

    if (isDev) {
      console.debug('[submitEmailContact] Respuesta HTTP:', res.status, res.statusText)
    }

    if (!res.ok) {
      let errorText = ''
      try {
        const errorJson = await res.json()
        errorText = errorJson?.error || JSON.stringify(errorJson)
      } catch {
        errorText = await res.text().catch(() => 'Error desconocido')
      }

      if (isDev) {
        console.warn('[submitEmailContact] Error de backend:', errorText)
      }

      if (res.status >= 500) {
        markContactBackendUnavailable()
      } else {
        markContactBackendAvailable()
      }

      return { ok: false, error: errorText }
    }

    markContactBackendAvailable()
    recordEmailEngagement(context)
    return { ok: true }
  } catch (err) {
    markContactBackendUnavailable()
    if (isDev) {
      console.error('Error al enviar la consulta de contacto:', err)
    }
    return { ok: false, error: 'No se pudo enviar la consulta. Intente más tarde.' }
  }
}
