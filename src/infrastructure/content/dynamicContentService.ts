import type { LoggerPort } from '@/application/ports/Logger'
import type { HttpClient } from '@/application/ports/HttpClient'

export class DynamicContentService {
  private contentFetchStarted = false

  constructor(
    private http: HttpClient,
    private contentApiUrl: string | undefined,
    private logger: LoggerPort,
    private applyContentSnapshot: (snapshot: unknown) => boolean,
    private applyHeroTitle: (title: string) => void,
    private onReady: () => void = () => undefined,
    private onUnavailable: () => void = () => undefined
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
      this.onUnavailable()
      return
    }

    void this.syncRemoteContent(contentApiUrl)
  }

  private async syncRemoteContent(contentApiUrl: string): Promise<void> {
    try {
      const response = await this.http.get(contentApiUrl, {
        headers: {
          Accept: 'application/json, text/plain;q=0.9, */*;q=0.8'
        },
        timeoutMs: 8_000,
        retries: 1
      })

      if (!response.ok) {
        this.logger.warn('[content] fallo al consultar contenido remoto', {
          contentApiUrl,
          status: response.status
        })
        return
      }

      const payload = response.data as unknown
      const fullSnapshot = extractFullContentSnapshot(payload)
      if (fullSnapshot) {
        const applied = this.applyContentSnapshot(fullSnapshot)
        if (applied) {
          this.logger.debug('[content] snapshot remoto completo aplicado', {
            contentApiUrl
          })
          this.onReady()
          return
        }
        console.warn('[backend:content] snapshot remoto descartado; se mantiene fallback local', {
          endpoint: contentApiUrl
        })
      }

      const heroTitle = extractHeroTitle(payload)
      if (!heroTitle) {
        this.logger.warn('[content] payload remoto sin hero.title utilizable; se mantiene title local.')
        this.onUnavailable()
        return
      }

      this.applyHeroTitle(heroTitle)
      this.logger.debug('[content] hero.title remoto aplicado', {
        contentApiUrl
      })
      this.onUnavailable()
    } catch (error) {
      this.logger.warn('[content] error consultando contenido remoto; se mantiene title local.', {
        contentApiUrl,
        error
      })
      console.error('[backend:content] error consultando contenido remoto', {
        endpoint: contentApiUrl,
        error
      })
      this.onUnavailable()
    }
  }
}

function extractFullContentSnapshot(payload: unknown): Record<string, unknown> | undefined {
  if (!isRecord(payload)) {
    return undefined
  }

  const dataValue = payload['data']
  if (isRecord(dataValue)) {
    return dataValue
  }
  return undefined
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
