import { describe, expect, it, vi } from 'vitest'
import { EngagementTracker } from '@/application/analytics/engagementTracker'
import { conversionEvents } from '@/application/analytics/conversionEvents'
import type { AnalyticsPort } from '@/application/ports/Analytics'
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
    const analytics: AnalyticsPort = {
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

    const tracker = new EngagementTracker(clock, location, analytics, logger)

    tracker.trackWhatsapp('hero', 'direct')
    now = 1500
    tracker.trackWhatsapp('hero', 'direct')

    expect(sent).toHaveLength(1)
    expect(sent[0]?.name).toBe(conversionEvents.contact)
    expect(logger.warn).toHaveBeenCalledTimes(1)
  })
})
