import { afterEach, describe, expect, it, vi } from 'vitest'
import { ContactBackendMonitor } from '@/application/contact/contactBackendStatus'
import { setDevBackendAvailability } from '@/application/backend/devBackendAvailability'
import type { ConfigPort } from '@/application/ports/Config'
import type { RuntimeFlags } from '@/application/ports/Environment'
import type { HttpClient } from '@/application/ports/HttpClient'
import type { LoggerPort } from '@/application/ports/Logger'

function createHttpClient(status = 204): HttpClient {
  return {
    get: vi.fn(),
    postJson: vi.fn(),
    patchJson: vi.fn(),
    options: vi.fn().mockResolvedValue({ ok: status >= 200 && status < 300, status })
  }
}

function createConfig(inquiryApiUrl?: string): ConfigPort {
  return {
    inquiryApiUrl,
    contactEmail: undefined
  } as ConfigPort
}

function createRuntime(isBrowser = true): RuntimeFlags {
  return {
    isBrowser: () => isBrowser,
    isDev: () => true
  }
}

function createLogger(): LoggerPort {
  return {
    debug: vi.fn(),
    warn: vi.fn(),
    error: vi.fn()
  }
}

describe('ContactBackendMonitor', () => {
  afterEach(() => {
    setDevBackendAvailability({
      reachable: true,
      endpoint: null,
      status: null
    })
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('reuses dev backend snapshot when already marked unavailable', async () => {
    setDevBackendAvailability({
      reachable: false,
      endpoint: '/api/v1/health',
      status: 500
    })
    const http = createHttpClient(204)
    const monitor = new ContactBackendMonitor(
      http,
      createConfig('/api/v1/contact'),
      createRuntime(true),
      createLogger()
    )

    const status = await monitor.ensureStatus()

    expect(status).toBe('unavailable')
    expect(http.options).not.toHaveBeenCalled()
  })

  it('reuses dev backend snapshot when already marked available', async () => {
    setDevBackendAvailability({
      reachable: true,
      endpoint: '/api/v1/health',
      status: 200
    })
    const http = createHttpClient(500)
    const monitor = new ContactBackendMonitor(
      http,
      createConfig('/api/v1/contact'),
      createRuntime(true),
      createLogger()
    )

    const status = await monitor.ensureStatus()

    expect(status).toBe('available')
    expect(http.options).not.toHaveBeenCalled()
  })

  it('uses OPTIONS probe for configured backend endpoint', async () => {
    const http = createHttpClient(204)
    const monitor = new ContactBackendMonitor(
      http,
      createConfig('https://api.example.com/contact'),
      createRuntime(true),
      createLogger()
    )

    const status = await monitor.ensureStatus()

    expect(status).toBe('available')
    expect(http.options).toHaveBeenCalledTimes(1)
    expect(http.options).toHaveBeenCalledWith('https://api.example.com/contact')
  })

  it('marks unavailable for Chatwoot Public contacts endpoint', async () => {
    const http = createHttpClient(404)
    const monitor = new ContactBackendMonitor(
      http,
      createConfig('https://chatwoot.example.com/public/api/v1/inboxes/abc123/contacts'),
      createRuntime(true),
      createLogger()
    )

    const status = await monitor.ensureStatus()

    expect(status).toBe('unavailable')
    expect(http.options).not.toHaveBeenCalled()
  })

  it('marks unavailable when backend endpoint responds 404', async () => {
    const http = createHttpClient(404)
    const monitor = new ContactBackendMonitor(
      http,
      createConfig('https://api.example.com/contact'),
      createRuntime(true),
      createLogger()
    )

    const status = await monitor.ensureStatus()

    expect(status).toBe('unavailable')
    expect(http.options).toHaveBeenCalledTimes(1)
    expect(http.options).toHaveBeenCalledWith('https://api.example.com/contact')
  })

  it('deduplicates equivalent 404 warnings on repeated checks', async () => {
    vi.stubGlobal('location', {
      protocol: 'http:',
      hostname: 'localhost',
      port: '5173'
    })
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    const http = createHttpClient(404)
    const config = createConfig('/api/v1/contact')
    const runtime = createRuntime(true)
    const logger = createLogger()
    const contactMonitor = new ContactBackendMonitor(http, config, runtime, logger)

    await contactMonitor.ensureStatus()
    await contactMonitor.ensureStatus()

    const endpointNotFoundWarnings = warnSpy.mock.calls.filter(([, payload]) => {
      const candidate = payload as { reason?: string } | undefined
      return candidate?.reason === 'endpoint-not-found'
    })

    expect(endpointNotFoundWarnings).toHaveLength(1)
  })

  it('sanitizes warning payloads to pathname and reason', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    const http = createHttpClient(503)
    const monitor = new ContactBackendMonitor(
      http,
      createConfig('https://api.example.com/v1/contact?token=secret'),
      createRuntime(true),
      createLogger()
    )

    await monitor.ensureStatus()

    expect(warnSpy).toHaveBeenCalledWith('[backend:contactBackendStatus] sin conexion', {
      pathname: '/v1/contact',
      transportMode: 'direct',
      status: 503,
      reason: 'http-error'
    })
  })
})
