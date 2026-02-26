import { reactive } from 'vue'
import { AppContentSchema } from '@/domain/schemas/contentSchema'
import type { AppContent, CommercialConfig } from '@/domain/types/content'
import type { LoggerPort } from '@/application/ports/Logger'

export type CommercialPriceKey = 'visitaDiagnosticoHasta2hARS'
export type CommercialPricingSnapshot = Partial<Pick<CommercialConfig, CommercialPriceKey>>

export class ContentStore {
  private parsedContentCache: AppContent | undefined
  private hasRemoteSnapshotApplied = false

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
    if (this.hasRemoteSnapshotApplied) {
      logger.debug('[content] pricing snapshot recibido; se conserva contenido remoto aplicado.')
      return
    }

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

  applyHeroTitle(title: string, logger: LoggerPort): void {
    const normalizedTitle = title.trim()
    if (!normalizedTitle) {
      return
    }

    const currentContent = this.getParsedContent()
    const candidate = {
      ...currentContent,
      hero: {
        ...currentContent.hero,
        title: normalizedTitle
      }
    }
    const parsed = AppContentSchema.safeParse(candidate)
    if (!parsed.success) {
      logger.error('[content] hero.title remoto invalida schema; se ignora update.')
      return
    }

    patchObjectInPlace(
      currentContent as unknown as Record<string, unknown>,
      parsed.data as unknown as Record<string, unknown>
    )
  }

  applyRemoteContentSnapshot(snapshot: unknown, logger: LoggerPort): boolean {
    if (!isRecord(snapshot)) {
      return false
    }

    const parsed = AppContentSchema.safeParse(snapshot)
    if (!parsed.success) {
      logger.warn('[content] snapshot remoto no cumple AppContentSchema; se ignora.')
      return false
    }
    if (!hasRequiredTextContent(parsed.data as AppContent)) {
      logger.warn('[content] snapshot remoto con textos criticos vacios; se ignora y se mantiene fallback local.')
      return false
    }

    patchObjectInPlace(
      this.getParsedContent() as unknown as Record<string, unknown>,
      parsed.data as unknown as Record<string, unknown>
    )
    this.hasRemoteSnapshotApplied = true
    return true
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

function hasRequiredTextContent(content: AppContent): boolean {
  const requiredTexts = [
    content.hero.title,
    content.hero.subtitle,
    content.services.title,
    content.contact.title,
    content.contact.subtitle,
    content.decisionFlow.processTitle,
    content.thanks.title
  ]

  const hasEmptyRequiredText = requiredTexts.some((value) => value.trim().length === 0)
  if (hasEmptyRequiredText) {
    return false
  }

  if (content.services.cards.length === 0) {
    return false
  }

  const hasEmptyServiceTitle = content.services.cards.some((card) => card.title.trim().length === 0)
  if (hasEmptyServiceTitle) {
    return false
  }

  return true
}
