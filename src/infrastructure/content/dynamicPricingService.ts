import type { LoggerPort } from '@/application/ports/Logger'
import type { HttpClient } from '@/application/ports/HttpClient'
import { buildRuntimeLogArgs, emitRuntimeWarn } from '@/application/utils/runtimeConsole'
import type { CommercialPricingSnapshot } from '@/infrastructure/content/contentStore'
import {
  buildBackendEndpointContext,
  emitBackendInfo,
  extractBackendResponseMetadata,
  isRecord
} from '@/infrastructure/backend/backendDiagnostics'
import { resolveBackendPathname } from '@/infrastructure/backend/backendEndpoint'

const pricingConsoleWarnCache = new Set<string>()
const pricingConsoleDebugCache = new Set<string>()
const isDevRuntime = Boolean(import.meta.env?.DEV)
const CANONICAL_DIAGNOSTIC_PRICE_KEY = 'diagnostico_lista_2h_ars'

export class DynamicPricingService {
  private dynamicPricingFetchStarted = false

  constructor(
    private http: HttpClient,
    private pricingApiUrl: string | undefined,
    private logger: LoggerPort,
    private applySnapshot: (snapshot: CommercialPricingSnapshot) => void
  ) {}

  bootstrap(): void {
    if (this.dynamicPricingFetchStarted) {
      return
    }
    this.dynamicPricingFetchStarted = true

    if (typeof window === 'undefined') {
      return
    }

    const pricingApiUrl = normalizeUrl(this.pricingApiUrl)
    if (!pricingApiUrl) {
      this.logger.warn('[content] pricingApiUrl no configurada; se mantiene fallback "Consultar al WhatsApp".')
      return
    }

    void this.syncDynamicPricing(pricingApiUrl)
  }

  private async syncDynamicPricing(pricingApiUrl: string): Promise<void> {
    try {
      const response = await this.http.get(pricingApiUrl, {
        headers: {
          Accept: 'application/json, text/plain;q=0.9, */*;q=0.8'
        },
        timeoutMs: 8_000,
        retries: 1
      })

      if (!response.ok) {
        this.logger.warn('[content] fallo al consultar precios dinamicos', {
          pricingApiUrl,
          status: response.status
        })
        logPricingWarnOnce({
          endpoint: pricingApiUrl,
          status: response.status,
          reason: response.status === 0 ? 'network-error' : 'http-error'
        })
        return
      }

      const payload = readPricingPayload(response)
      const pricingSnapshot = extractCommercialPricingSnapshot(payload)
      if (!pricingSnapshot) {
        this.logger.warn('[content] payload de precios sin campos reconocibles; se mantiene fallback.', {
          pricingApiUrl,
          payloadPreview: getPayloadPreview(payload)
        })
        logPricingPayloadDebugOnce(pricingApiUrl, payload)
        logPricingWarnOnce({ endpoint: pricingApiUrl, reason: 'unusable-payload' })
        return
      }

      this.applySnapshot(pricingSnapshot)
      logPricingInfo(pricingApiUrl, response.status, payload, pricingSnapshot)
      this.logger.debug('[content] precios dinamicos aplicados', pricingSnapshot)
    } catch (error) {
      this.logger.warn('[content] error consultando precios dinamicos; se mantiene fallback.', {
        pricingApiUrl,
        error
      })
      logPricingWarnOnce({
        endpoint: pricingApiUrl,
        reason: 'network-error'
      })
    }
  }
}

function readPricingPayload(response: { data?: unknown; text?: string }): unknown {
  const rawText = typeof response.text === 'string' ? response.text : ''
  const normalizedText = rawText.trim()
  if (typeof response.data !== 'undefined') {
    return response.data
  }
  return normalizedText || undefined
}

function extractCommercialPricingSnapshot(payload: unknown): CommercialPricingSnapshot | undefined {
  const root = asRecord(payload)
  const data = asRecord(root?.['data'])
  const diagnosticPrice = parseAmount(data?.[CANONICAL_DIAGNOSTIC_PRICE_KEY])
  if (typeof diagnosticPrice !== 'number') {
    return undefined
  }

  const snapshot: CommercialPricingSnapshot = {
    visitaDiagnosticoHasta2hARS: diagnosticPrice
  }

  return snapshot
}

function parseAmount(value: unknown): number | null {
  if (typeof value === 'number') {
    if (!Number.isFinite(value) || value < 0) {
      return null
    }
    return Math.round(value)
  }

  return null
}

function normalizeUrl(url: string | undefined): string | undefined {
  const trimmed = url?.trim()
  return trimmed ? trimmed : undefined
}

function logPricingInfo(
  endpoint: string,
  status: number,
  payload: unknown,
  pricingSnapshot: CommercialPricingSnapshot
): void {
  const metadata = extractBackendResponseMetadata(payload)
  emitBackendInfo({
    resource: 'pricing',
    endpoint,
    status,
    payload,
    metadata,
    details: {
      currency: metadata.currency ?? null,
      pricingSnapshot
    }
  })
}

function logPricingWarnOnce(payload: { endpoint: string; status?: number; reason?: string }): void {
  const dedupeKey = `${payload.endpoint}|${payload.status ?? 'na'}|${payload.reason ?? 'na'}`
  if (pricingConsoleWarnCache.has(dedupeKey)) {
    return
  }
  pricingConsoleWarnCache.add(dedupeKey)

  const endpointContext = buildBackendEndpointContext(payload.endpoint)
  const consolePayload = {
    pathname: resolveBackendPathname(payload.endpoint),
    status: payload.status,
    reason: payload.reason ?? 'unknown',
    transportMode: endpointContext.transportMode
  }

  if (payload.reason === 'unusable-payload') {
    emitRuntimeWarn('[backend:pricing] conexion sin datos utilizables', consolePayload)
    return
  }
  emitRuntimeWarn('[backend:pricing] sin conexion', consolePayload)
}

function logPricingPayloadDebugOnce(endpoint: string, payload: unknown): void {
  if (!isDevRuntime) {
    return
  }

  const dedupeKey = `payload|${endpoint}`
  if (pricingConsoleDebugCache.has(dedupeKey)) {
    return
  }
  pricingConsoleDebugCache.add(dedupeKey)

  const endpointContext = buildBackendEndpointContext(endpoint)
  console.debug(
    ...buildRuntimeLogArgs('[backend:pricing] payload sin claves reconocibles', {
      endpoint: endpointContext.browserUrl,
      pathname: resolveBackendPathname(endpoint),
      transportMode: endpointContext.transportMode,
      payloadPreview: getPayloadPreview(payload),
      expectedKey: CANONICAL_DIAGNOSTIC_PRICE_KEY
    })
  )
}

function getPayloadPreview(payload: unknown): string {
  if (payload === undefined) {
    return 'undefined'
  }
  if (payload === null) {
    return 'null'
  }
  if (typeof payload === 'string') {
    return payload.slice(0, 500)
  }
  try {
    return JSON.stringify(payload).slice(0, 500)
  } catch {
    return '[unserializable]'
  }
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  if (!isRecord(value)) {
    return undefined
  }
  return value
}
