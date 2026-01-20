import type { AnalyticsPort } from '../ports/Analytics'
import type { ConsentPort } from '../ports/Consent'
import type { StoragePort } from '../ports/Storage'
import { conversionEvents } from './conversionEvents'

const LAST_LEAD_KEY = 'last_lead_id'
const TRACKED_PREFIX = 'lead_tracked_'

export class LeadTracking {
  constructor(
    private storage: StoragePort,
    private analytics: AnalyticsPort,
    private consent: ConsentPort
  ) {}

  registerLeadForThanksPage(): string {
    const leadId = buildLeadId()
    this.storage.set(LAST_LEAD_KEY, leadId)
    return leadId
  }

  trackGenerateLeadOnce(params: Record<string, unknown> = {}): boolean {
    if (!isAnalyticsEnabled()) {
      return false
    }

    if (this.consent.getAnalyticsConsent() !== 'granted') {
      return false
    }

    const leadId = this.storage.get(LAST_LEAD_KEY)
    if (!leadId) {
      return false
    }

    if (this.storage.get(`${TRACKED_PREFIX}${leadId}`)) {
      return false
    }

    this.analytics.trackEvent(conversionEvents.generateLead, {
      ...params,
      lead_id: leadId
    })

    this.storage.set(`${TRACKED_PREFIX}${leadId}`, '1')
    return true
  }
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
