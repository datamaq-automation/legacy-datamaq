// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest'

describe('vite proxy config', () => {
  afterEach(() => {
    delete process.env.VITE_API_PROXY_TARGET
    vi.resetModules()
    vi.restoreAllMocks()
  })

  it('uses the local FastAPI bridge on port 8000 by default', async () => {
    const configFactory = (await import('../../../vite.config.js')).default
    const config = configFactory({ mode: 'development' })
    const proxy = config.server.proxy['/api']
    const rewrite = config.server.proxy['/api'].rewrite

    expect(proxy.target).toBe('http://127.0.0.1:8000')
    expect(rewrite('/api/v1/health')).toBe('/v1/health')
  })

  it('bridges /api/v1 to /v1 for explicit FastAPI local targets', async () => {
    process.env.VITE_API_PROXY_TARGET = 'http://127.0.0.1:8000'

    const configFactory = (await import('../../../vite.config.js')).default
    const config = configFactory({ mode: 'development' })
    const rewrite = config.server.proxy['/api'].rewrite

    expect(rewrite('/api/v1/health')).toBe('/v1/health')
    expect(rewrite('/api/v1/quote/Q-20260222-000321/pdf')).toBe('/v1/quote/Q-20260222-000321/pdf')
  })

  it('keeps warn/error in production while stripping log/info/debug calls', async () => {
    const configFactory = (await import('../../../vite.config.js')).default
    const config = configFactory({ mode: 'production' })

    expect(config.esbuild).toEqual({
      pure: ['console.log', 'console.info', 'console.debug'],
      drop: ['debugger']
    })
  })
})
