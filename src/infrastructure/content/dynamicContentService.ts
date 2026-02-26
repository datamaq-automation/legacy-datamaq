import type { LoggerPort } from '@/application/ports/Logger'

export class DynamicContentService {
  private contentFetchStarted = false

  constructor(
    private contentApiUrl: string | undefined,
    private logger: LoggerPort,
    private applyHeroTitle: (title: string) => void
  ) {}

  bootstrap(): void {
    if (this.contentFetchStarted) {
      return
    }
    this.contentFetchStarted = true

    if (typeof window === 'undefined') {
      return
    }

    const contentApiUrl = normalizeUrl(this.contentApiUrl)
    if (!contentApiUrl) {
      this.logger.warn('[content] contentApiUrl no configurada; se mantiene title local.')
      return
    }

    void this.syncRemoteContent(contentApiUrl)
  }

  private async syncRemoteContent(contentApiUrl: string): Promise<void> {
    try {
      const response = await fetch(contentApiUrl, {
        method: 'GET',
        headers: {
          Accept: 'application/json, text/plain;q=0.9, */*;q=0.8'
        },
        cache: 'no-store'
      })

      if (!response.ok) {
        this.logger.warn('[content] fallo al consultar contenido remoto', {
          contentApiUrl,
          status: response.status
        })
        return
      }

      const payload = (await response.json().catch(() => undefined)) as unknown
      const heroTitle = extractHeroTitle(payload)
      if (!heroTitle) {
        this.logger.warn('[content] payload remoto sin hero.title utilizable; se mantiene title local.')
        return
      }

      this.applyHeroTitle(heroTitle)
      this.logger.debug('[content] hero.title remoto aplicado', {
        contentApiUrl
      })
    } catch (error) {
      this.logger.warn('[content] error consultando contenido remoto; se mantiene title local.', {
        contentApiUrl,
        error
      })
    }
  }
}

function extractHeroTitle(payload: unknown): string | undefined {
  if (!isRecord(payload)) {
    return undefined
  }

  const dataValue = payload['data']
  if (isRecord(dataValue)) {
    const titleFromDataHero = getHeroTitleFromRecord(dataValue)
    if (titleFromDataHero) {
      return titleFromDataHero
    }
  }

  return getHeroTitleFromRecord(payload)
}

function getHeroTitleFromRecord(record: Record<string, unknown>): string | undefined {
  const heroValue = record['hero']
  if (!isRecord(heroValue)) {
    return undefined
  }
  const titleValue = heroValue['title']
  if (typeof titleValue !== 'string') {
    return undefined
  }
  const normalizedTitle = titleValue.trim()
  return normalizedTitle ? normalizedTitle : undefined
}

function normalizeUrl(url: string | undefined): string | undefined {
  const trimmed = url?.trim()
  return trimmed ? trimmed : undefined
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
