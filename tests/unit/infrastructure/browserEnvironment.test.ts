import { describe, expect, it } from 'vitest'
import { BrowserEnvironment } from '@/infrastructure/environment/browserEnvironment'

describe('BrowserEnvironment', () => {
  it('exposes browser runtime information', () => {
    window.history.replaceState({}, '', '/servicios?utm_source=test-suite')

    const environment = new BrowserEnvironment()

    expect(typeof environment.now()).toBe('number')
    expect(environment.href()).toContain('/servicios?utm_source=test-suite')
    expect(environment.search()).toBe('?utm_source=test-suite')
    expect(environment.referrer()).toBe(document.referrer)
    expect(environment.userAgent()).toBe(navigator.userAgent)
    expect(environment.isBrowser()).toBe(true)
    expect(typeof environment.isDev()).toBe('boolean')
  })
})
