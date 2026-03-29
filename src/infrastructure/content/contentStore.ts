import { reactive } from 'vue'
import { SiteSnapshotSchema } from '@/domain/schemas/siteSchema'
import type { AppContent, CommercialConfig } from '@/domain/types/content'
import type { BrandContent, SeoContent, SiteSnapshot } from '@/domain/types/site'
import type { LoggerPort } from '@/application/ports/Logger'

export type CommercialPriceKey = 'visitaDiagnosticoHasta2hARS'
export type CommercialPricingSnapshot = Partial<Pick<CommercialConfig, CommercialPriceKey>>

export class ContentStore {
  private parsedSiteCache: SiteSnapshot | undefined
  private hasRemoteSnapshotApplied = false

  constructor(
    private commercialConfig: CommercialConfig,
    private buildContent: (config: CommercialConfig) => AppContent,
    private buildBrand: (config: CommercialConfig) => BrandContent,
    private buildSeo: () => SeoContent
  ) {}

  getParsedSiteSnapshot(): SiteSnapshot {
    if (this.parsedSiteCache) {
      return this.parsedSiteCache
    }

    const parsed = SiteSnapshotSchema.safeParse(this.buildFallbackSiteSnapshot())
    if (!parsed.success) {
      throw new Error('Invalid site schema')
    }

    this.parsedSiteCache = reactive(parsed.data as SiteSnapshot) as SiteSnapshot
    return this.parsedSiteCache
  }

  getParsedContent(): AppContent {
    return this.getParsedSiteSnapshot().content
  }

  getParsedBrand(): BrandContent {
    return this.getParsedSiteSnapshot().brand
  }

  getParsedSeo(): SeoContent {
    return this.getParsedSiteSnapshot().seo
  }

  applyCommercialPricingSnapshot(snapshot: CommercialPricingSnapshot, logger: LoggerPort): void {
    if (Object.keys(snapshot).length === 0) {
      return
    }

    Object.assign(this.commercialConfig, snapshot)
    if (this.hasRemoteSnapshotApplied) {
      logger.debug('[site] pricing snapshot recibido; se conserva site remoto aplicado.')
      return
    }

    const parsed = SiteSnapshotSchema.safeParse(this.buildFallbackSiteSnapshot())
    if (!parsed.success) {
      logger.error('[site] precios dinamicos invalidan schema de site; se ignora update.')
      return
    }

    patchObjectInPlace(
      this.getParsedSiteSnapshot(),
      parsed.data
    )
  }

  applyRemoteSiteSnapshot(snapshot: unknown, logger: LoggerPort): boolean {
    if (!isRecord(snapshot)) {
      return false
    }

    const parsed = SiteSnapshotSchema.safeParse(snapshot)
    if (!parsed.success) {
      logger.warn('[site] snapshot remoto no cumple SiteSnapshotSchema; se ignora.')
      
      // Solo mostrar en desarrollo: errores de validación del schema
      if (import.meta.env.DEV) {
        console.warn('⚠️ [site] Validación del schema falló. Campos faltantes o inválidos:', {
          errores: parsed.error.errors.map(e => ({
            campo: e.path.join('.'),
            esperado: 'expected' in e ? e.expected : 'unknown',
            recibido: 'received' in e ? e.received : 'unknown',
            mensaje: e.message
          }))
        })
      }
      return false
    }

    const remoteContent = parsed.data.content as AppContent
    if (!hasRequiredTextContent(remoteContent)) {
      logger.warn('[site] snapshot remoto con textos criticos vacios; se ignora y se mantiene fallback local.')
      return false
    }

    patchObjectInPlace(
      this.getParsedSiteSnapshot(),
      parsed.data
    )
    this.hasRemoteSnapshotApplied = true
    return true
  }

  private buildFallbackSiteSnapshot(): SiteSnapshot {
    return {
      content: this.buildContent(this.commercialConfig),
      brand: this.buildBrand(this.commercialConfig),
      seo: this.buildSeo()
    }
  }
}

function patchObjectInPlace(target: object, source: object): void {
  const targetRecord = target as Record<string, unknown>
  const sourceRecord = source as Record<string, unknown>

  // No eliminar campos del target que no están en source
  // Esto permite preservar campos opcionales del fallback local
  // cuando el backend remoto no los incluye
  
  for (const [key, sourceValue] of Object.entries(sourceRecord)) {
    const targetValue = targetRecord[key]

    if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
      patchArrayInPlace(targetValue, sourceValue)
      continue
    }

    if (isRecord(targetValue) && isRecord(sourceValue)) {
      patchObjectInPlace(targetValue, sourceValue)
      continue
    }

    targetRecord[key] = sourceValue
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function hasRequiredTextContent(content: AppContent): boolean {
  const requiredTexts = [
    content.hero.title,
    content.hero.subtitle,
    content.services.title,
    content.contact.title,
    content.contact.subtitle,
    content.decisionFlow.processTitle
  ]

  // Validar campos opcionales solo si están presentes
  if (content.thanks?.title) {
    requiredTexts.push(content.thanks.title)
  }
  if (content.homePage?.faqTitle) {
    requiredTexts.push(content.homePage.faqTitle)
  }
  if (content.contactPage?.supportTitle) {
    requiredTexts.push(content.contactPage.supportTitle)
  }

  if (requiredTexts.some((value) => value.trim().length === 0)) {
    return false
  }

  if (content.services.cards.length === 0) {
    return false
  }

  return !content.services.cards.some((card) => card.title.trim().length === 0)
}
