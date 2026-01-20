export type AnalyticsConsent = 'granted' | 'denied' | 'unset'

export interface ConsentPort {
  getAnalyticsConsent(): AnalyticsConsent
}
