/*
Path: src/appLogic.ts
*/



import {
  buildWhatsappUrl,
  getChatUrl,
  isChatEnabled
} from './application/services/chatChannelService'
import {
  recordWhatsappEngagement,
  type WhatsappEngagementContext
} from './application/services/analyticsTracker'

export const CHAT_URL = getChatUrl()
export const CHAT_ENABLED = isChatEnabled()
const pageEntryTimestamp = Date.now()

function getTrafficSource(): string {
  const urlParams = new URLSearchParams(window.location.search)
  const utmSource = urlParams.get('utm_source')
  if (utmSource) return utmSource
  return document.referrer || 'direct'
}

function buildEngagementContext(section: string): WhatsappEngagementContext {
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
    console.warn('Intento de abrir WhatsApp cuando el canal está deshabilitado')
    return
  }

  let url: string

  try {
    url = buildWhatsappUrl()
  } catch (error) {
    console.error('Error al construir la URL de WhatsApp:', error)
    return
  }

  window.open(url, '_blank', 'noopener')
  const context = buildEngagementContext(seccion)

  recordWhatsappEngagement(context)
}
