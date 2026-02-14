import { beforeEach, describe, expect, it } from 'vitest'
import {
  analyticsConsentLegacyStorageKey,
  analyticsConsentStorageKey
} from '@/application/consent/consentStorage'
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

  it('migrates legacy key and keeps one active key', () => {
    window.localStorage.setItem(analyticsConsentLegacyStorageKey, 'granted')

    expect(getAnalyticsConsent()).toBe('granted')
    expect(window.localStorage.getItem(analyticsConsentStorageKey)).toBe('granted')
    expect(window.localStorage.getItem(analyticsConsentLegacyStorageKey)).toBeNull()
  })

  it('returns unset for unknown values', () => {
    window.localStorage.setItem(analyticsConsentStorageKey, 'maybe')

    expect(getAnalyticsConsent()).toBe('unset')
  })

  it('clears active and legacy keys when consent is unset', () => {
    window.localStorage.setItem(analyticsConsentStorageKey, 'granted')
    window.localStorage.setItem(analyticsConsentLegacyStorageKey, 'granted')

    setAnalyticsConsent('unset')

    expect(window.localStorage.getItem(analyticsConsentStorageKey)).toBeNull()
    expect(window.localStorage.getItem(analyticsConsentLegacyStorageKey)).toBeNull()
  })
})
