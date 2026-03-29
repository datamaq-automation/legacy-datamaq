import { describe, expect, it } from 'vitest'
import { getRuntimeProfile, resolveAppTarget } from '@/infrastructure/content/runtimeProfile'

describe('runtimeProfile', () => {
  it('maps development mode to the datamaq profile by default', () => {
    expect(resolveAppTarget(undefined, 'development')).toBe('datamaq')
  })

  it('keeps integration endpoints behind /api/v1 for local proxy validation', () => {
    const profile = getRuntimeProfile('integration')

    expect(profile.healthApiUrl).toBe('/api/v1/health')
    expect(profile.siteApiUrl).toBe('/api/v1/site')
    expect(profile.inquiryApiUrl).toBe('/api/v1/contact')
    expect(profile.pricingApiUrl).toBe('/api/v1/pricing')
    expect(profile.quoteDiagnosticApiUrl).toBe('/api/v1/quote/diagnostic')
    expect(profile.quotePdfApiUrl).toBe('/api/v1/quote/{quote_id}/pdf')
  })

  it('keeps e2e endpoints behind /api/v1 for local proxy validation', () => {
    const profile = getRuntimeProfile('e2e')

    expect(profile.healthApiUrl).toBe('/api/v1/health')
    expect(profile.siteApiUrl).toBe('/api/v1/site')
    expect(profile.inquiryApiUrl).toBe('/api/v1/contact')
    expect(profile.pricingApiUrl).toBe('/api/v1/pricing')
    expect(profile.quoteDiagnosticApiUrl).toBe('/api/v1/quote/diagnostic')
    expect(profile.quotePdfApiUrl).toBe('/api/v1/quote/{quote_id}/pdf')
  })
})
