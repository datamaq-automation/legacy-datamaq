import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { probeBackendHealth } from '@/infrastructure/health/probeBackendHealth'

describe('probeBackendHealth', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllEnvs()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllEnvs()
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

    const result = await probeBackendHealth('/api/v1/health')

    expect(infoSpy).toHaveBeenCalledWith('[backend:health] conexion OK', {
      endpoint: '/api/v1/health',
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

    const result = await probeBackendHealth('/api/v1/health')

    expect(warnSpy).toHaveBeenCalledWith('[backend:health] sin conexion', {
      endpoint: '/api/v1/health',
      status: 0
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

  it('uses the integration runtime health endpoint directly in integration mode', async () => {
    vi.resetModules()
    vi.stubEnv('VITE_HEALTH_ENDPOINT', 'https://api.example.com/v1/health')
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
  })
})


