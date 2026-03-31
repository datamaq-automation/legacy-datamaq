import { afterEach, describe, expect, it, vi } from 'vitest'
import type { ConfigPort } from '@/application/ports/Config'
import type { RuntimeFlags } from '@/application/ports/Environment'
import type { HttpClient } from '@/application/ports/HttpClient'
import type { LoggerPort } from '@/application/ports/Logger'

import { ContactBackendMonitor } from '@/application/contact/contactBackendStatus'

function createHttpClient(status = 204): HttpClient {
  return {
    get: vi.fn(),
    postJson: vi.fn(),
    patchJson: vi.fn(),
    options: vi.fn().mockResolvedValue({ ok: status >= 200 && status < 300, status })
  }
}

function createConfig(inquiryApiUrl?: string, healthApiUrl?: string): ConfigPort {
  return {
    inquiryApiUrl,
    healthApiUrl,
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
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
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

  it('uses GET probe when health endpoint is /healthz', async () => {
    const http = createHttpClient(200)
    http.get = vi.fn().mockResolvedValue({ ok: true, status: 200 })
    const monitor = new ContactBackendMonitor(
      http,
      createConfig('https://api.example.com/contact', 'https://n8n.datamaq.com.ar/healthz'),
      createRuntime(true),
      createLogger()
    )

    const status = await monitor.ensureStatus()

    expect(status).toBe('available')
    expect(http.get).toHaveBeenCalledTimes(1)
    expect(http.get).toHaveBeenCalledWith('https://n8n.datamaq.com.ar/healthz')
    expect(http.options).not.toHaveBeenCalled()
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
