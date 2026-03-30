import { describe, expect, it, vi } from 'vitest'
import {
  ensureBackendConfigEndpointUrl,
  resolveBackendConfigEndpoint,
  resolveBackendEndpointPolicyMode
} from '@/infrastructure/backend/backendConfigEndpoint'

describe('backendConfigEndpoint', () => {
  it('preserves relative canonical endpoints', () => {
    expect(
      resolveBackendConfigEndpoint({
        directUrl: '/api/v1/contact',
        configKey: 'inquiryApiUrl',
        isDev: true
      })
    ).toBe('/api/v1/contact')
  })

  it('accepts explicit https endpoints', () => {
    expect(
      resolveBackendConfigEndpoint({
        directUrl: 'https://api.example.com/v1/health',
        configKey: 'healthApiUrl',
        isDev: false
      })
    ).toBe('https://api.example.com/v1/health')
  })

  it('preserves loopback http endpoints when policy mode is local-preview', () => {
    expect(
      resolveBackendConfigEndpoint({
        directUrl: 'http://127.0.0.1:8899/v1/health',
        configKey: 'healthApiUrl',
        isDev: false,
        policyMode: 'local-preview'
      })
    ).toBe('http://127.0.0.1:8899/v1/health')
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
        value: 'http://api.example.com/v1/health',
        configKey: 'healthApiUrl',
        isDev: false,
        warn
      })
    ).toBeUndefined()
    expect(warn).toHaveBeenCalledWith(
      '[config] El campo healthApiUrl debe comenzar con "https://" en produccion. Valor recibido: http://api.example.com/v1/health'
    )
  })

  it('accepts loopback http endpoints in local-preview mode', () => {
    expect(
      ensureBackendConfigEndpointUrl({
        value: 'http://127.0.0.1:8899/v1/health',
        configKey: 'healthApiUrl',
        isDev: false,
        policyMode: 'local-preview'
      })
    ).toBe('http://127.0.0.1:8899/v1/health')

    expect(
      ensureBackendConfigEndpointUrl({
        value: 'http://localhost:8899/v1/health',
        configKey: 'healthApiUrl',
        isDev: false,
        policyMode: 'local-preview'
      })
    ).toBe('http://localhost:8899/v1/health')
  })

  it('rejects arbitrary http hosts in local-preview mode', () => {
    const warn = vi.fn()

    expect(
      ensureBackendConfigEndpointUrl({
        value: 'http://192.168.1.20:8899/v1/health',
        configKey: 'healthApiUrl',
        isDev: false,
        policyMode: 'local-preview',
        warn
      })
    ).toBeUndefined()

    expect(warn).toHaveBeenCalledWith(
      '[config] El campo healthApiUrl debe comenzar con "https://" o apuntar a loopback local ("http://localhost" o "http://127.0.0.1") en local-preview. Valor recibido: http://192.168.1.20:8899/v1/health'
    )
  })

  it('derives production policy by default for non-dev builds', () => {
    expect(
      resolveBackendEndpointPolicyMode({
        isDev: false
      })
    ).toBe('production')
  })

  it('keeps explicit local-preview policy separate from build type', () => {
    expect(
      resolveBackendEndpointPolicyMode({
        isDev: false,
        policyMode: 'local-preview'
      })
    ).toBe('local-preview')
  })
})
