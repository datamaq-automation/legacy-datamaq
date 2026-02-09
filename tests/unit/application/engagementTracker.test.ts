import { describe, expect, it, vi } from 'vitest'
import { EngagementTracker } from '@/application/analytics/engagementTracker'
import { conversionEvents } from '@/application/analytics/conversionEvents'
import type { TrackingPort } from '@/application/analytics/trackingFacade'
import type { Clock, LocationProvider } from '@/application/ports/Environment'
import type { LoggerPort } from '@/application/ports/Logger'

describe('EngagementTracker', () => {
  it('dedupes repeated events inside the window', () => {
    let now = 1000
    const clock: Clock = { now: () => now }
    const location: LocationProvider = {
      href: () => 'https://example.com/thanks',
      referrer: () => '',
      search: () => ''
    }
    const sent: Array<{ name: string; params: Record<string, unknown> }> = []
    const tracking: TrackingPort = {
      trackEvent: (name, params = {}) => {
        sent.push({ name, params })
      },
      trackPageView: () => {}
    }
    const logger: LoggerPort = {
      debug: vi.fn(),
      warn: vi.fn(),
      error: vi.fn()
    }

    const tracker = new EngagementTracker(clock, location, tracking, logger)

    tracker.trackChat('hero', 'direct')
    now = 1500
    tracker.trackChat('hero', 'direct')

    expect(sent).toHaveLength(1)
    expect(sent[0]?.name).toBe(conversionEvents.contact)
    expect(logger.warn).toHaveBeenCalledTimes(1)
  })

  it('deduplica eventos de email y mantiene el contexto', () => {
    let now = 0
    const clock: Clock = { now: () => now }
    const location: LocationProvider = {
      href: () => 'https://example.com/contact',
      referrer: () => '',
      search: () => ''
    }
    const tracking: TrackingPort = {
      trackEvent: vi.fn(),
      trackPageView: () => {}
    }
    const logger: LoggerPort = {
      debug: vi.fn(),
      warn: vi.fn(),
      error: vi.fn()
    }

    const tracker = new EngagementTracker(clock, location, tracking, logger)

    tracker.trackEmail('footer', 'organic')
    now = 1000
    tracker.trackEmail('footer', 'organic')

    expect(tracking.trackEvent).toHaveBeenCalledTimes(1)
    expect(tracking.trackEvent).toHaveBeenCalledWith(conversionEvents.generateLead, {
      section: 'footer',
      pageUrl: 'https://example.com/contact',
      trafficSource: 'organic',
      navigationTimeMs: 0
    })
    expect(logger.warn).toHaveBeenCalledTimes(1)
  })
})
