export const analyticsConsentStorageKey = 'consent.analytics'
export const analyticsConsentLegacyStorageKey = 'datamaq-www-consent'

export type StoredConsentStatus = 'granted' | 'denied'

export function parseStoredConsentStatus(value: string | null): StoredConsentStatus | null {
  if (value === 'granted' || value === 'denied') {
    return value
  }

  return null
}
