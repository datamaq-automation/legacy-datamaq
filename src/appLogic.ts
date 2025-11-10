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

export const CHAT_URL = getChatUrl()
export const CHAT_ENABLED = isChatEnabled()
export const CONTACT_EMAIL = getContactEmail()
const isDev = import.meta.env.DEV
const pageEntryTimestamp = Date.now()

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

export function openWhatsApp(seccion: string = 'fab'): void {
  if (!CHAT_ENABLED) {
    if (isDev) {
      console.warn('Intento de abrir WhatsApp cuando el canal está deshabilitado')
    }
    return
  }

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

export function submitEmailContact(
  section: string,
  payload: EmailContactPayload
): Promise<{ ok: boolean; error?: string }> {
  const apiUrl = config.CONTACT_API_URL
  if (!apiUrl) {
    if (isDev) {
      console.error('CONTACT_API_URL no está configurada')
    }
    return Promise.resolve({ ok: false, error: 'No se encuentra configurado el backend de contacto.' })
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

  return fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(extendedPayload)
  })
    .then(async (res) => {
      if (isDev) {
        console.debug('[submitEmailContact] Respuesta HTTP:', res.status, res.statusText)
      }
      let errorText = ''
      if (!res.ok) {
        try {
          const errorJson = await res.json()
          errorText = errorJson?.error || JSON.stringify(errorJson)
        } catch {
          errorText = await res.text().catch(() => 'Error desconocido')
        }
        if (isDev) {
          console.warn('[submitEmailContact] Error de backend:', errorText)
        }
        return { ok: false, error: errorText }
      }
      recordEmailEngagement(context)
      return { ok: true }
    })
    .catch((err) => {
      if (isDev) {
        console.error('Error al enviar la consulta de contacto:', err)
      }
      return { ok: false, error: 'No se pudo enviar la consulta. Intente más tarde.' }
    })
}
