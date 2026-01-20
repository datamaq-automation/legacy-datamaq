import { describe, expect, it, beforeEach } from 'vitest'
import { BrowserConsentAdapter } from '@/infrastructure/consent/browserConsentAdapter'

describe('BrowserConsentAdapter', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('persists and reads analytics consent', () => {
    const adapter = new BrowserConsentAdapter()

    adapter.setAnalyticsConsent('granted')
    expect(adapter.getAnalyticsConsent()).toBe('granted')

    adapter.setAnalyticsConsent('denied')
    expect(adapter.getAnalyticsConsent()).toBe('denied')

    adapter.setAnalyticsConsent('unset')
    expect(adapter.getAnalyticsConsent()).toBe('unset')
  })
})
