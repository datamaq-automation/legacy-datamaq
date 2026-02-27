import { beforeEach, describe, expect, it, vi } from 'vitest'

describe('publicConfig', () => {
  beforeEach(() => {
    vi.resetModules()
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
    expect(profile.backendBaseUrl).toBeUndefined()
    expect(profile.inquiryApiUrl).toBe('https://api.datamaq.com.ar/v1/contact')
    expect(profile.contentApiUrl).toBe('https://api.datamaq.com.ar/v1/content')
    expect(profile.healthApiUrl).toBe('https://api.datamaq.com.ar/v1/health')
    expect(profile.quoteDiagnosticApiUrl).toBe('https://api.datamaq.com.ar/v1/quote/diagnostic')
    expect(profile.quotePdfApiUrl).toBe('https://api.datamaq.com.ar/v1/quote/pdf?quote_id={quote_id}')
  })
})


