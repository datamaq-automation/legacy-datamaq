import { beforeEach, describe, expect, it, vi } from 'vitest'

const initGa4 = vi.fn()
const trackGa4Event = vi.fn()
const trackGa4PageView = vi.fn()
const updateGa4Consent = vi.fn()
const clearGa4PendingEvents = vi.fn()
const initClarity = vi.fn()
const updateClarityConsent = vi.fn()
const clearAnalyticsCookies = vi.fn()

vi.mock('@/infrastructure/analytics/ga4', () => ({
  initGa4,
  updateGa4Consent,
  clearGa4PendingEvents,
  trackGa4Event,
  trackGa4PageView
}))

vi.mock('@/infrastructure/analytics/clarity', () => ({
  initClarity,
  updateClarityConsent
}))

vi.mock('@/infrastructure/analytics/cookies', () => ({
  clearAnalyticsCookies
}))

describe('analytics consent synchronization', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
    window.localStorage.clear()
  })

  it('initializes analytics after consent is granted', async () => {
    const analytics = await import('@/infrastructure/analytics')
    analytics.configureAnalytics({
      analyticsEnabled: true,
      ga4Id: 'G-TEST',
      clarityProjectId: 'clarity-test'
    })

    analytics.syncAnalyticsConsent('denied')
    expect(initGa4).not.toHaveBeenCalled()
    expect(initClarity).not.toHaveBeenCalled()

    analytics.syncAnalyticsConsent('granted')
    expect(initGa4).toHaveBeenCalledTimes(1)
    expect(initClarity).toHaveBeenCalledTimes(1)
    expect(updateGa4Consent).toHaveBeenCalledWith('granted')
    expect(updateClarityConsent).toHaveBeenCalledWith('granted')
  })

  it('blocks events/page views and applies hard revoke when consent is denied', async () => {
    const analytics = await import('@/infrastructure/analytics')
    analytics.configureAnalytics({
      analyticsEnabled: true,
      ga4Id: 'G-TEST',
      clarityProjectId: 'clarity-test'
    })

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
    expect(updateGa4Consent).toHaveBeenCalledWith('denied')
    expect(updateClarityConsent).toHaveBeenCalledWith('denied')
    expect(clearGa4PendingEvents).toHaveBeenCalledTimes(1)
    expect(clearAnalyticsCookies).toHaveBeenCalledTimes(1)
  })
})
