import { beforeEach, describe, expect, it, vi } from 'vitest'

describe('publicConfig', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.unstubAllEnvs()
  })

  it('uses datamaq profile by default in test mode', async () => {
    const { publicConfig } = await import('@/infrastructure/config/publicConfig')

    expect(publicConfig.brandId).toBe('datamaq')
    expect(publicConfig.storageNamespace).toBe('datamaq')
    expect(publicConfig.siteUrl).toBe('https://www.datamaq.com.ar')
    expect(publicConfig.healthApiUrl).toBe('https://api.datamaq.com.ar/v1/health')
  })

  it('resolves upp profile explicitly', async () => {
    const { getRuntimeProfile } = await import('@/infrastructure/content/runtimeProfile')
    const profile = getRuntimeProfile('upp')

    expect(profile.brandId).toBe('upp')
    expect(profile.storageNamespace).toBe('upp')
    expect(profile.siteName).toBe('UPP')
    expect(profile.inquiryApiUrl).toBe('https://api.datamaq.com.ar/v1/contact')
    expect(profile.siteApiUrl).toBe('https://api.datamaq.com.ar/v1/site')
    expect(profile.healthApiUrl).toBe('https://api.datamaq.com.ar/v1/health')
    expect(profile.quoteDiagnosticApiUrl).toBe('https://api.datamaq.com.ar/v1/quote/diagnostic')
    expect(profile.quotePdfApiUrl).toBe('https://api.datamaq.com.ar/v1/quote/{quote_id}/pdf')
  })

  it('overrides backend endpoints from a local base url when requested at build time', async () => {
    vi.stubEnv('VITE_BACKEND_BASE_URL', 'http://127.0.0.1:8899')

    const { publicConfig } = await import('@/infrastructure/config/publicConfig')

    expect(publicConfig.inquiryApiUrl).toBe('http://127.0.0.1:8899/v1/contact')
    expect(publicConfig.pricingApiUrl).toBe('http://127.0.0.1:8899/v1/pricing')
    expect(publicConfig.siteApiUrl).toBe('http://127.0.0.1:8899/v1/site')
    expect(publicConfig.healthApiUrl).toBe('http://127.0.0.1:8899/v1/health')
    expect(publicConfig.quoteDiagnosticApiUrl).toBe('http://127.0.0.1:8899/v1/quote/diagnostic')
    expect(publicConfig.quotePdfApiUrl).toBe('http://127.0.0.1:8899/v1/quote/{quote_id}/pdf')
  })
})


