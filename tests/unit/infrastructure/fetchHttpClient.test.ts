import { afterEach, describe, expect, it, vi } from 'vitest'
import type { LoggerPort } from '@/application/ports/Logger'
import { FetchHttpClient } from '@/infrastructure/http/fetchHttpClient'

describe('FetchHttpClient', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('sends POST JSON requests and returns parsed payload/headers', async () => {
    const logger = createLoggerSpy()
    const client = new FetchHttpClient(logger)
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ ok: true, id: 'abc' }), {
        status: 200,
        headers: {
          'X-Request-Id': 'req-123'
        }
      })
    )

    const response = await client.postJson<{ ok: boolean; id: string }>(
      'https://api.example.com/contact',
      { foo: 'bar' },
      { 'X-Custom': '1' }
    )

    expect(fetchSpy).toHaveBeenCalledWith(
      'https://api.example.com/contact',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'X-Custom': '1'
        }),
        credentials: 'omit',
        body: JSON.stringify({ foo: 'bar' })
      })
    )
    expect(response.ok).toBe(true)
    expect(response.status).toBe(200)
    expect(response.data).toEqual({ ok: true, id: 'abc' })
    expect(response.headers).toEqual(
      expect.objectContaining({
        'x-request-id': 'req-123'
      })
    )
    expect(logger.debug).toHaveBeenCalled()
  })

  it('normalizes backend JSON errors on POST non-ok responses', async () => {
    const logger = createLoggerSpy()
    const client = new FetchHttpClient(logger)
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ error: 'bad-request' }), {
        status: 400
      })
    )

    const response = await client.postJson('https://api.example.com/contact', { test: true })

    expect(response.ok).toBe(false)
    expect(response.status).toBe(400)
    expect(response.text).toBe('bad-request')
    expect(logger.warn).toHaveBeenCalled()
  })

  it('falls back to raw text when PATCH response is not JSON', async () => {
    const logger = createLoggerSpy()
    const client = new FetchHttpClient(logger)
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('plain-error-text', {
        status: 500
      })
    )

    const response = await client.patchJson('https://api.example.com/contact/1', { status: 'x' })

    expect(response.ok).toBe(false)
    expect(response.status).toBe(500)
    expect(response.text).toBe('plain-error-text')
    expect(response.data).toBeUndefined()
    expect(logger.warn).toHaveBeenCalled()
  })

  it('returns status 0 and logs when POST throws', async () => {
    const logger = createLoggerSpy()
    const client = new FetchHttpClient(logger)
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('network down'))

    const response = await client.postJson('https://api.example.com/contact', { test: true })

    expect(response).toEqual({ ok: false, status: 0 })
    expect(logger.error).toHaveBeenCalled()
  })

  it('returns headers on OPTIONS success and safe fallback on OPTIONS failure', async () => {
    const logger = createLoggerSpy()
    const client = new FetchHttpClient(logger)
    const fetchSpy = vi.spyOn(globalThis, 'fetch')
    fetchSpy
      .mockResolvedValueOnce(
        new Response(null, {
          status: 204,
          headers: {
            Allow: 'OPTIONS, POST'
          }
        })
      )
      .mockRejectedValueOnce(new Error('timeout'))

    const okResponse = await client.options('https://api.example.com/contact')
    const errorResponse = await client.options('https://api.example.com/contact')

    expect(okResponse).toEqual({
      ok: true,
      status: 204,
      headers: { allow: 'OPTIONS, POST' }
    })
    expect(errorResponse).toEqual({
      ok: false,
      status: 0
    })
    expect(logger.warn).toHaveBeenCalled()
  })

  it('includes credentials for relative URLs (same-origin/proxy mode)', async () => {
    const logger = createLoggerSpy()
    const client = new FetchHttpClient(logger)
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), { status: 200 })
    )

    await client.postJson('/api/v1/contact', { foo: 'bar' })

    expect(fetchSpy).toHaveBeenCalledWith(
      '/api/v1/contact',
      expect.objectContaining({
        credentials: 'include'
      })
    )
  })
})

function createLoggerSpy(): LoggerPort & {
  debug: ReturnType<typeof vi.fn>
  warn: ReturnType<typeof vi.fn>
  error: ReturnType<typeof vi.fn>
} {
  return {
    debug: vi.fn(),
    warn: vi.fn(),
    error: vi.fn()
  }
}
