import { beforeEach, describe, expect, it, vi } from 'vitest'

describe('publicConfig', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.unstubAllEnvs()
  })

  it('exposes the frozen datamaq runtime defaults', async () => {
    const { publicConfig } = await import('@/infrastructure/config/publicConfig')

    expect(publicConfig.brandId).toBe('datamaq')
    expect(publicConfig.storageNamespace).toBe('datamaq')
    expect(publicConfig.siteUrl).toBe('https://datamaq.com.ar')
    expect(publicConfig.siteName).toBe('DataMaq')
    expect(publicConfig.healthApiUrl).toBe('https://api.datamaq.com.ar/v1/health')
    expect(publicConfig.inquiryApiUrl).toBe('https://n8n.datamaq.com.ar/webhook/contact-form')
  })

  it('overrides backend endpoints from a local base url when requested at build time', async () => {
    vi.stubEnv('VITE_BACKEND_BASE_URL', 'http://127.0.0.1:8899')

    const { publicConfig } = await import('@/infrastructure/config/publicConfig')

    expect(publicConfig.inquiryApiUrl).toBe('http://127.0.0.1:8899/v1/contact')
    expect(publicConfig.healthApiUrl).toBe('http://127.0.0.1:8899/v1/health')
  })
})


