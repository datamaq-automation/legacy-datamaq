import { beforeEach, describe, expect, it } from 'vitest'
import { analyticsConsentStorageKey } from '@/application/consent/consentStorage'
import { getAnalyticsConsent, setAnalyticsConsent } from '@/infrastructure/consent/consent'

describe('consent', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('returns unset and does not fail without window', () => {
    const originalWindow = globalThis.window
    // @ts-expect-error test without browser globals
    globalThis.window = undefined

    expect(getAnalyticsConsent()).toBe('unset')
    expect(() => setAnalyticsConsent('granted')).not.toThrow()

    // @ts-expect-error restore browser globals
    globalThis.window = originalWindow
  })

  it('reads persisted granted and denied values', () => {
    setAnalyticsConsent('granted')
    expect(getAnalyticsConsent()).toBe('granted')

    setAnalyticsConsent('denied')
    expect(getAnalyticsConsent()).toBe('denied')
  })

  it('returns unset for unknown values', () => {
    window.localStorage.setItem(analyticsConsentStorageKey, 'maybe')

    expect(getAnalyticsConsent()).toBe('unset')
  })

  it('clears the canonical key when consent is unset', () => {
    window.localStorage.setItem(analyticsConsentStorageKey, 'granted')

    setAnalyticsConsent('unset')

    expect(window.localStorage.getItem(analyticsConsentStorageKey)).toBeNull()
  })
})
