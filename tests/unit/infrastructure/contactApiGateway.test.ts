import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { ContactSubmitPayload } from '@/application/dto/contact'
import type { ConfigPort } from '@/application/ports/Config'
import type { HttpClient } from '@/application/ports/HttpClient'
import type { LoggerPort } from '@/application/ports/Logger'
import type { StoragePort } from '@/application/ports/Storage'
import { ContactApiGateway } from '@/infrastructure/contact/contactApiGateway'

function createPayload(overrides: Partial<ContactSubmitPayload> = {}): ContactSubmitPayload {
  return {
    name: 'juan',
    email: 'juan@example.com',
    phone: '+54 11 5555 4444',
    company: 'Acme',
    firstName: 'Juan',
    lastName: 'Perez',
    geographicLocation: 'Escobar',
    comment: 'Necesito una propuesta para mantenimiento electrico.',
    pageLocation: 'https://www.datamaq.com.ar/contacto',
    trafficSource: 'organic',
    userAgent: 'Vitest',
    createdAt: '2026-02-14T10:00:00.000Z',
    ...overrides
  }
}

function createConfig(inquiryApiUrl: string | undefined): ConfigPort {
  return {
    inquiryApiUrl,
    mailApiUrl: undefined
  } as ConfigPort
}

function createStorage(): StoragePort {
  const values = new Map<string, string>()
  return {
    get(key: string): string | null {
      return values.get(key) ?? null
    },
    set(key: string, value: string): void {
      values.set(key, value)
    },
    remove(key: string): void {
      values.delete(key)
    }
  }
}

function createLogger(): LoggerPort {
  return {
    debug: vi.fn(),
    warn: vi.fn(),
    error: vi.fn()
  }
}

function createHttpClient(): HttpClient {
  return {
    get: vi.fn().mockResolvedValue({ ok: true, status: 200, data: {} }),
    postJson: vi.fn().mockResolvedValue({ ok: true, status: 200, data: {} }),
    patchJson: vi.fn().mockResolvedValue({ ok: true, status: 200 }),
    options: vi.fn().mockResolvedValue({ ok: true, status: 200 })
  }
}

