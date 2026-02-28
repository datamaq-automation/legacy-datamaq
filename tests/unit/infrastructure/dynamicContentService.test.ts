import { afterEach, describe, expect, it, vi } from 'vitest'
import type { LoggerPort } from '@/application/ports/Logger'
import type { HttpClient, HttpResponse } from '@/application/ports/HttpClient'
import { DynamicContentService } from '@/infrastructure/content/dynamicContentService'

describe('DynamicContentService', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('logs backend content connectivity details when a full snapshot is applied', async () => {
    const logger = createLoggerSpy()
    const http = createHttpClientMock({
      ok: true,
      status: 200,
      data: {
        status: 'ok',
        request_id: 'req-content-123',
        brand_id: 'datamaq',
        version: 'v2',
        content_revision: 'abcd1234',
        data: {
          hero: {
            title: 'Titulo remoto'
          }
        }
      }
    })
    const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => undefined)

    const service = new DynamicContentService(
      http,
      'http://127.0.0.1:8899/v1/content',
      logger,
      vi.fn().mockReturnValue(true),
      vi.fn()
    )

    service.bootstrap()
    await flushAsyncWork()

    expect(infoSpy).toHaveBeenCalledWith('[backend:content] conexion OK', {
      resource: 'content',
      endpoint: 'http://127.0.0.1:8899/v1/content',
      pathname: '/v1/content',
      transportMode: 'direct',
      status: 200,
      backendStatus: 'ok',
      requestId: 'req-content-123',
      version: 'v2',
      brandId: 'datamaq',
      timestamp: null,
      details: {
        appliedMode: 'full-snapshot',
        contentRevision: 'abcd1234'
      }
    })
  })

  it('logs backend content connectivity details when only hero title is applied', async () => {
    const logger = createLoggerSpy()
    const http = createHttpClientMock({
      ok: true,
      status: 200,
      data: {
        status: 'ok',
        request_id: 'req-content-hero',
        brand_id: 'datamaq',
        version: 'v2',
        content_revision: 'rev-hero',
        hero: {
          title: 'Titulo parcial remoto'
        }
      }
    })
    const applyHeroTitle = vi.fn()
    const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => undefined)

    const service = new DynamicContentService(
      http,
      'http://127.0.0.1:8899/v1/content',
      logger,
      vi.fn().mockReturnValue(false),
      applyHeroTitle
    )

    service.bootstrap()
    await flushAsyncWork()

    expect(applyHeroTitle).toHaveBeenCalledWith('Titulo parcial remoto')
    expect(infoSpy).toHaveBeenCalledWith('[backend:content] conexion OK', {
      resource: 'content',
      endpoint: 'http://127.0.0.1:8899/v1/content',
      pathname: '/v1/content',
      transportMode: 'direct',
      status: 200,
      backendStatus: 'ok',
      requestId: 'req-content-hero',
      version: 'v2',
      brandId: 'datamaq',
      timestamp: null,
      details: {
        appliedMode: 'hero-title',
        contentRevision: 'rev-hero'
      }
    })
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

function createHttpClientMock(response: HttpResponse): HttpClient {
  return {
    get: vi.fn().mockResolvedValue(response),
    postJson: vi.fn(),
    patchJson: vi.fn(),
    options: vi.fn()
  }
}

async function flushAsyncWork(): Promise<void> {
  await Promise.resolve()
  await Promise.resolve()
  await new Promise((resolve) => setTimeout(resolve, 0))
}
