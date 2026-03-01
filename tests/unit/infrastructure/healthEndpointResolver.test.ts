import { describe, expect, it } from 'vitest'
import { resolveHealthEndpoint } from '@/infrastructure/health/healthEndpointResolver'

describe('healthEndpointResolver', () => {
  it('keeps the proxied health endpoint on localhost:5173 integration origins', () => {
    expect(
      resolveHealthEndpoint({
        runtimeEndpoint: '/api/v1/health',
        configuredEndpoint: 'https://api.example.com/v1/health',
        appTarget: 'integration',
        currentLocation: {
          protocol: 'http:',
          hostname: 'localhost',
          port: '5173'
        }
      })
    ).toEqual({
      configuredUrl: '/api/v1/health',
      browserUrl: 'http://localhost:5173/api/v1/health',
      transportMode: 'proxy'
    })
  })

  it('keeps the proxied health endpoint on 127.0.0.1 integration origins', () => {
    expect(
      resolveHealthEndpoint({
        runtimeEndpoint: '/api/v1/health',
        configuredEndpoint: 'https://api.example.com/v1/health',
        appTarget: 'integration',
        currentLocation: {
          protocol: 'http:',
          hostname: '127.0.0.1',
          port: '4173'
        }
      })
    ).toEqual({
      configuredUrl: '/api/v1/health',
      browserUrl: 'http://127.0.0.1:4173/api/v1/health',
      transportMode: 'proxy'
    })
  })

  it('falls back to the relative proxy contract on integration targets even if only absolute endpoints are configured', () => {
    expect(
      resolveHealthEndpoint({
        runtimeEndpoint: 'http://127.0.0.1:8000/v1/health',
        configuredEndpoint: 'https://api.example.com/v1/health',
        appTarget: 'integration',
        currentLocation: {
          protocol: 'http:',
          hostname: 'localhost',
          port: '5173'
        }
      })
    ).toEqual({
      configuredUrl: '/api/v1/health',
      browserUrl: 'http://localhost:5173/api/v1/health',
      transportMode: 'proxy'
    })
  })

  it('uses the configured endpoint directly outside integration targets', () => {
    expect(
      resolveHealthEndpoint({
        runtimeEndpoint: 'https://api.runtime.example.com/v1/health',
        configuredEndpoint: 'https://api.config.example.com/v1/health',
        appTarget: 'datamaq'
      })
    ).toEqual({
      configuredUrl: 'https://api.config.example.com/v1/health',
      browserUrl: 'https://api.config.example.com/v1/health',
      transportMode: 'direct'
    })
  })
})
