import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { ContactSubmitPayload } from '@/application/dto/contact'
import type { ConfigPort } from '@/application/ports/Config'
import type { HttpClient } from '@/application/ports/HttpClient'
import type { LoggerPort } from '@/application/ports/Logger'
import type { StoragePort } from '@/application/ports/Storage'
import { ContactApiGateway } from '@/infrastructure/contact/contactApiGateway'

function createPayload(overrides: Partial<ContactSubmitPayload> = {}): ContactSubmitPayload {
  return {
    firstName: 'Juan',
    lastName: 'Perez',
    name: 'Juan Perez',
    email: 'juan@example.com',
    phoneNumber: '11 2345 6789',
    city: 'Escobar',
    country: 'AR',
    company: 'DataMaq',
    pageLocation: 'https://www.datamaq.com.ar/contacto',
    trafficSource: 'organic',
    userAgent: 'Vitest',
    createdAt: '2026-02-14T10:00:00.000Z',
    ...overrides
  }
}

function createConfig(contactApiUrl: string | undefined, originVerifySecret?: string): ConfigPort {
  return {
    contactApiUrl,
    originVerifySecret
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
    postJson: vi.fn().mockResolvedValue({ ok: true, status: 200, data: {} }),
    patchJson: vi.fn().mockResolvedValue({ ok: true, status: 200 }),
    options: vi.fn().mockResolvedValue({ ok: true, status: 200 })
  }
}

describe('ContactApiGateway', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns unavailable when contact API URL is not configured', async () => {
    const http = createHttpClient()
    const logger = createLogger()
    const gateway = new ContactApiGateway(http, createConfig(undefined), createStorage(), logger)

    const result = await gateway.submit(createPayload())

    expect(result).toEqual({ ok: false, error: { type: 'Unavailable' } })
    expect(logger.error).toHaveBeenCalledWith('CONTACT_API_URL no esta configurada')
    expect(http.postJson).not.toHaveBeenCalled()
  })

  it('routes backend endpoint with backend payload and origin header', async () => {
    const http = createHttpClient()
    const logger = createLogger()
    const gateway = new ContactApiGateway(
      http,
      createConfig('https://api.example.com/contact', 'secret-token'),
      createStorage(),
      logger
    )

    const result = await gateway.submit(createPayload())

    expect(result).toEqual({ ok: true, data: undefined })
    expect(http.postJson).toHaveBeenCalledTimes(1)
    expect(http.postJson).toHaveBeenCalledWith(
      'https://api.example.com/contact',
      expect.objectContaining({
        firstName: 'Juan',
        lastName: 'Perez',
        name: 'Juan Perez',
        email: 'juan@example.com',
        phoneNumber: '11 2345 6789',
        custom_attributes: expect.objectContaining({
          first_name: 'Juan',
          last_name: 'Perez'
        }),
        meta: expect.objectContaining({
          page_location: 'https://www.datamaq.com.ar/contacto'
        })
      }),
      { 'X-Origin-Verify': 'secret-token' }
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

    expect(result).toEqual({ ok: false, error: { type: 'NetworkError' } })
    expect(logger.warn).toHaveBeenCalledWith('[contactApiGateway] response no OK', { status: 0 })
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

    expect(result).toEqual({ ok: false, error: { type: 'BackendError', status: 503 } })
    expect(logger.warn).toHaveBeenCalledWith('[contactApiGateway] response no OK', { status: 503 })
  })
})
