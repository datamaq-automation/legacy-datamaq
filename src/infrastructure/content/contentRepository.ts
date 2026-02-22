/*
Path: src/infrastructure/content/contentRepository.ts
*/

import type {
  AboutContentPort,
  ConsentContentPort,
  ContactContentPort,
  ContentPort,
  FooterContentPort,
  HeroContentPort,
  LegalContentPort,
  NavbarContentPort,
  ProfileContentPort,
  ServicesContentPort
} from '@/application/ports/Content'
import type { ConfigPort } from '@/application/ports/Config'
import type { LoggerPort } from '@/application/ports/Logger'
import type { AppContent, CommercialConfig } from '@/domain/types/content'
import { AppContentSchema } from '@/domain/schemas/contentSchema'
import { buildAppContent, commercialConfig } from '@/infrastructure/content/Appcontent'
import { NoopLogger } from '@/infrastructure/logging/noopLogger'
import { reactive } from 'vue'

type CommercialPriceKey =
  | 'visitaDiagnosticoHasta2hARS'

type CommercialPricingSnapshot = Partial<Pick<CommercialConfig, CommercialPriceKey>>

const pricingConsoleWarnCache = new Set<string>()
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

export class ContentRepository
  implements
    ContentPort,
    NavbarContentPort,
    FooterContentPort,
    ContactContentPort,
    HeroContentPort,
    AboutContentPort,
    ProfileContentPort,
    LegalContentPort,
    ConsentContentPort,
    ServicesContentPort
{
  private parsedContentCache: AppContent | undefined
  private dynamicPricingFetchStarted = false

  constructor(
    private config?: Pick<ConfigPort, 'pricingApiUrl'>,
    private logger: LoggerPort = new NoopLogger()
  ) {
    this.bootstrapDynamicPricing()
  }

  getContent(): AppContent {
    const parsedContent = this.getParsedContent()
    return {
      ...parsedContent,
      navbar: this.getNormalizedNavbarContent(parsedContent.navbar)
    }
  }

  getNavbarContent() {
    return this.getNormalizedNavbarContent(this.getParsedContent().navbar)
  }

  getFooterContent() {
    return this.getParsedContent().footer
  }

  getContactContent() {
    return this.getParsedContent().contact
  }

  getHeroContent() {
    return this.getParsedContent().hero
  }

  getAboutContent() {
    return this.getParsedContent().about
  }

  getProfileContent() {
    return this.getParsedContent().profile
  }

  getLegalContent() {
    return this.getParsedContent().legal
  }

  getConsentContent() {
    return this.getParsedContent().consent
  }

  getServicesContent() {
    return this.getParsedContent().services
  }

  private getParsedContent(): AppContent {
    if (this.parsedContentCache) {
      return this.parsedContentCache
    }

    const parsed = AppContentSchema.safeParse(buildAppContent(commercialConfig))
    if (!parsed.success) {
      throw new Error('Invalid content schema')
    }
    this.parsedContentCache = reactive(parsed.data as AppContent) as AppContent
    return this.parsedContentCache
  }

  private bootstrapDynamicPricing(): void {
    if (this.dynamicPricingFetchStarted) {
      return
    }
    this.dynamicPricingFetchStarted = true

    if (typeof window === 'undefined') {
      return
    }

    const pricingApiUrl = normalizeUrl(this.config?.pricingApiUrl)
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
        logPricingWarnOnce({
          endpoint: pricingApiUrl,
          status: response.status
        })
        return
      }

      const payload = await readPricingPayload(response)
      const pricingSnapshot = extractCommercialPricingSnapshot(payload)
      if (!pricingSnapshot) {
        this.logger.warn('[content] payload de precios sin campos reconocibles; se mantiene fallback.')
        logPricingWarnOnce({
          endpoint: pricingApiUrl
        })
        return
      }

      this.applyCommercialPricingSnapshot(pricingSnapshot)
      this.logger.debug('[content] precios dinamicos aplicados', pricingSnapshot)
      if (isDevRuntime) {
        console.info('[backend:pricing] conexion OK', {
          endpoint: pricingApiUrl
        })
      }
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

  private applyCommercialPricingSnapshot(snapshot: CommercialPricingSnapshot): void {
    const snapshotKeys = Object.keys(snapshot)
    if (snapshotKeys.length === 0) {
      return
    }

    Object.assign(commercialConfig, snapshot)
    const parsed = AppContentSchema.safeParse(buildAppContent(commercialConfig))
    if (!parsed.success) {
      this.logger.error('[content] precios dinamicos invalidan schema de contenido; se ignora update.')
      return
    }

    const currentContent = this.getParsedContent()
    patchObjectInPlace(
      currentContent as unknown as Record<string, unknown>,
      parsed.data as unknown as Record<string, unknown>
    )
  }

  private getNormalizedNavbarContent(navbar: AppContent['navbar']): AppContent['navbar'] {
    const labelsByHref = new Map(navbar.links.map((link) => [link.href, link.label]))

    return {
      ...navbar,
      links: [
        { href: '#servicios', label: labelsByHref.get('#servicios') ?? 'Servicios' },
        { href: '#proceso', label: labelsByHref.get('#proceso') ?? 'Proceso' },
        { href: '#tarifas', label: labelsByHref.get('#tarifas') ?? 'Tarifas' },
        { href: '#cobertura', label: labelsByHref.get('#cobertura') ?? 'Cobertura' },
        { href: '#faq', label: labelsByHref.get('#faq') ?? 'FAQ' },
        { href: '#contacto', label: labelsByHref.get('#contacto') ?? 'Contacto' }
      ]
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

function collectScalarPairs(value: unknown, target: Map<string, unknown>, depth: number = 0): void {
  if (depth > 6 || value === null || value === undefined) {
    return
  }

  if (Array.isArray(value)) {
    value.forEach((entry) => collectScalarPairs(entry, target, depth + 1))
    return
  }

  if (!isRecord(value)) {
    return
  }

  Object.entries(value).forEach(([key, entry]) => {
    if (isRecord(entry) || Array.isArray(entry)) {
      collectScalarPairs(entry, target, depth + 1)
      return
    }

    const normalizedKey = normalizeAliasKey(key)
    if (!normalizedKey || target.has(normalizedKey)) {
      return
    }
    target.set(normalizedKey, entry)
  })
}

function resolveAmountByAliases(
  source: Map<string, unknown>,
  aliases: readonly string[]
): number | undefined {
  for (const alias of aliases) {
    const normalizedAlias = normalizeAliasKey(alias)
    if (!normalizedAlias || !source.has(normalizedAlias)) {
      continue
    }

    const parsedAmount = parseAmount(source.get(normalizedAlias))
    if (typeof parsedAmount === 'number') {
      return parsedAmount
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

function patchObjectInPlace(
  target: Record<string, unknown>,
  source: Record<string, unknown>
): void {
  for (const key of Object.keys(target)) {
    if (!(key in source)) {
      delete target[key]
    }
  }

  for (const [key, sourceValue] of Object.entries(source)) {
    const targetValue = target[key]

    if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
      patchArrayInPlace(targetValue, sourceValue)
      continue
    }

    if (isRecord(targetValue) && isRecord(sourceValue)) {
      patchObjectInPlace(targetValue, sourceValue)
      continue
    }

    target[key] = sourceValue
  }
}

function patchArrayInPlace(target: unknown[], source: unknown[]): void {
  target.length = source.length

  source.forEach((sourceValue, index) => {
    const targetValue = target[index]

    if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
      patchArrayInPlace(targetValue, sourceValue)
      return
    }

    if (isRecord(targetValue) && isRecord(sourceValue)) {
      patchObjectInPlace(targetValue, sourceValue)
      return
    }

    target[index] = sourceValue
  })
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

function logPricingWarnOnce(payload: {
  endpoint: string
  status?: number
  reason?: string
}): void {
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
