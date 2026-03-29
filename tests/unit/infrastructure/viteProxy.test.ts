// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest'
import { EventEmitter } from 'node:events'

describe('vite proxy config', () => {
  afterEach(() => {
    delete process.env.VITE_API_PROXY_TARGET
    vi.resetModules()
    vi.restoreAllMocks()
  })

  it('uses api.datamaq.com.ar by default', async () => {
    const configFactory = (await import('../../../vite.config.js')).default
    const config = configFactory({ mode: 'development', command: 'serve' })
    const proxy = config.server.proxy['/api'] as any
    const rewrite = proxy.rewrite

    expect(proxy.target).toBe('https://api.datamaq.com.ar')
    expect(rewrite('/api/v1/health')).toBe('/v1/health')
  })

  it('bridges /api/v1 to /v1 for explicit FastAPI local targets', async () => {
    process.env.VITE_API_PROXY_TARGET = 'http://127.0.0.1:8000'

    const configFactory = (await import('../../../vite.config.js')).default
    const config = configFactory({ mode: 'development', command: 'serve' })
    const proxy = config.server.proxy['/api'] as any
    const rewrite = proxy.rewrite

    expect(rewrite('/api/v1/health')).toBe('/v1/health')
    expect(rewrite('/api/v1/quote/Q-20260222-000321/pdf')).toBe('/v1/quote/Q-20260222-000321/pdf')
  })

  it('summarizes backend-offline proxy errors without stack noise', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    const { attachBackendProxyDiagnostics } = await import('../../../vite.config.js')
    const proxy = new EventEmitter()

    attachBackendProxyDiagnostics(proxy, 'http://127.0.0.1:8000')

    proxy.emit('error', { code: 'ECONNREFUSED' }, { method: 'GET', url: '/v1/health' })
    proxy.emit('error', { code: 'ECONNREFUSED' }, { method: 'GET', url: '/v1/health' })

    expect(warnSpy).toHaveBeenNthCalledWith(
      1,
      '[vite:proxy] GET /v1/health -> http://127.0.0.1:8000 backend-offline | Backend no disponible en http://127.0.0.1:8000. Inicia el backend o actualiza VITE_API_PROXY_TARGET. Usa VITE_PROXY_VERBOSE=true para detalle tecnico.'
    )
    expect(warnSpy).toHaveBeenNthCalledWith(
      2,
      '[vite:proxy:summary] Frontend OK. Proxy backend OFFLINE (http://127.0.0.1:8000).'
    )
    expect(warnSpy).toHaveBeenNthCalledWith(
      3,
      '[vite:proxy] GET /v1/health -> http://127.0.0.1:8000 backend-offline (x2) | Backend no disponible en http://127.0.0.1:8000. Inicia el backend o actualiza VITE_API_PROXY_TARGET. Usa VITE_PROXY_VERBOSE=true para detalle tecnico.'
    )
  })

  it('keeps warn/error in production while stripping log/info/debug calls', async () => {
    const configFactory = (await import('../../../vite.config.js')).default
    const config = configFactory({ mode: 'production', command: 'build' })

    expect(config.esbuild).toEqual({
      pure: ['console.log', 'console.info', 'console.debug'],
      drop: ['debugger']
    })
  })
})
