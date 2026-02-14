import { beforeEach, describe, expect, it, vi } from 'vitest'

const initGa4 = vi.fn()
const trackGa4Event = vi.fn()
const trackGa4PageView = vi.fn()
const initClarity = vi.fn()

vi.mock('@/infrastructure/analytics/ga4', () => ({
  initGa4,
  trackGa4Event,
  trackGa4PageView
}))

vi.mock('@/infrastructure/analytics/clarity', () => ({
  initClarity
}))

describe('analytics consent synchronization', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
    window.localStorage.clear()
  })

  it('initializes analytics after consent is granted', async () => {
    const analytics = await import('@/infrastructure/analytics')

    analytics.syncAnalyticsConsent('denied')
    expect(initGa4).not.toHaveBeenCalled()
    expect(initClarity).not.toHaveBeenCalled()

    analytics.syncAnalyticsConsent('granted')
    expect(initGa4).toHaveBeenCalledTimes(1)
    expect(initClarity).toHaveBeenCalledTimes(1)
  })

  it('blocks events and page views when consent is denied', async () => {
    const analytics = await import('@/infrastructure/analytics')

    analytics.syncAnalyticsConsent('granted')
    analytics.trackEvent('event.allowed', { source: 'test' })
    analytics.trackPageView({ path: '/allowed', title: 'Allowed' })

    expect(trackGa4Event).toHaveBeenCalledTimes(1)
    expect(trackGa4PageView).toHaveBeenCalledTimes(1)

    analytics.syncAnalyticsConsent('denied')
    analytics.trackEvent('event.blocked', { source: 'test' })
    analytics.trackPageView({ path: '/blocked', title: 'Blocked' })

    expect(trackGa4Event).toHaveBeenCalledTimes(1)
    expect(trackGa4PageView).toHaveBeenCalledTimes(1)
  })
})
