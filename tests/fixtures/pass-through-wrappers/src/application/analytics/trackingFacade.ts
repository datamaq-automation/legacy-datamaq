export class TrackingFacade {
  constructor(
    private analytics: { trackEvent(name: string): void },
    private consent: { getAnalyticsConsent(): string }
  ) {}

  trackEvent(name: string): void {
    if (this.consent.getAnalyticsConsent() !== 'granted') {
      return
    }

    this.analytics.trackEvent(name)
  }
}
