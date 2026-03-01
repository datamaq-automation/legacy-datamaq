import { analyticsConsentStorageKey, parseStoredConsentStatus } from '@/application/consent/consentStorage'

export type AnalyticsConsent = 'granted' | 'denied' | 'unset'

export function getAnalyticsConsent(): AnalyticsConsent {
  if (typeof window === 'undefined') {
    return 'unset'
  }

  const current = parseStoredConsentStatus(window.localStorage.getItem(analyticsConsentStorageKey))
  if (current) {
    return current
  }

  return 'unset'
}

export function setAnalyticsConsent(value: AnalyticsConsent): void {
  if (typeof window === 'undefined') {
    return
  }

  if (value === 'unset') {
    window.localStorage.removeItem(analyticsConsentStorageKey)
    return
  }

  window.localStorage.setItem(analyticsConsentStorageKey, value)
}
