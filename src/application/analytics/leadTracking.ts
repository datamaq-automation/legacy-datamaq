import type { StoragePort } from '../ports/Storage'
import { conversionEvents } from './conversionEvents'
import type { TrackingPort } from './trackingFacade'
import { publicConfig } from '@/infrastructure/content/content'

const LAST_LEAD_KEY = 'last_lead_id'
const TRACKED_PREFIX = 'lead_tracked_'

export class LeadTracking {
  constructor(
    private storage: StoragePort,
    private tracking: TrackingPort
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

    const leadId = this.storage.get(LAST_LEAD_KEY)
    if (!leadId) {
      return false
    }

    if (this.storage.get(`${TRACKED_PREFIX}${leadId}`)) {
      return false
    }

    this.tracking.trackEvent(conversionEvents.generateLead, {
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
  const value = publicConfig.analyticsEnabled
  if (typeof value === 'undefined') {
    return true
  }
  if (typeof value === 'boolean') {
    return value
  }
  return value.toLowerCase() === 'true'
}
