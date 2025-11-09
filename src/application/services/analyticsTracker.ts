export interface WhatsappEngagementContext {
  section: string
  pageUrl: string
  trafficSource: string
  navigationTimeMs: number
}

const WHATSAPP_EVENT_NAME = 'whatsapp_click'

export function recordWhatsappEngagement(
  context: WhatsappEngagementContext
): void {
  pushToDataLayer(context)
  sendGaEvent(context)
  sendClarityEvent(context)
}

function pushToDataLayer(context: WhatsappEngagementContext): void {
  if (!window.dataLayer) {
    return
  }

  window.dataLayer.push({
    event: WHATSAPP_EVENT_NAME,
    section: context.section,
    traffic_source: context.trafficSource,
    navigation_time_ms: context.navigationTimeMs,
    page_location: context.pageUrl
  })
}

function sendGaEvent(context: WhatsappEngagementContext): void {
  if (typeof window.gtag !== 'function') {
    console.warn(
      '[GA4] gtag no se encuentra disponible. Evento de WhatsApp no enviado.'
    )
    return
  }

  window.gtag('event', WHATSAPP_EVENT_NAME, {
    event_category: 'engagement',
    event_label: context.section,
    traffic_source: context.trafficSource,
    navigation_time_ms: context.navigationTimeMs,
    page_location: context.pageUrl
  })
}

function sendClarityEvent(context: WhatsappEngagementContext): void {
  if (typeof window.clarity !== 'function') {
    console.warn(
      '[Clarity] clarity no se encuentra disponible. Evento de WhatsApp no enviado.'
    )
    return
  }

  window.clarity('event', WHATSAPP_EVENT_NAME, {
    section: context.section,
    traffic_source: context.trafficSource,
    navigation_time_ms: context.navigationTimeMs,
    page_location: context.pageUrl
  })
}
