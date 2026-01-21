import type { AnalyticsPort } from '../ports/Analytics'
import type { ConsentPort } from '../ports/Consent'

export interface TrackingPort {
  trackEvent(name: string, params?: Record<string, unknown>): void
  trackPageView(payload: { path: string; title?: string }): void
}

const noopAnalytics: AnalyticsPort = {
  trackEvent: () => {},
  trackPageView: () => {}
}

export class TrackingFacade implements TrackingPort {
  constructor(
    private analytics: AnalyticsPort,
    private consent: ConsentPort
  ) {}

  trackEvent(name: string, params: Record<string, unknown> = {}): void {
    this.resolveAnalytics().trackEvent(name, params)
  }

  trackPageView(payload: { path: string; title?: string }): void {
    this.resolveAnalytics().trackPageView(payload)
  }

  private resolveAnalytics(): AnalyticsPort {
    if (this.consent.getAnalyticsConsent() !== 'granted') {
      return noopAnalytics
    }
    return this.analytics
  }
}
