import { beforeEach, describe, expect, it, vi } from 'vitest'

type PublicConfigStub = {
  brandId?: string
  storageNamespace?: string
  contactEmail?: string
  contactFormActive?: boolean
  emailFormActive?: boolean
  analyticsEnabled?: boolean
  backendBaseUrl?: string
  inquiryApiUrl?: string
  mailApiUrl?: string
  pricingApiUrl?: string
  contentApiUrl?: string
  quoteDiagnosticApiUrl?: string
  quotePdfApiUrl?: string
  allowInsecureBackend?: boolean
}

describe('ViteConfig', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('preserves relative endpoints (/api/*.php)', async () => {
    const ViteConfig = await importViteConfigWithPublicConfig({
      inquiryApiUrl: '/api/v1/contact',
      mailApiUrl: '/api/v1/mail',
      pricingApiUrl: '/api/v1/pricing',
      contentApiUrl: '/api/v1/content',
      quoteDiagnosticApiUrl: '/api/v1/quote/diagnostic',
      quotePdfApiUrl: '/api/v1/quote/pdf?quote_id={quote_id}'
    })
    const config = new ViteConfig()

    expect(config.inquiryApiUrl).toBe('/api/v1/contact')
    expect(config.mailApiUrl).toBe('/api/v1/mail')
    expect(config.pricingApiUrl).toBe('/api/v1/pricing')
    expect(config.contentApiUrl).toBe('/api/v1/content')
    expect(config.quoteDiagnosticApiUrl).toBe('/api/v1/quote/diagnostic')
    expect(config.quotePdfApiUrl).toBe('/api/v1/quote/pdf?quote_id={quote_id}')
  })

  it('accepts explicit https endpoints', async () => {
    const ViteConfig = await importViteConfigWithPublicConfig({
      inquiryApiUrl: 'https://api.example.com/contact',
      mailApiUrl: 'https://api.example.com/mail',
      pricingApiUrl: 'https://api.example.com/pricing',
      contentApiUrl: 'https://api.example.com/content',
      quoteDiagnosticApiUrl: 'https://api.example.com/quote/diagnostic',
      quotePdfApiUrl: 'https://api.example.com/quote/pdf?quote_id={quote_id}'
    })
    const config = new ViteConfig()

    expect(config.inquiryApiUrl).toBe('https://api.example.com/contact')
    expect(config.mailApiUrl).toBe('https://api.example.com/mail')
    expect(config.pricingApiUrl).toBe('https://api.example.com/pricing')
    expect(config.contentApiUrl).toBe('https://api.example.com/content')
    expect(config.quoteDiagnosticApiUrl).toBe('https://api.example.com/quote/diagnostic')
    expect(config.quotePdfApiUrl).toBe('https://api.example.com/quote/pdf?quote_id={quote_id}')
  })

  it('falls back to backendBaseUrl when direct endpoints are missing', async () => {
    const ViteConfig = await importViteConfigWithPublicConfig({
      backendBaseUrl: 'https://legacy.example.com'
    })
    const config = new ViteConfig()

    expect(config.inquiryApiUrl).toBe('https://legacy.example.com/v1/contact')
    expect(config.mailApiUrl).toBe('https://legacy.example.com/v1/mail')
    expect(config.pricingApiUrl).toBe('https://legacy.example.com/v1/public/pricing')
    expect(config.contentApiUrl).toBe('https://legacy.example.com/v1/public/content')
    expect(config.quoteDiagnosticApiUrl).toBe('https://legacy.example.com/v1/public/quote/diagnostic')
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
      emailFormActive: true,
      analyticsEnabled: false,
      allowInsecureBackend: false,
      ...overrides
    }
  }))

  const module = await import('@/infrastructure/config/viteConfig')
  return module.ViteConfig
}

