export type AnalyticsConsent = 'granted' | 'denied' | 'unset'

export interface ConsentPort {
  getAnalyticsConsent(): AnalyticsConsent
  setAnalyticsConsent(value: AnalyticsConsent): void
}
