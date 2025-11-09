export interface ContactEngagementContext {
  section: string
  pageUrl: string
  trafficSource: string
  navigationTimeMs: number
}

const WHATSAPP_EVENT_NAME = 'whatsapp_click'
const EMAIL_EVENT_NAME = 'email_contact_submit'

export function recordWhatsappEngagement(
  context: ContactEngagementContext
): void {
  pushToDataLayer(WHATSAPP_EVENT_NAME, context)
  sendGaEvent(WHATSAPP_EVENT_NAME, context)
  sendClarityEvent(WHATSAPP_EVENT_NAME, context)
}

export function recordEmailEngagement(context: ContactEngagementContext): void {
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
    console.warn(
      `[GA4] gtag no se encuentra disponible. Evento "${eventName}" no enviado.`
    )
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
    console.warn(
      `[Clarity] clarity no se encuentra disponible. Evento "${eventName}" no enviado.`
    )
    return
  }

  window.clarity('event', eventName, {
    section: context.section,
    traffic_source: context.trafficSource,
    navigation_time_ms: context.navigationTimeMs,
    page_location: context.pageUrl
  })
}
