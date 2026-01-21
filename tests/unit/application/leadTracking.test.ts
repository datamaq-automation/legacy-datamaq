import { describe, expect, it, vi } from 'vitest'
import { LeadTracking } from '@/application/analytics/leadTracking'
import type { StoragePort } from '@/application/ports/Storage'
import type { TrackingPort } from '@/application/analytics/trackingFacade'

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
    const tracking: TrackingPort = {
      trackEvent: vi.fn(),
      trackPageView: () => {}
    }
    const tracker = new LeadTracking(storage, tracking)

    const leadId = tracker.registerLeadForThanksPage()
    const first = tracker.trackGenerateLeadOnce({ origin: 'thanks' })
    const second = tracker.trackGenerateLeadOnce({ origin: 'thanks' })

    expect(first).toBe(true)
    expect(second).toBe(false)
    expect(tracking.trackEvent).toHaveBeenCalledTimes(1)
    expect(tracking.trackEvent).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ lead_id: leadId })
    )
  })
})
