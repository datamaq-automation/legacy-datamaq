import { describe, expect, it, vi } from 'vitest'
import { TrackingFacade } from '@/application/analytics/trackingFacade'
import type { AnalyticsPort } from '@/application/ports/Analytics'
import type { ConsentPort } from '@/application/ports/Consent'

describe('TrackingFacade', () => {
  it('does not track when consent is denied', () => {
    const analytics: AnalyticsPort = {
      trackEvent: vi.fn(),
      trackPageView: vi.fn()
    }
    const consent: ConsentPort = {
      getAnalyticsConsent: () => 'denied',
      setAnalyticsConsent: () => {}
    }

    const facade = new TrackingFacade(analytics, consent)
    facade.trackEvent('event.test')
    facade.trackPageView({ path: '/home', title: 'Home' })

    expect(analytics.trackEvent).not.toHaveBeenCalled()
    expect(analytics.trackPageView).not.toHaveBeenCalled()
  })

  it('tracks when consent is granted', () => {
    const analytics: AnalyticsPort = {
      trackEvent: vi.fn(),
      trackPageView: vi.fn()
    }
    const consent: ConsentPort = {
      getAnalyticsConsent: () => 'granted',
      setAnalyticsConsent: () => {}
    }

    const facade = new TrackingFacade(analytics, consent)
    facade.trackEvent('event.test', { value: 1 })
    facade.trackPageView({ path: '/home', title: 'Home' })

    expect(analytics.trackEvent).toHaveBeenCalledWith('event.test', { value: 1 })
    expect(analytics.trackPageView).toHaveBeenCalledWith({ path: '/home', title: 'Home' })
  })
})
