import { describe, expect, it, vi } from 'vitest'
import { ContactBackendMonitor } from '@/application/contact/contactBackendStatus'
import type { ConfigPort } from '@/application/ports/Config'
import type { RuntimeFlags } from '@/application/ports/Environment'
import type { HttpClient } from '@/application/ports/HttpClient'
import type { LoggerPort } from '@/application/ports/Logger'

function createHttpClient(status = 204): HttpClient {
  return {
    postJson: vi.fn(),
    patchJson: vi.fn(),
    options: vi.fn().mockResolvedValue({ ok: status >= 200 && status < 300, status })
  }
}

function createConfig(inquiryApiUrl?: string, mailApiUrl?: string): ConfigPort {
  return {
    inquiryApiUrl,
    mailApiUrl,
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

  it('deduplicates equivalent 404 warnings across contact and mail channels sharing origin', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    const http = createHttpClient(404)
    const config = createConfig('https://api-dedupe.example.com/v1/contact', 'https://api-dedupe.example.com/v1/mail')
    const runtime = createRuntime(true)
    const logger = createLogger()
    const contactMonitor = new ContactBackendMonitor(http, config, runtime, logger)
    const mailMonitor = new ContactBackendMonitor(
      http,
      config,
      runtime,
      logger,
      (cfg) => cfg.mailApiUrl,
      'mailBackendStatus'
    )

    await contactMonitor.ensureStatus()
    await mailMonitor.ensureStatus()

    const endpointNotFoundWarnings = warnSpy.mock.calls.filter(([, payload]) => {
      const candidate = payload as { reason?: string } | undefined
      return candidate?.reason === 'endpoint-not-found'
    })

    expect(endpointNotFoundWarnings).toHaveLength(1)
  })
})
