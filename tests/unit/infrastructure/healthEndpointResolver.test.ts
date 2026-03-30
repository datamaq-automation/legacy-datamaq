import { describe, expect, it } from 'vitest'
import { resolveHealthEndpoint } from '@/infrastructure/health/healthEndpointResolver'

describe('healthEndpointResolver', () => {
  it('keeps the proxied health endpoint when a relative configured endpoint is provided', () => {
    expect(
      resolveHealthEndpoint({
        runtimeEndpoint: '/api/v1/health',
        configuredEndpoint: '/api/v1/health',
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

  it('keeps the proxied health endpoint on 127.0.0.1 origins', () => {
    expect(
      resolveHealthEndpoint({
        runtimeEndpoint: '/api/v1/health',
        configuredEndpoint: '/api/v1/health',
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

  it('falls back to the runtime relative endpoint when the configured endpoint is absolute', () => {
    expect(
      resolveHealthEndpoint({
        runtimeEndpoint: '/api/v1/health',
        configuredEndpoint: 'https://api.example.com/v1/health',
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

  it('uses the configured endpoint directly when no relative proxy is configured', () => {
    expect(
      resolveHealthEndpoint({
        runtimeEndpoint: 'https://api.runtime.example.com/v1/health',
        configuredEndpoint: 'https://api.config.example.com/v1/health'
      })
    ).toEqual({
      configuredUrl: 'https://api.config.example.com/v1/health',
      browserUrl: 'https://api.config.example.com/v1/health',
      transportMode: 'direct'
    })
  })
})
