export type AnalyticsConsent = 'granted' | 'denied' | 'unset'

const STORAGE_KEY = 'consent.analytics'

export function getAnalyticsConsent(): AnalyticsConsent {
  if (typeof window === 'undefined') {
    return 'unset'
  }

  const value = window.localStorage.getItem(STORAGE_KEY)
  if (value === 'granted' || value === 'denied') {
    return value
  }
  return 'unset'
}

export function setAnalyticsConsent(value: AnalyticsConsent): void {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, value)
}
