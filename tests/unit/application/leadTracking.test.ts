import { describe, expect, it, vi } from 'vitest'
import { LeadTracking } from '@/application/analytics/leadTracking'
import type { StoragePort } from '@/application/ports/Storage'
import type { TrackingPort } from '@/application/analytics/trackingFacade'
import type { ConfigPort } from '@/application/ports/Config'
import type { Clock } from '@/application/ports/Environment'

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
    const config: ConfigPort = { analyticsEnabled: true } as ConfigPort
    const clock: Clock = { now: () => 1700000000000 }
    const tracker = new LeadTracking(storage, tracking, config, clock)

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

  it('no envía eventos si analytics está desactivado', () => {
    const storage = new MemoryStorage()
    const tracking: TrackingPort = {
      trackEvent: vi.fn(),
      trackPageView: () => {}
    }
    const config: ConfigPort = { analyticsEnabled: false } as ConfigPort
    const clock: Clock = { now: () => 1700000000000 }
    const tracker = new LeadTracking(storage, tracking, config, clock)

    tracker.registerLeadForThanksPage()
    const result = tracker.trackGenerateLeadOnce()

    expect(result).toBe(false)
    expect(tracking.trackEvent).not.toHaveBeenCalled()
  })

  it('no envía eventos si no hay lead pendiente', () => {
    const storage = new MemoryStorage()
    const tracking: TrackingPort = {
      trackEvent: vi.fn(),
      trackPageView: () => {}
    }
    const config: ConfigPort = { analyticsEnabled: true } as ConfigPort
    const clock: Clock = { now: () => 1700000000000 }
    const tracker = new LeadTracking(storage, tracking, config, clock)

    const result = tracker.trackGenerateLeadOnce({ origin: 'thanks' })

    expect(result).toBe(false)
    expect(tracking.trackEvent).not.toHaveBeenCalled()
  })

  it('usa analytics habilitado por defecto cuando no esta definido', () => {
    const storage = new MemoryStorage()
    const tracking: TrackingPort = {
      trackEvent: vi.fn(),
      trackPageView: () => {}
    }
    const config: ConfigPort = { analyticsEnabled: undefined } as ConfigPort
    const clock: Clock = { now: () => 1700000000000 }
    const tracker = new LeadTracking(storage, tracking, config, clock)

    tracker.registerLeadForThanksPage()
    const result = tracker.trackGenerateLeadOnce({ origin: 'thanks' })

    expect(result).toBe(true)
    expect(tracking.trackEvent).toHaveBeenCalledTimes(1)
  })
})
