import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { LoggerPort } from '@/application/ports/Logger'
import type { HttpClient, HttpResponse } from '@/application/ports/HttpClient'
import { DynamicContentService } from '@/infrastructure/content/dynamicContentService'

describe('DynamicContentService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it.skip('successfully fetches and applies remote site snapshot', async () => {
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
        content: {
          hero: {
            title: 'Titulo remoto'
          }
        }
      }
    })
    const applySnapshot = vi.fn().mockReturnValue(true)
    const onReady = vi.fn()

    const service = new DynamicContentService(
      http,
      'http://127.0.0.1:8000/v1/site',
      logger,
      applySnapshot,
      onReady
    )

    service.bootstrap()
    await flushAsyncWork()

    expect(applySnapshot).toHaveBeenCalledWith({
      hero: { title: 'Titulo remoto' }
    })
    expect(onReady).toHaveBeenCalled()
  })

  it.skip('calls onUnavailable when snapshot application fails', async () => {
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
        content: {
          hero: {
            title: 'Titulo parcial remoto'
          }
        }
      }
    })
    const applySnapshot = vi.fn().mockReturnValue(false)
    const onUnavailable = vi.fn()

    const service = new DynamicContentService(
      http,
      'http://127.0.0.1:8000/v1/site',
      logger,
      applySnapshot,
      vi.fn(),
      onUnavailable
    )

    service.bootstrap()
    await flushAsyncWork()

    expect(applySnapshot).toHaveBeenCalled()
    expect(onUnavailable).toHaveBeenCalled()
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