describe('ContactApiGateway', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('returns unavailable when contact API URL is not configured', async () => {
    const http = createHttpClient()
    const logger = createLogger()
    const gateway = new ContactApiGateway(http, createConfig(undefined), createStorage(), logger)

    const result = await gateway.submit(createPayload())

    expect(result).toEqual({ ok: false, error: { type: 'Unavailable' } })
    expect(logger.error).toHaveBeenCalledWith('INQUIRY_API_URL no es valida para backend-only', {
      reason: 'missing',
      pathname: null,
      transportMode: null
    })
    expect(http.postJson).not.toHaveBeenCalled()
  })

  it('routes backend endpoint with backend payload', async () => {
    const http = createHttpClient()
    const logger = createLogger()
    const gateway = new ContactApiGateway(
      http,
      createConfig('https://api.example.com/contact'),
      createStorage(),
      logger
    )

    const result = await gateway.submit(createPayload())

    expect(result).toEqual({ ok: true, data: {} })
    expect(http.postJson).toHaveBeenCalledTimes(1)
    expect(http.postJson).toHaveBeenCalledWith(
      'https://api.example.com/contact',
      expect.objectContaining({
        name: 'juan',
        email: 'juan@example.com',
        message: 'Necesito una propuesta para mantenimiento electrico.',
        custom_attributes: expect.objectContaining({
          first_name: 'Juan',
          last_name: 'Perez',
          company: 'Acme',
          phone: '+54 11 5555 4444',
          geographic_location: 'Escobar',
          comment: 'Necesito una propuesta para mantenimiento electrico.',
          message: 'Necesito una propuesta para mantenimiento electrico.'
        }),
        meta: expect.objectContaining({
          page_location: 'https://www.datamaq.com.ar/contacto'
        })
      }),
      undefined
    )
    expect(http.patchJson).not.toHaveBeenCalled()
  })

  it('maps status 0 to network error', async () => {
    const http = createHttpClient()
    vi.mocked(http.postJson).mockResolvedValueOnce({ ok: false, status: 0 })
    const logger = createLogger()
    const gateway = new ContactApiGateway(
      http,
      createConfig('https://api.example.com/contact'),
      createStorage(),
      logger
    )

    const result = await gateway.submit(createPayload())

    expect(result).toEqual({
      ok: false,
      error: {
        type: 'NetworkError'
      }
    })
    expect(logger.warn).toHaveBeenCalledWith('[contactApiGateway] response no OK', {
      pathname: '/contact',
      transportMode: 'direct',
      status: 0,
      requestId: null,
      errorCode: null,
      backendMessage: null
    })
  })

  it('maps non-zero status to backend error', async () => {
    const http = createHttpClient()
    vi.mocked(http.postJson).mockResolvedValueOnce({ ok: false, status: 503 })
    const logger = createLogger()
    const gateway = new ContactApiGateway(
      http,
      createConfig('https://api.example.com/contact'),
      createStorage(),
      logger
    )

    const result = await gateway.submit(createPayload())

    expect(result).toEqual({
      ok: false,
      error: {
        type: 'BackendError',
        status: 503
      }
    })
    expect(logger.warn).toHaveBeenCalledWith('[contactApiGateway] response no OK', {
      pathname: '/contact',
      transportMode: 'direct',
      status: 503,
      requestId: null,
      errorCode: null,
      backendMessage: null
    })
  })

  it('blocks Chatwoot Public API URL and returns unavailable', async () => {
    const http = createHttpClient()

    const logger = createLogger()
    const gateway = new ContactApiGateway(
      http,
      createConfig('https://chatwoot.example.com/public/api/v1/inboxes/inbox_1/contacts'),
      createStorage(),
      logger
    )

    const result = await gateway.submit(createPayload())

    expect(result).toEqual({ ok: false, error: { type: 'Unavailable' } })
    expect(logger.error).toHaveBeenCalledWith('INQUIRY_API_URL no es valida para backend-only', {
      reason: 'chatwoot-public-api-disallowed',
      pathname: '/public/api/v1/inboxes/inbox_1/contacts',
      transportMode: 'direct'
    })
    expect(http.postJson).not.toHaveBeenCalled()
  })

  it('routes mail channel through MAIL_API_URL', async () => {
    const http = createHttpClient()
    const logger = createLogger()
    const gateway = new ContactApiGateway(
      http,
      {
        ...createConfig('https://api.example.com/contact'),
        mailApiUrl: 'https://api.example.com/mail'
      } as ConfigPort,
      createStorage(),
      logger,
      'mail'
    )

    const result = await gateway.submit(createPayload())

    expect(result).toEqual({ ok: true, data: {} })
    expect(http.postJson).toHaveBeenCalledWith(
      'https://api.example.com/mail',
      expect.any(Object),
      undefined
    )
  })

  it('extracts request_id from success body and returns it to the UI flow', async () => {
    const http = createHttpClient()
    vi.mocked(http.postJson).mockResolvedValueOnce({
      ok: true,
      status: 202,
      data: { request_id: 'req_body_123' }
    })
    const logger = createLogger()
    const gateway = new ContactApiGateway(
      http,
      createConfig('https://api.example.com/contact'),
      createStorage(),
      logger
    )

    const result = await gateway.submit(createPayload())

    expect(result).toEqual({
      ok: true,
      data: { requestId: 'req_body_123' }
    })
  })

  it('maps request_id and error_code from backend error response', async () => {
    const http = createHttpClient()
    vi.mocked(http.postJson).mockResolvedValueOnce({
      ok: false,
      status: 429,
      data: {
        request_id: 'req_err_429',
        error_code: 'RATE_LIMITED',
        detail: 'Too many requests'
      },
      headers: {
        'x-request-id': 'req_hdr_429'
      }
    })
    const logger = createLogger()
    const gateway = new ContactApiGateway(
      http,
      createConfig('https://api.example.com/contact'),
      createStorage(),
      logger
    )

    const result = await gateway.submit(createPayload())

    expect(result).toEqual({
      ok: false,
      error: {
        type: 'BackendError',
        status: 429,
        requestId: 'req_hdr_429',
        errorCode: 'RATE_LIMITED',
        backendMessage: 'Too many requests'
      }
    })
    expect(logger.warn).toHaveBeenCalledWith('[contactApiGateway] response no OK', {
      pathname: '/contact',
      transportMode: 'direct',
      status: 429,
      requestId: 'req_hdr_429',
      errorCode: 'RATE_LIMITED',
      backendMessage: 'Too many requests'
    })
  })

  it('logs proxied endpoint context without host for relative contact endpoints', async () => {
    vi.stubGlobal('location', {
      protocol: 'http:',
      hostname: 'localhost',
      port: '5173'
    })
    const http = createHttpClient()
    vi.mocked(http.postJson).mockResolvedValueOnce({ ok: false, status: 503 })
    const logger = createLogger()
    const gateway = new ContactApiGateway(http, createConfig('/api/v1/contact'), createStorage(), logger)

    const result = await gateway.submit(createPayload())

    expect(result).toEqual({
      ok: false,
      error: {
        type: 'BackendError',
        status: 503
      }
    })
    expect(logger.warn).toHaveBeenCalledWith('[contactApiGateway] response no OK', {
      pathname: '/api/v1/contact',
      transportMode: 'proxy',
      status: 503,
      requestId: null,
      errorCode: null,
      backendMessage: null
    })
  })
})
