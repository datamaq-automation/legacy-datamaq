import { describe, expect, it } from 'vitest'
import {
  buildBackendInfoPayload
} from '@/infrastructure/backend/backendDiagnostics'

describe('backendDiagnostics', () => {
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

  it('normalizes metadata and endpoint context through the public payload builder', () => {
    expect(
      buildBackendInfoPayload({
        resource: 'health',
        endpoint: '/api/v1/health',
        status: 200,
        payload: {
          status: ' ok ',
          request_id: 'req-123',
          brand_id: 'datamaq',
          version: 'v2',
          timestamp: '2026-02-28T13:20:00Z',
          service: 'Laravel',
          content_revision: 'rev-1',
          currency: 'ARS'
        },
        currentLocation: {
          protocol: 'http:',
          hostname: 'localhost',
          port: '5173'
        }
      })
    ).toEqual({
      resource: 'health',
      endpoint: 'http://localhost:5173/api/v1/health',
      pathname: '/api/v1/health',
      transportMode: 'proxy',
      status: 200,
      backendStatus: 'ok',
      requestId: 'req-123',
      version: 'v2',
      brandId: 'datamaq',
      timestamp: '2026-02-28T13:20:00Z',
      details: null
    })
  })
})
