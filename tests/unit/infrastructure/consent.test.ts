import { beforeEach, describe, expect, it } from 'vitest'
import { getAnalyticsConsent, setAnalyticsConsent } from '@/infrastructure/consent/consent'

const STORAGE_KEY = 'consent.analytics'

describe('consent', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('devuelve unset y no falla sin window', () => {
    const originalWindow = globalThis.window
    // @ts-expect-error simulamos entorno sin window
    globalThis.window = undefined

    expect(getAnalyticsConsent()).toBe('unset')
    expect(() => setAnalyticsConsent('granted')).not.toThrow()

    // @ts-expect-error restauramos window
    globalThis.window = originalWindow
  })

  it('lee valores válidos guardados', () => {
    setAnalyticsConsent('granted')
    expect(getAnalyticsConsent()).toBe('granted')

    setAnalyticsConsent('denied')
    expect(getAnalyticsConsent()).toBe('denied')
  })

  it('devuelve unset para valores desconocidos', () => {
    window.localStorage.setItem(STORAGE_KEY, 'maybe')

    expect(getAnalyticsConsent()).toBe('unset')
  })
})
