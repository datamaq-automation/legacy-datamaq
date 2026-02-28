// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest'

describe('vite proxy config', () => {
  afterEach(() => {
    delete process.env.VITE_API_PROXY_TARGET
    delete process.env.VITE_API_PROXY_PREFIX
    delete process.env.VITE_API_PROXY_FORCE_LEGACY_PREFIX
    vi.resetModules()
    vi.restoreAllMocks()
  })

  it('ignores the legacy localhost prefix by default', async () => {
    process.env.VITE_API_PROXY_PREFIX = '/plantilla-www/public'

    const configFactory = (await import('../../../vite.config.js')).default
    const config = configFactory({ mode: 'development' })
    const rewrite = config.server.proxy['/api'].rewrite

    expect(rewrite('/api/v1/health')).toBe('/api/v1/health/')
  })

  it('preserves the legacy prefix when explicitly forced', async () => {
    process.env.VITE_API_PROXY_PREFIX = '/plantilla-www/public'
    process.env.VITE_API_PROXY_FORCE_LEGACY_PREFIX = '1'

    const configFactory = (await import('../../../vite.config.js')).default
    const config = configFactory({ mode: 'development' })
    const rewrite = config.server.proxy['/api'].rewrite

    expect(rewrite('/api/v1/health')).toBe('/plantilla-www/public/api/v1/health')
  })

  it('keeps clean local upstreams for explicit loopback backends', async () => {
    process.env.VITE_API_PROXY_TARGET = 'http://127.0.0.1:8899'
    process.env.VITE_API_PROXY_PREFIX = ''

    const configFactory = (await import('../../../vite.config.js')).default
    const config = configFactory({ mode: 'development' })
    const rewrite = config.server.proxy['/api'].rewrite

    expect(rewrite('/api/v1/health')).toBe('/api/v1/health')
    expect(rewrite('/api/v1/quote/pdf?quote_id=test')).toBe('/api/v1/quote/pdf?quote_id=test')
  })
})
