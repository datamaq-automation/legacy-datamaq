import { describe, expect, it } from 'vitest'
import { getRuntimeProfile, resolveAppTarget } from '@/infrastructure/content/runtimeProfile'

describe('runtimeProfile', () => {
  it('maps development mode to the integration profile for local validation', () => {
    expect(resolveAppTarget(undefined, 'development')).toBe('integration')
  })

  it('uses direct Laravel health/content endpoints in integration while keeping the rest relative to /api/v1', () => {
    const profile = getRuntimeProfile('integration')

    expect(profile.healthApiUrl).toBe('http://127.0.0.1:8899/v1/health')
    expect(profile.contentApiUrl).toBe('http://127.0.0.1:8899/v1/content')
    expect(profile.inquiryApiUrl).toBe('/api/v1/contact')
    expect(profile.mailApiUrl).toBe('/api/v1/mail')
    expect(profile.pricingApiUrl).toBe('/api/v1/pricing')
    expect(profile.quoteDiagnosticApiUrl).toBe('/api/v1/quote/diagnostic')
    expect(profile.quotePdfApiUrl).toBe('/api/v1/quote/pdf?quote_id={quote_id}')
  })
})
