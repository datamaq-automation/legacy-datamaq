import { beforeEach, describe, expect, it, vi } from 'vitest'

type PublicConfigStub = {
  brandId?: string
  storageNamespace?: string
  contactEmail?: string
  contactFormActive?: boolean
  analyticsEnabled?: boolean
  inquiryApiUrl?: string
  pricingApiUrl?: string
  siteApiUrl?: string
  quoteDiagnosticApiUrl?: string
  quotePdfApiUrl?: string
}

describe('ViteConfig', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('preserves relative canonical endpoints (/api/v1/...)', async () => {
    const ViteConfig = await importViteConfigWithPublicConfig({
      inquiryApiUrl: '/api/v1/contact',
      pricingApiUrl: '/api/v1/pricing',
      siteApiUrl: '/api/v1/site',
      quoteDiagnosticApiUrl: '/api/v1/quote/diagnostic',
      quotePdfApiUrl: '/api/v1/quote/{quote_id}/pdf'
    })
    const config = new ViteConfig()

    expect(config.inquiryApiUrl).toBe('/api/v1/contact')
    expect(config.pricingApiUrl).toBe('/api/v1/pricing')
    expect(config.siteApiUrl).toBe('/api/v1/site')
    expect(config.quoteDiagnosticApiUrl).toBe('/api/v1/quote/diagnostic')
    expect(config.quotePdfApiUrl).toBe('/api/v1/quote/{quote_id}/pdf')
  })

  it('accepts explicit https endpoints', async () => {
    const ViteConfig = await importViteConfigWithPublicConfig({
      inquiryApiUrl: 'https://api.example.com/contact',
      pricingApiUrl: 'https://api.example.com/pricing',
      siteApiUrl: 'https://api.example.com/site',
      quoteDiagnosticApiUrl: 'https://api.example.com/quote/diagnostic',
      quotePdfApiUrl: 'https://api.example.com/quote/{quote_id}/pdf'
    })
    const config = new ViteConfig()

    expect(config.inquiryApiUrl).toBe('https://api.example.com/contact')
    expect(config.pricingApiUrl).toBe('https://api.example.com/pricing')
    expect(config.siteApiUrl).toBe('https://api.example.com/site')
    expect(config.quoteDiagnosticApiUrl).toBe('https://api.example.com/quote/diagnostic')
    expect(config.quotePdfApiUrl).toBe('https://api.example.com/quote/{quote_id}/pdf')
  })

  it('returns undefined when direct endpoints are missing', async () => {
    const ViteConfig = await importViteConfigWithPublicConfig({})
    const config = new ViteConfig()

    expect(config.inquiryApiUrl).toBeUndefined()
    expect(config.pricingApiUrl).toBeUndefined()
    expect(config.siteApiUrl).toBeUndefined()
    expect(config.quoteDiagnosticApiUrl).toBeUndefined()
    expect(config.quotePdfApiUrl).toBeUndefined()
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


