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
  })

  it('resolves upp profile explicitly', async () => {
    const { getRuntimeProfile } = await import('@/infrastructure/content/runtimeProfile')
    const profile = getRuntimeProfile('upp')

    expect(profile.brandId).toBe('upp')
    expect(profile.storageNamespace).toBe('upp')
    expect(profile.siteName).toBe('UPP')
    expect(profile.backendBaseUrl).toBe('https://api.upp.example')
  })
})
