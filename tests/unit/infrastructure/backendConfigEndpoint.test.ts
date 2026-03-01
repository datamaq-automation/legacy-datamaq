import { describe, expect, it, vi } from 'vitest'
import {
  ensureBackendConfigEndpointUrl,
  resolveBackendConfigEndpoint
} from '@/infrastructure/backend/backendConfigEndpoint'

describe('backendConfigEndpoint', () => {
  it('preserves relative canonical endpoints', () => {
    expect(
      resolveBackendConfigEndpoint({
        directUrl: '/api/v1/content',
        configKey: 'contentApiUrl',
        isDev: true
      })
    ).toBe('/api/v1/content')
  })

  it('accepts explicit https endpoints', () => {
    expect(
      resolveBackendConfigEndpoint({
        directUrl: 'https://api.example.com/v1/pricing',
        configKey: 'pricingApiUrl',
        isDev: false
      })
    ).toBe('https://api.example.com/v1/pricing')
  })

  it('returns undefined when direct endpoint is missing', () => {
    expect(
      resolveBackendConfigEndpoint({
        directUrl: undefined,
        configKey: 'inquiryApiUrl',
        isDev: false
      })
    ).toBeUndefined()
  })

  it('rejects insecure non-loopback endpoints in production-like modes', () => {
    const warn = vi.fn()

    expect(
      ensureBackendConfigEndpointUrl({
        value: 'http://api.example.com/v1/content',
        configKey: 'contentApiUrl',
        isDev: false,
        warn
      })
    ).toBeUndefined()
    expect(warn).toHaveBeenCalledWith(
      '[config] El campo contentApiUrl debe comenzar con "https://" en produccion. Valor recibido: http://api.example.com/v1/content'
    )
  })
})
