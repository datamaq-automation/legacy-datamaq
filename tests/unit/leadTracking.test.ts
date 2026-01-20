import { describe, expect, it, vi } from 'vitest'
import { LeadTracking } from '@/application/analytics/leadTracking'
import type { AnalyticsPort } from '@/application/ports/Analytics'
import type { ConsentPort } from '@/application/ports/Consent'
import type { StoragePort } from '@/application/ports/Storage'

class MemoryStorage implements StoragePort {
  private store = new Map<string, string>()

  get(key: string): string | null {
    return this.store.get(key) ?? null
  }

  set(key: string, value: string): void {
    this.store.set(key, value)
  }

  remove(key: string): void {
    this.store.delete(key)
  }
}

describe('LeadTracking', () => {
  it('tracks generate_lead once per lead id', () => {
    const storage = new MemoryStorage()
    const analytics: AnalyticsPort = {
      trackEvent: vi.fn(),
      trackPageView: () => {}
    }
    const consent: ConsentPort = {
      getAnalyticsConsent: () => 'granted'
    }
    const tracker = new LeadTracking(storage, analytics, consent)

    const leadId = tracker.registerLeadForThanksPage()
    const first = tracker.trackGenerateLeadOnce({ origin: 'thanks' })
    const second = tracker.trackGenerateLeadOnce({ origin: 'thanks' })

    expect(first).toBe(true)
    expect(second).toBe(false)
    expect(analytics.trackEvent).toHaveBeenCalledTimes(1)
    expect(analytics.trackEvent).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ lead_id: leadId })
    )
  })
})
