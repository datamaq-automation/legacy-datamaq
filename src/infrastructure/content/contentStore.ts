import { reactive } from 'vue'
import { AppContentSchema } from '@/domain/schemas/contentSchema'
import type { AppContent, CommercialConfig } from '@/domain/types/content'
import type { LoggerPort } from '@/application/ports/Logger'

export type CommercialPriceKey = 'visitaDiagnosticoHasta2hARS'
export type CommercialPricingSnapshot = Partial<Pick<CommercialConfig, CommercialPriceKey>>

export class ContentStore {
  private parsedContentCache: AppContent | undefined

  constructor(
    private commercialConfig: CommercialConfig,
    private buildAppContent: (config: CommercialConfig) => AppContent
  ) {}

  getParsedContent(): AppContent {
    if (this.parsedContentCache) {
      return this.parsedContentCache
    }

    const parsed = AppContentSchema.safeParse(this.buildAppContent(this.commercialConfig))
    if (!parsed.success) {
      throw new Error('Invalid content schema')
    }
    this.parsedContentCache = reactive(parsed.data as AppContent) as AppContent
    return this.parsedContentCache
  }

  applyCommercialPricingSnapshot(snapshot: CommercialPricingSnapshot, logger: LoggerPort): void {
    if (Object.keys(snapshot).length === 0) {
      return
    }

    Object.assign(this.commercialConfig, snapshot)
    const parsed = AppContentSchema.safeParse(this.buildAppContent(this.commercialConfig))
    if (!parsed.success) {
      logger.error('[content] precios dinamicos invalidan schema de contenido; se ignora update.')
      return
    }

    patchObjectInPlace(
      this.getParsedContent() as unknown as Record<string, unknown>,
      parsed.data as unknown as Record<string, unknown>
    )
  }
}

function patchObjectInPlace(target: Record<string, unknown>, source: Record<string, unknown>): void {
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
