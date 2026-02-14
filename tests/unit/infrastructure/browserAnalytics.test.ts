import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { LoggerPort } from '@/application/ports/Logger'

function createLogger(): LoggerPort {
  return {
    debug: vi.fn(),
    warn: vi.fn(),
    error: vi.fn()
  }
}

describe('BrowserAnalytics', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
    window.localStorage.clear()
    window.gtag = undefined
    window.clarity = undefined
  })

  it('does not send analytics events when consent is denied', async () => {
    const analyticsModule = await import('@/infrastructure/analytics')
    const { BrowserAnalytics } = await import('@/infrastructure/analytics/browserAnalytics')
    const gtag = vi.fn()
    const clarity = vi.fn()
    window.gtag = gtag
    window.clarity = clarity

    analyticsModule.syncAnalyticsConsent('denied')

    const analytics = new BrowserAnalytics(createLogger())
    analytics.track('contact_submitted', { origin: 'landing' })

    const gtagEventCalls = gtag.mock.calls.filter((call) => call[0] === 'event')
    const clarityEventCalls = clarity.mock.calls.filter((call) => call[0] === 'event')

    expect(gtagEventCalls).toHaveLength(0)
    expect(clarityEventCalls).toHaveLength(0)
  })

  it('sends analytics events when consent is granted', async () => {
    const analyticsModule = await import('@/infrastructure/analytics')
    const { BrowserAnalytics } = await import('@/infrastructure/analytics/browserAnalytics')
    const gtag = vi.fn()
    const clarity = vi.fn()
    window.gtag = gtag
    window.clarity = clarity

    analyticsModule.syncAnalyticsConsent('granted')

    const analytics = new BrowserAnalytics(createLogger())
    analytics.track('contact_submitted', { origin: 'landing' })

    expect(gtag).toHaveBeenCalledWith('event', 'contact_submitted', {
      event_category: 'engagement',
      origin: 'landing'
    })
    expect(clarity).toHaveBeenCalledWith('event', 'contact_submitted', { origin: 'landing' })
  })
})
