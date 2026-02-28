import { describe, expect, it } from 'vitest'
import {
  describeBackendEndpoint,
  isAbsoluteHttpBackendEndpoint,
  normalizeBackendEndpoint,
  resolveBackendPathname,
  resolveBrowserOrigin
} from '@/infrastructure/backend/backendEndpoint'

describe('backendEndpoint', () => {
  it('normalizes empty endpoints', () => {
    expect(normalizeBackendEndpoint('   ')).toBeUndefined()
    expect(normalizeBackendEndpoint(' /api/v1/health ')).toBe('/api/v1/health')
  })

  it('detects absolute http endpoints', () => {
    expect(isAbsoluteHttpBackendEndpoint('http://127.0.0.1:8899/v1/health')).toBe(true)
    expect(isAbsoluteHttpBackendEndpoint('https://api.example.com/v1/health')).toBe(true)
    expect(isAbsoluteHttpBackendEndpoint('/api/v1/health')).toBe(false)
  })

  it('describes direct backend endpoints', () => {
    expect(describeBackendEndpoint('http://127.0.0.1:8899/v1/content')).toEqual({
      configuredUrl: 'http://127.0.0.1:8899/v1/content',
      browserUrl: 'http://127.0.0.1:8899/v1/content',
      transportMode: 'direct'
    })
  })

  it('describes proxied backend endpoints with a browser url', () => {
    expect(
      describeBackendEndpoint('/api/v1/pricing', {
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

  it('resolves the browser origin from location-like objects', () => {
    expect(
      resolveBrowserOrigin({
        protocol: 'http:',
        hostname: '127.0.0.1',
        port: '4173'
      })
    ).toBe('http://127.0.0.1:4173')
  })

  it('resolves a safe pathname without host or query string', () => {
    expect(resolveBackendPathname('https://api.example.com/v1/health?token=secret')).toBe('/v1/health')
    expect(resolveBackendPathname('/api/v1/pricing?currency=ARS')).toBe('/api/v1/pricing')
  })
})
