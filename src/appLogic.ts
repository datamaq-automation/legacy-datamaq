/*
Path: src/appLogic.ts
*/



import {
  buildWhatsappUrl,
  getChatUrl,
  isChatEnabled
} from './application/services/chatChannelService'
import {
  buildMailtoHref,
  getContactEmail,
  type EmailContactPayload
} from './application/services/emailChannelService'
import {
  recordEmailEngagement,
  recordWhatsappEngagement,
  type ContactEngagementContext
} from './application/services/analyticsTracker'

export const CHAT_URL = getChatUrl()
export const CHAT_ENABLED = isChatEnabled()
export const CONTACT_EMAIL = getContactEmail()
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

export function submitEmailContact(
  section: string,
  payload: EmailContactPayload
): void {
  let mailtoHref: string

  try {
    mailtoHref = buildMailtoHref(payload)
  } catch (error) {
    console.error('Error al construir el correo de contacto:', error)
    return
  }

  window.location.href = mailtoHref
  const context = buildEngagementContext(section)

  recordEmailEngagement(context)
}
