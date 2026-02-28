import { afterEach, describe, expect, it, vi } from 'vitest'
import type { LoggerPort } from '@/application/ports/Logger'
import type { HttpClient, HttpResponse } from '@/application/ports/HttpClient'
import { DynamicPricingService } from '@/infrastructure/content/dynamicPricingService'

describe('DynamicPricingService', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('logs backend pricing connectivity details when pricing snapshot is applied', async () => {
    const logger = createLoggerSpy()
    const http = createHttpClientMock({
      ok: true,
      status: 200,
      data: {
        status: 'ok',
        request_id: 'req-pricing-123',
        version: 'v1',
        currency: 'ARS',
        data: {
          diagnostico_lista_2h_ars: 275000
        }
      }
    })
    const applySnapshot = vi.fn()
    const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => undefined)

    const service = new DynamicPricingService(
      http,
      'http://127.0.0.1:8899/v1/pricing',
      logger,
      applySnapshot
    )

    service.bootstrap()
    await flushAsyncWork()

    expect(applySnapshot).toHaveBeenCalledWith({
      visitaDiagnosticoHasta2hARS: 275000
    })
    expect(infoSpy).toHaveBeenCalledWith('[backend:pricing] conexion OK', {
      endpoint: 'http://127.0.0.1:8899/v1/pricing',
      status: 200,
      requestId: 'req-pricing-123',
      version: 'v1',
      currency: 'ARS',
      backendStatus: 'ok',
      pricingSnapshot: {
        visitaDiagnosticoHasta2hARS: 275000
      }
    })
  })

  it('prints payload diagnostics once when pricing response has no recognized keys', async () => {
    const logger = createLoggerSpy()
    const http = createHttpClientMock({
      ok: true,
      status: 200,
      data: {
        status: 'ok',
        data: {
          foo: 'bar'
        }
      }
    })
    const debugSpy = vi.spyOn(console, 'debug').mockImplementation(() => undefined)

    const service = new DynamicPricingService(
      http,
      'http://127.0.0.1:8899/v1/pricing',
      logger,
      vi.fn()
    )

    service.bootstrap()
    await flushAsyncWork()

    expect(debugSpy).toHaveBeenCalledWith('[backend:pricing] payload sin claves reconocibles', {
      endpoint: 'http://127.0.0.1:8899/v1/pricing',
      payloadPreview: '{"status":"ok","data":{"foo":"bar"}}',
      scalarKeys: ['datafoo', 'foo', 'status']
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
