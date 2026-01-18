export interface AnalyticsProvider {
  track(event: string, payload: Record<string, unknown>): void
}
