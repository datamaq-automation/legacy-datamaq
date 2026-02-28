import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { probeBackendHealth } from '@/infrastructure/health/probeBackendHealth'

describe('probeBackendHealth', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it('logs successful backend health connection', async () => {
    const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => undefined)
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            status: 'ok',
            service: 'datamaq-api',
            brand_id: 'datamaq',
            version: 'v1',
            timestamp: '2026-02-26T00:00:00Z'
          }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          }
        )
      )
    )
    vi.stubGlobal('location', {
      protocol: 'http:',
      hostname: 'localhost',
      port: '5173'
    })

    const result = await probeBackendHealth('/api/v1/health')

    expect(infoSpy).toHaveBeenCalledWith('[backend:health] conexion OK', {
      endpoint: 'http://localhost:5173/api/v1/health',
      transportMode: 'proxy',
      status: 200,
      service: 'datamaq-api',
      brandId: 'datamaq',
      version: 'v1',
      timestamp: '2026-02-26T00:00:00Z',
      health: 'ok'
    })
    expect(result).toEqual({
      endpoint: '/api/v1/health',
      ok: true,
      status: 200,
      service: 'datamaq-api',
      brandId: 'datamaq',
      version: 'v1',
      timestamp: '2026-02-26T00:00:00Z',
      health: 'ok'
    })
    expect(warnSpy).not.toHaveBeenCalled()
  })

  it('logs warning on network failure', async () => {
    const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => undefined)
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')))
    vi.stubGlobal('location', {
      protocol: 'http:',
      hostname: 'localhost',
      port: '5173'
    })

    const result = await probeBackendHealth('/api/v1/health')

    expect(warnSpy).toHaveBeenCalledWith('[backend:health] error de red', {
      pathname: '/api/v1/health',
      transportMode: 'proxy',
      status: 0,
      reason: 'network-error'
    })
    expect(result).toEqual({
      endpoint: '/api/v1/health',
      ok: false,
      status: 0,
      service: null,
      brandId: null,
      version: null,
      timestamp: null,
      health: null
    })
    expect(infoSpy).not.toHaveBeenCalled()
  })

  it('sanitizes non-ok health warnings to pathname and reason only', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response('backend down', {
          status: 503
        })
      )
    )
    vi.stubGlobal('location', {
      protocol: 'http:',
      hostname: 'localhost',
      port: '5173'
    })

    await probeBackendHealth('/api/v1/health?token=secret')

    expect(warnSpy).toHaveBeenCalledWith('[backend:health] sin conexion', {
      pathname: '/api/v1/health',
      transportMode: 'proxy',
      status: 503,
      reason: 'http-error'
    })
  })

  it('uses runtime-configured health endpoint by default', async () => {
    vi.resetModules()
    vi.doMock('@/infrastructure/config/publicConfig', () => ({
      publicConfig: {
        healthApiUrl: 'https://api.example.com/v1/health'
      }
    }))
    vi.doMock('@/infrastructure/content/runtimeProfile', () => ({
      activeAppTarget: 'datamaq'
    }))
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ status: 'ok' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    )
    vi.stubGlobal('fetch', fetchMock)
    const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => undefined)
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined)

    const { probeBackendHealth: probeBackendHealthWithDefault } = await import(
      '@/infrastructure/health/probeBackendHealth'
    )
    const result = await probeBackendHealthWithDefault()

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.example.com/v1/health',
      expect.objectContaining({
        method: 'GET',
        headers: {
          Accept: 'application/json'
        }
      })
    )
    expect(infoSpy).toHaveBeenCalledWith('[backend:health] conexion OK', {
      endpoint: 'https://api.example.com/v1/health',
      transportMode: 'direct',
      status: 200,
      service: null,
      brandId: null,
      version: null,
      timestamp: null,
      health: 'ok'
    })
    expect(result).toEqual({
      endpoint: 'https://api.example.com/v1/health',
      ok: true,
      status: 200,
      service: null,
      brandId: null,
      version: null,
      timestamp: null,
      health: 'ok'
    })
    expect(warnSpy).not.toHaveBeenCalled()
  })

  it('uses the integration runtime health endpoint directly on localhost:5173', async () => {
    vi.resetModules()
    vi.stubEnv('VITE_HEALTH_ENDPOINT', 'https://api.example.com/v1/health')
    vi.stubGlobal('location', {
      protocol: 'http:',
      hostname: 'localhost',
      port: '5173'
    })
    vi.doMock('@/infrastructure/config/publicConfig', () => ({
      publicConfig: {
        healthApiUrl: 'http://127.0.0.1:8899/v1/health'
      }
    }))
    vi.doMock('@/infrastructure/content/runtimeProfile', () => ({
      activeAppTarget: 'integration'
    }))
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ status: 'ok' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    )
    vi.stubGlobal('fetch', fetchMock)
    const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => undefined)

    const { probeBackendHealth: probeBackendHealthWithDefault } = await import(
      '@/infrastructure/health/probeBackendHealth'
    )
    const result = await probeBackendHealthWithDefault()

    expect(fetchMock).toHaveBeenCalledWith(
      'http://127.0.0.1:8899/v1/health',
      expect.objectContaining({
        method: 'GET',
        headers: {
          Accept: 'application/json'
        }
      })
    )
    expect(result).toEqual({
      endpoint: 'http://127.0.0.1:8899/v1/health',
      ok: true,
      status: 200,
      service: null,
      brandId: null,
      version: null,
      timestamp: null,
      health: 'ok'
    })
    expect(infoSpy).toHaveBeenCalledWith('[backend:health] conexion OK', {
      endpoint: 'http://127.0.0.1:8899/v1/health',
      transportMode: 'direct',
      status: 200,
      service: null,
      brandId: null,
      version: null,
      timestamp: null,
      health: 'ok'
    })
  })

  it('keeps the proxy health endpoint on 127.0.0.1 integration origins', async () => {
    vi.resetModules()
    vi.stubEnv('VITE_HEALTH_ENDPOINT', 'https://api.example.com/v1/health')
    vi.stubGlobal('location', {
      protocol: 'http:',
      hostname: '127.0.0.1',
      port: '4173'
    })
    vi.doMock('@/infrastructure/config/publicConfig', () => ({
      publicConfig: {
        healthApiUrl: 'http://127.0.0.1:8899/v1/health'
      }
    }))
    vi.doMock('@/infrastructure/content/runtimeProfile', () => ({
      activeAppTarget: 'integration'
    }))
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ status: 'ok' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    )
    vi.stubGlobal('fetch', fetchMock)
    const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => undefined)

    const { probeBackendHealth: probeBackendHealthWithDefault } = await import(
      '@/infrastructure/health/probeBackendHealth'
    )
    const result = await probeBackendHealthWithDefault()

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/v1/health',
      expect.objectContaining({
        method: 'GET',
        headers: {
          Accept: 'application/json'
        }
      })
    )
    expect(result).toEqual({
      endpoint: '/api/v1/health',
      ok: true,
      status: 200,
      service: null,
      brandId: null,
      version: null,
      timestamp: null,
      health: 'ok'
    })
    expect(infoSpy).toHaveBeenCalledWith('[backend:health] conexion OK', {
      endpoint: 'http://127.0.0.1:4173/api/v1/health',
      transportMode: 'proxy',
      status: 200,
      service: null,
      brandId: null,
      version: null,
      timestamp: null,
      health: 'ok'
    })
  })
})


