import type { StoragePort } from '../ports/Storage'
import { conversionEvents } from './conversionEvents'
import type { TrackingPort } from './trackingFacade'
import type { ConfigPort } from '../ports/Config'
import type { Clock } from '../ports/Environment'

const LAST_LEAD_KEY = 'last_lead_id'
const TRACKED_PREFIX = 'lead_tracked_'

export class LeadTracking {
  constructor(
    private storage: StoragePort,
    private tracking: TrackingPort,
    private config: ConfigPort,
    private clock: Clock
  ) {}

  registerLeadForThanksPage(): string {
    const leadId = buildLeadId(this.clock.now())
    this.storage.set(LAST_LEAD_KEY, leadId)
    return leadId
  }

  trackGenerateLeadOnce(params: Record<string, unknown> = {}): boolean {
    if (!isAnalyticsEnabled(this.config)) {
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

function buildLeadId(now: number): string {
  return `lead_${now}_${Math.random().toString(36).slice(2, 10)}`
}

function isAnalyticsEnabled(config: ConfigPort): boolean {
  const value = config.analyticsEnabled
  if (typeof value === 'undefined') {
    return true
  }
  return value
}
