import { describe, expect, it } from 'vitest'
import { getRuntimeProfile, resolveAppTarget } from '@/infrastructure/content/runtimeProfile'

describe('runtimeProfile', () => {
  it('maps development mode to the integration profile for local validation', () => {
    expect(resolveAppTarget(undefined, 'development')).toBe('integration')
  })

  it('keeps integration endpoints relative to /api/v1', () => {
    const profile = getRuntimeProfile('integration')

    expect(profile.healthApiUrl).toBe('/api/v1/health')
    expect(profile.inquiryApiUrl).toBe('/api/v1/contact')
    expect(profile.mailApiUrl).toBe('/api/v1/mail')
    expect(profile.pricingApiUrl).toBe('/api/v1/pricing')
    expect(profile.contentApiUrl).toBe('/api/v1/content')
    expect(profile.quoteDiagnosticApiUrl).toBe('/api/v1/quote/diagnostic')
    expect(profile.quotePdfApiUrl).toBe('/api/v1/quote/pdf?quote_id={quote_id}')
  })
})
