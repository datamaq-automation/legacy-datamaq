export type PageViewPayload = {
  path: string
  title?: string
}

export interface AnalyticsPort {
  trackEvent(name: string, params?: Record<string, unknown>): void
  trackPageView(payload: PageViewPayload): void
}
