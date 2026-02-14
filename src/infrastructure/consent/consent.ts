import {
  analyticsConsentLegacyStorageKey,
  analyticsConsentStorageKey,
  parseStoredConsentStatus
} from '@/application/consent/consentStorage'

export type AnalyticsConsent = 'granted' | 'denied' | 'unset'

export function getAnalyticsConsent(): AnalyticsConsent {
  if (typeof window === 'undefined') {
    return 'unset'
  }

  const current = parseStoredConsentStatus(window.localStorage.getItem(analyticsConsentStorageKey))
  if (current) {
    return current
  }

  const legacy = parseStoredConsentStatus(window.localStorage.getItem(analyticsConsentLegacyStorageKey))
  if (legacy) {
    window.localStorage.setItem(analyticsConsentStorageKey, legacy)
    window.localStorage.removeItem(analyticsConsentLegacyStorageKey)
    return legacy
  }

  return 'unset'
}

export function setAnalyticsConsent(value: AnalyticsConsent): void {
  if (typeof window === 'undefined') {
    return
  }

  if (value === 'unset') {
    window.localStorage.removeItem(analyticsConsentStorageKey)
    window.localStorage.removeItem(analyticsConsentLegacyStorageKey)
    return
  }

  window.localStorage.setItem(analyticsConsentStorageKey, value)
  window.localStorage.removeItem(analyticsConsentLegacyStorageKey)
}
