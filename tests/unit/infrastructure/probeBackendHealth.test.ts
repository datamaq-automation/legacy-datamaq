import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { probeBackendHealth } from '@/infrastructure/health/probeBackendHealth'

describe('probeBackendHealth', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
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

    await probeBackendHealth('/api/v1/health')

    expect(infoSpy).toHaveBeenCalledWith('[backend:health] conexion OK', {
      endpoint: '/api/v1/health',
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

    await probeBackendHealth('/api/v1/health')

    expect(warnSpy).toHaveBeenCalledWith('[backend:health] sin conexion', {
      endpoint: '/api/v1/health',
      status: 0
    })
    expect(infoSpy).not.toHaveBeenCalled()
  })
})


