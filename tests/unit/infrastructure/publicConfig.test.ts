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

  it('resolves datamaq profile explicitly', async () => {
    const { getRuntimeProfile } = await import('@/infrastructure/content/runtimeProfile')
    const profile = getRuntimeProfile('datamaq')

    expect(profile.brandId).toBe('datamaq')
    expect(profile.storageNamespace).toBe('datamaq')
    expect(profile.siteName).toBe('DataMaq')
    expect(profile.inquiryApiUrl).toBe('https://n8n.datamaq.com.ar/webhook/contact-form')
    expect(profile.siteApiUrl).toBe('https://api.datamaq.com.ar/v1/site')
    expect(profile.healthApiUrl).toBe('https://api.datamaq.com.ar/v1/health')
  })

  it('overrides backend endpoints from a local base url when requested at build time', async () => {
    vi.stubEnv('VITE_BACKEND_BASE_URL', 'http://127.0.0.1:8899')

    const { publicConfig } = await import('@/infrastructure/config/publicConfig')

    expect(publicConfig.inquiryApiUrl).toBe('http://127.0.0.1:8899/v1/contact')
    expect(publicConfig.pricingApiUrl).toBe('http://127.0.0.1:8899/v1/pricing')
    expect(publicConfig.siteApiUrl).toBe('http://127.0.0.1:8899/v1/site')
    expect(publicConfig.healthApiUrl).toBe('http://127.0.0.1:8899/v1/health')
  })
})


