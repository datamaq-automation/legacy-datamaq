export interface ContactEngagementContext {
  section: string
  pageUrl: string
  trafficSource: string
  navigationTimeMs: number
}

const WHATSAPP_EVENT_NAME = 'whatsapp_click'
const EMAIL_EVENT_NAME = 'email_contact_submit'
const isDev = import.meta.env.DEV
const DEDUPE_WINDOW_MS = 2000

const dispatchedEvents = new Map<string, number>()

function shouldSkipEvent(eventName: string, context: ContactEngagementContext): boolean {
  const now = Date.now()
  const key = `${eventName}:${context.section}:${context.pageUrl}:${context.trafficSource}`
  const lastDispatch = dispatchedEvents.get(key)

  if (typeof lastDispatch === 'number' && now - lastDispatch < DEDUPE_WINDOW_MS) {
    if (isDev) {
      console.warn(
        `[analytics] Evento "${eventName}" omitido para evitar duplicados (último envío hace ${now - lastDispatch} ms).`
      )
    }
    return true
  }

  dispatchedEvents.set(key, now)
  return false
}

export function recordWhatsappEngagement(
  context: ContactEngagementContext
): void {
  if (shouldSkipEvent(WHATSAPP_EVENT_NAME, context)) {
    return
  }
  pushToDataLayer(WHATSAPP_EVENT_NAME, context)
  sendGaEvent(WHATSAPP_EVENT_NAME, context)
  sendClarityEvent(WHATSAPP_EVENT_NAME, context)
}

export function recordEmailEngagement(context: ContactEngagementContext): void {
  if (shouldSkipEvent(EMAIL_EVENT_NAME, context)) {
    return
  }
  pushToDataLayer(EMAIL_EVENT_NAME, context)
  sendGaEvent(EMAIL_EVENT_NAME, context)
  sendClarityEvent(EMAIL_EVENT_NAME, context)
}

function pushToDataLayer(
  eventName: string,
  context: ContactEngagementContext
): void {
  if (!window.dataLayer) {
    return
  }

  window.dataLayer.push({
    event: eventName,
    section: context.section,
    traffic_source: context.trafficSource,
    navigation_time_ms: context.navigationTimeMs,
    page_location: context.pageUrl
  })
}

function sendGaEvent(
  eventName: string,
  context: ContactEngagementContext
): void {
  if (typeof window.gtag !== 'function') {
    if (isDev) {
      console.warn(
        `[GA4] gtag no se encuentra disponible. Evento "${eventName}" no enviado.`
      )
    }
    return
  }

  window.gtag('event', eventName, {
    event_category: 'engagement',
    event_label: context.section,
    traffic_source: context.trafficSource,
    navigation_time_ms: context.navigationTimeMs,
    page_location: context.pageUrl
  })
}

function sendClarityEvent(
  eventName: string,
  context: ContactEngagementContext
): void {
  if (typeof window.clarity !== 'function') {
    if (isDev) {
      console.warn(
        `[Clarity] clarity no se encuentra disponible. Evento "${eventName}" no enviado.`
      )
    }
    return
  }

  window.clarity('event', eventName, {
    section: context.section,
    traffic_source: context.trafficSource,
    navigation_time_ms: context.navigationTimeMs,
    page_location: context.pageUrl
  })
}
