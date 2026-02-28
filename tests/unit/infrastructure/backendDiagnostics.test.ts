import { describe, expect, it } from 'vitest'
import {
  buildBackendEndpointContext,
  buildBackendInfoPayload,
  extractBackendResponseMetadata,
  normalizeBackendString
} from '@/infrastructure/backend/backendDiagnostics'

describe('backendDiagnostics', () => {
  it('extracts normalized backend metadata from snake_case payloads', () => {
    expect(
      extractBackendResponseMetadata({
        status: 'ok',
        request_id: 'req-123',
        brand_id: 'datamaq',
        version: 'v2',
        timestamp: '2026-02-28T13:20:00Z',
        service: 'Laravel',
        content_revision: 'rev-1',
        currency: 'ARS'
      })
    ).toEqual({
      status: 'ok',
      requestId: 'req-123',
      brandId: 'datamaq',
      version: 'v2',
      timestamp: '2026-02-28T13:20:00Z',
      service: 'Laravel',
      contentRevision: 'rev-1',
      currency: 'ARS'
    })
  })

  it('builds endpoint context for proxied urls', () => {
    expect(
      buildBackendEndpointContext('/api/v1/pricing', {
        protocol: 'http:',
        hostname: 'localhost',
        port: '5173'
      })
    ).toEqual({
      configuredUrl: '/api/v1/pricing',
      browserUrl: 'http://localhost:5173/api/v1/pricing',
      transportMode: 'proxy'
    })
  })

  it('builds a unified backend info payload with normalized base fields and details', () => {
    expect(
      buildBackendInfoPayload({
        resource: 'pricing',
        endpoint: '/api/v1/pricing?token=secret',
        status: 200,
        payload: {
          status: 'ok',
          request_id: 'req-123',
          version: 'v1',
          currency: 'ARS'
        },
        details: {
          currency: 'ARS',
          pricingSnapshot: {
            visitaDiagnosticoHasta2hARS: 275000
          },
          ignored: null
        },
        currentLocation: {
          protocol: 'http:',
          hostname: 'localhost',
          port: '5173'
        }
      })
    ).toEqual({
      resource: 'pricing',
      endpoint: 'http://localhost:5173/api/v1/pricing?token=secret',
      pathname: '/api/v1/pricing',
      transportMode: 'proxy',
      status: 200,
      backendStatus: 'ok',
      requestId: 'req-123',
      version: 'v1',
      brandId: null,
      timestamp: null,
      details: {
        currency: 'ARS',
        pricingSnapshot: {
          visitaDiagnosticoHasta2hARS: 275000
        }
      }
    })
  })

  it('normalizes only non-empty strings', () => {
    expect(normalizeBackendString(' ok ')).toBe('ok')
    expect(normalizeBackendString('   ')).toBeNull()
    expect(normalizeBackendString(10)).toBeNull()
  })
})
