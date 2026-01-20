import { conversionEvents } from './conversionEvents'
import { trackEvent } from '@/infrastructure/analytics'
import { getAnalyticsConsent } from '@/infrastructure/analytics/consent'

const LAST_LEAD_KEY = 'last_lead_id'
const TRACKED_PREFIX = 'lead_tracked_'

export function registerLeadForThanksPage(): string {
  const leadId = buildLeadId()

  if (typeof window !== 'undefined') {
    window.sessionStorage.setItem(LAST_LEAD_KEY, leadId)
  }

  return leadId
}

export function trackGenerateLeadOnce(
  params: Record<string, unknown> = {}
): boolean {
  if (typeof window === 'undefined') {
    return false
  }

  if (!isAnalyticsEnabled()) {
    return false
  }

  if (getAnalyticsConsent() !== 'granted') {
    return false
  }

  const leadId = window.sessionStorage.getItem(LAST_LEAD_KEY)
  if (!leadId) {
    return false
  }

  if (window.sessionStorage.getItem(`${TRACKED_PREFIX}${leadId}`)) {
    return false
  }

  trackEvent(conversionEvents.generateLead, {
    ...params,
    lead_id: leadId
  })

  window.sessionStorage.setItem(`${TRACKED_PREFIX}${leadId}`, '1')
  return true
}

function buildLeadId(): string {
  return `lead_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
}

function isAnalyticsEnabled(): boolean {
  if (typeof import.meta.env.VITE_ANALYTICS_ENABLED === 'undefined') {
    return true
  }
  return import.meta.env.VITE_ANALYTICS_ENABLED.toLowerCase() === 'true'
}
