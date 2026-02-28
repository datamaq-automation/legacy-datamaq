import { describe, expect, it, vi } from 'vitest'
import {
  buildBackendEndpointUrl,
  ensureBackendConfigBaseUrl,
  ensureBackendConfigEndpointUrl,
  resolveBackendConfigEndpoint
} from '@/infrastructure/backend/backendConfigEndpoint'

describe('backendConfigEndpoint', () => {
  it('preserves relative canonical endpoints', () => {
    expect(
      resolveBackendConfigEndpoint({
        directUrl: '/api/v1/content',
        baseUrl: 'https://legacy.example.com',
        path: '/v1/public/content',
        configKey: 'contentApiUrl',
        allowInsecureBackend: false,
        isDev: true
      })
    ).toBe('/api/v1/content')
  })

  it('accepts explicit https endpoints', () => {
    expect(
      resolveBackendConfigEndpoint({
        directUrl: 'https://api.example.com/v1/pricing',
        baseUrl: undefined,
        path: '/v1/public/pricing',
        configKey: 'pricingApiUrl',
        allowInsecureBackend: false,
        isDev: false
      })
    ).toBe('https://api.example.com/v1/pricing')
  })

  it('falls back to backendBaseUrl when direct endpoint is missing', () => {
    expect(
      resolveBackendConfigEndpoint({
        directUrl: undefined,
        baseUrl: 'https://legacy.example.com/',
        path: '/v1/contact',
        configKey: 'inquiryApiUrl',
        allowInsecureBackend: false,
        isDev: false
      })
    ).toBe('https://legacy.example.com/v1/contact')
  })

  it('allows loopback http bypass in e2e mode when explicitly enabled', () => {
    const warn = vi.fn()

    expect(
      ensureBackendConfigBaseUrl('http://127.0.0.1:8899', {
        configKey: 'backendBaseUrl',
        allowInsecureBackend: true,
        isDev: false,
        mode: 'e2e',
        warn
      })
    ).toBe('http://127.0.0.1:8899')
    expect(warn).toHaveBeenCalledWith(
      '[config] Se habilito bypass local para backendBaseUrl via runtimeProfile.allowInsecureBackend=true. Valor recibido: http://127.0.0.1:8899'
    )
  })

  it('rejects insecure non-loopback endpoints in production-like modes', () => {
    const warn = vi.fn()

    expect(
      ensureBackendConfigEndpointUrl({
        value: 'http://api.example.com/v1/content',
        configKey: 'contentApiUrl',
        allowInsecureBackend: true,
        isDev: false,
        mode: 'e2e',
        warn
      })
    ).toBeUndefined()
    expect(warn).toHaveBeenCalledWith(
      '[config] El campo contentApiUrl debe comenzar con "https://" en produccion. Valor recibido: http://api.example.com/v1/content'
    )
  })

  it('builds endpoint urls from normalized base paths', () => {
    expect(buildBackendEndpointUrl('https://legacy.example.com/', '/v1/mail')).toBe(
      'https://legacy.example.com/v1/mail'
    )
  })
})
