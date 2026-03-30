import { beforeEach, describe, expect, it, vi } from 'vitest'

type PublicConfigStub = {
  brandId?: string
  storageNamespace?: string
  contactEmail?: string
  contactFormActive?: boolean
  analyticsEnabled?: boolean
  inquiryApiUrl?: string
  healthApiUrl?: string
}

describe('ViteConfig', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.unstubAllEnvs()
  })

  it('preserves relative canonical endpoints (/api/v1/...)', async () => {
    const ViteConfig = await importViteConfigWithPublicConfig({
      inquiryApiUrl: '/api/v1/contact',
      healthApiUrl: '/api/v1/health'
    })
    const config = new ViteConfig()

    expect(config.inquiryApiUrl).toBe('/api/v1/contact')
    expect(config.healthApiUrl).toBe('/api/v1/health')
  })

  it('accepts explicit https endpoints', async () => {
    const ViteConfig = await importViteConfigWithPublicConfig({
      inquiryApiUrl: 'https://api.example.com/contact',
      healthApiUrl: 'https://api.example.com/health'
    })
    const config = new ViteConfig()

    expect(config.inquiryApiUrl).toBe('https://api.example.com/contact')
    expect(config.healthApiUrl).toBe('https://api.example.com/health')
  })

  it('returns undefined when direct endpoints are missing', async () => {
    const ViteConfig = await importViteConfigWithPublicConfig({})
    const config = new ViteConfig()

    expect(config.inquiryApiUrl).toBeUndefined()
    expect(config.healthApiUrl).toBeUndefined()
  })

  it('prioritizes explicit inquiry/health endpoint overrides from env', async () => {
    vi.stubEnv('VITE_INQUIRY_API_URL', 'https://n8n.datamaq.com.ar/webhook/form-contacto')
    vi.stubEnv('VITE_HEALTH_API_URL', 'https://n8n.datamaq.com.ar/healthz')

    const ViteConfig = await importViteConfigWithPublicConfig({
      inquiryApiUrl: 'https://api.example.com/contact',
      healthApiUrl: 'https://api.example.com/health'
    })
    const config = new ViteConfig()

    expect(config.inquiryApiUrl).toBe('https://n8n.datamaq.com.ar/webhook/form-contacto')
    expect(config.healthApiUrl).toBe('https://n8n.datamaq.com.ar/healthz')
  })
})

async function importViteConfigWithPublicConfig(overrides: PublicConfigStub) {
  vi.doMock('@/infrastructure/config/publicConfig', () => ({
    publicConfig: {
      brandId: 'test',
      storageNamespace: 'test',
      contactEmail: 'contacto@example.com',
      contactFormActive: true,
      analyticsEnabled: false,
      ...overrides
    }
  }))

  const module = await import('@/infrastructure/config/viteConfig')
  return module.ViteConfig
}


