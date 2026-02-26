import type { LoggerPort } from '@/application/ports/Logger'
import type { CommercialPricingSnapshot, CommercialPriceKey } from '@/infrastructure/content/contentStore'

const pricingConsoleWarnCache = new Set<string>()
const pricingConsoleDebugCache = new Set<string>()
const isDevRuntime = Boolean(import.meta.env?.DEV)

const PRICE_KEY_ALIASES: Record<CommercialPriceKey, string[]> = {
  visitaDiagnosticoHasta2hARS: [
    'diagnostico_lista_2h_ars',
    'visitaDiagnosticoHasta2hARS',
    'visita_diagnostico_hasta2h_ars',
    'visita_diagnostico_hasta_2h_ars',
    'visita_diagnostico_2h_ars',
    'visita_diagnostico_2h',
    'visita_diagnostico_ars'
  ]
}

export class DynamicPricingService {
  private dynamicPricingFetchStarted = false

  constructor(
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
      const response = await fetch(pricingApiUrl, {
        method: 'GET',
        headers: {
          Accept: 'application/json, text/plain;q=0.9, */*;q=0.8'
        },
        cache: 'no-store'
      })

      if (!response.ok) {
        this.logger.warn('[content] fallo al consultar precios dinamicos', {
          pricingApiUrl,
          status: response.status
        })
        logPricingWarnOnce({ endpoint: pricingApiUrl, status: response.status })
        return
      }

      const payload = await readPricingPayload(response)
      const pricingSnapshot = extractCommercialPricingSnapshot(payload)
      if (!pricingSnapshot) {
        this.logger.warn('[content] payload de precios sin campos reconocibles; se mantiene fallback.', {
          pricingApiUrl,
          payloadPreview: getPayloadPreview(payload)
        })
        logPricingPayloadDebugOnce(pricingApiUrl, payload)
        logPricingWarnOnce({ endpoint: pricingApiUrl })
        return
      }

      this.applySnapshot(pricingSnapshot)
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

async function readPricingPayload(response: Response): Promise<unknown> {
  const rawText = await response.text().catch(() => '')
  const normalizedText = rawText.trim()
  if (!normalizedText) {
    return undefined
  }

  try {
    return JSON.parse(normalizedText) as unknown
  } catch {
    return normalizedText
  }
}

function extractCommercialPricingSnapshot(payload: unknown): CommercialPricingSnapshot | undefined {
  const scalarMap = new Map<string, unknown>()

  if (typeof payload === 'string') {
    collectScalarPairsFromText(payload, scalarMap)
  }
  collectScalarPairs(payload, scalarMap)

  const snapshot: CommercialPricingSnapshot = {}
  ;(Object.keys(PRICE_KEY_ALIASES) as CommercialPriceKey[]).forEach((key) => {
    const resolved = resolveAmountByAliases(scalarMap, PRICE_KEY_ALIASES[key])
    if (typeof resolved === 'number') {
      snapshot[key] = resolved
    }
  })

  return Object.keys(snapshot).length > 0 ? snapshot : undefined
}

function collectScalarPairsFromText(rawText: string, target: Map<string, unknown>): void {
  const pairPattern = /([A-Za-z_][A-Za-z0-9_]*)\s*[:=]\s*([0-9][0-9.,\s]*)/g
  let match = pairPattern.exec(rawText)
  while (match) {
    const key = normalizeAliasKey(match[1] ?? '')
    const value = match[2]?.trim()
    if (key && value && !target.has(key)) {
      target.set(key, value)
    }
    match = pairPattern.exec(rawText)
  }
}

function collectScalarPairs(
  value: unknown,
  target: Map<string, unknown>,
  depth: number = 0,
  parentPath: string[] = []
): void {
  if (depth > 6 || value === null || value === undefined) {
    return
  }

  if (Array.isArray(value)) {
    value.forEach((entry, index) => collectScalarPairs(entry, target, depth + 1, [...parentPath, String(index)]))
    return
  }

  if (!isRecord(value)) {
    return
  }

  Object.entries(value).forEach(([key, entry]) => {
    const currentPath = [...parentPath, key]
    if (isRecord(entry) || Array.isArray(entry)) {
      collectScalarPairs(entry, target, depth + 1, currentPath)
      return
    }

    const normalizedKey = normalizeAliasKey(key)
    if (!normalizedKey || target.has(normalizedKey)) {
      // no-op; try path-based key below
    } else {
      target.set(normalizedKey, entry)
    }

    const normalizedPathKey = normalizeAliasKey(currentPath.join('_'))
    if (!normalizedPathKey || target.has(normalizedPathKey)) {
      return
    }
    target.set(normalizedPathKey, entry)
  })
}

function resolveAmountByAliases(source: Map<string, unknown>, aliases: readonly string[]): number | undefined {
  for (const alias of aliases) {
    const normalizedAlias = normalizeAliasKey(alias)
    if (!normalizedAlias) {
      continue
    }

    if (source.has(normalizedAlias)) {
      const parsedAmount = parseAmount(source.get(normalizedAlias))
      if (typeof parsedAmount === 'number') {
        return parsedAmount
      }
    }

    for (const [key, value] of Array.from(source.entries())) {
      if (!key.includes(normalizedAlias)) {
        continue
      }

      const parsedAmount = parseAmount(value)
      if (typeof parsedAmount === 'number') {
        return parsedAmount
      }
    }
  }

  return undefined
}

function parseAmount(value: unknown): number | null {
  if (typeof value === 'number') {
    if (!Number.isFinite(value) || value < 0) {
      return null
    }
    return Math.round(value)
  }

  if (typeof value !== 'string') {
    return null
  }

  const sanitized = value.replace(/[^\d.,-]/g, '').trim()
  if (!sanitized || sanitized.startsWith('-')) {
    return null
  }

  const decimalMatch = sanitized.match(/^(.*)[.,](\d{1,2})$/)
  if (decimalMatch) {
    const integerPart = (decimalMatch[1] ?? '').replace(/[.,]/g, '')
    if (/^\d+$/.test(integerPart)) {
      const parsedInteger = Number.parseInt(integerPart, 10)
      return Number.isFinite(parsedInteger) ? parsedInteger : null
    }
  }

  const integerCandidate = sanitized.replace(/[.,]/g, '')
  if (!/^\d+$/.test(integerCandidate)) {
    return null
  }

  const parsedValue = Number.parseInt(integerCandidate, 10)
  return Number.isFinite(parsedValue) ? parsedValue : null
}

function normalizeUrl(url: string | undefined): string | undefined {
  const trimmed = url?.trim()
  return trimmed ? trimmed : undefined
}

function normalizeAliasKey(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '')
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function logPricingWarnOnce(payload: { endpoint: string; status?: number; reason?: string }): void {
  const dedupeKey = `${payload.endpoint}|${payload.status ?? 'na'}|${payload.reason ?? 'na'}`
  if (pricingConsoleWarnCache.has(dedupeKey)) {
    return
  }
  pricingConsoleWarnCache.add(dedupeKey)

  if (payload.status === undefined && payload.reason === undefined) {
    console.warn('[backend:pricing] conexion sin datos utilizables', payload)
    return
  }
  console.warn('[backend:pricing] sin conexion', payload)
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

function extractDebugScalarKeys(payload: unknown): string[] {
  const scalarMap = new Map<string, unknown>()
  if (typeof payload === 'string') {
    collectScalarPairsFromText(payload, scalarMap)
  }
  collectScalarPairs(payload, scalarMap)
  return Array.from(scalarMap.keys()).sort()
}
