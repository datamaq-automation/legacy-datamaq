import type { LoggerPort } from '@/application/ports/Logger'
import type { HttpClient } from '@/application/ports/HttpClient'
import { emitRuntimeError, emitRuntimeWarn } from '@/application/utils/runtimeConsole'
import {
  buildBackendEndpointContext,
  emitBackendInfo,
  extractBackendResponseMetadata,
  isRecord
} from '@/infrastructure/backend/backendDiagnostics'
import { resolveBackendPathname } from '@/infrastructure/backend/backendEndpoint'

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
        this.onUnavailable()
        return
      }

      const payload = response.data as unknown
      const fullSnapshot = extractFullContentSnapshot(payload)
      if (fullSnapshot) {
        const applied = this.applyContentSnapshot(fullSnapshot)
        if (applied) {
          logContentInfo(contentApiUrl, response.status, payload, 'full-snapshot')
          this.logger.debug('[content] snapshot remoto completo aplicado', {
            contentApiUrl
          })
          this.onReady()
          return
        }
        const endpointContext = buildBackendEndpointContext(contentApiUrl)
        emitRuntimeWarn('[backend:content] snapshot remoto descartado; se mantiene fallback local', {
          pathname: resolveBackendPathname(contentApiUrl),
          transportMode: endpointContext.transportMode,
          reason: 'snapshot-discarded'
        })
      }

      const heroTitle = extractHeroTitle(payload)
      if (!heroTitle) {
        this.logger.warn('[content] payload remoto sin hero.title utilizable; se mantiene title local.')
        this.onUnavailable()
        return
      }

      this.applyHeroTitle(heroTitle)
      logContentInfo(contentApiUrl, response.status, payload, 'hero-title')
      this.logger.debug('[content] hero.title remoto aplicado', {
        contentApiUrl
      })
      this.onUnavailable()
    } catch (error) {
      this.logger.warn('[content] error consultando contenido remoto; se mantiene title local.', {
        contentApiUrl,
        error
      })
      const endpointContext = buildBackendEndpointContext(contentApiUrl)
      emitRuntimeError('[backend:content] error consultando contenido remoto', {
        pathname: resolveBackendPathname(contentApiUrl),
        transportMode: endpointContext.transportMode,
        reason: 'network-error'
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

function logContentInfo(
  endpoint: string,
  status: number,
  payload: unknown,
  appliedMode: 'full-snapshot' | 'hero-title'
): void {
  const metadata = extractBackendResponseMetadata(payload)
  emitBackendInfo({
    resource: 'content',
    endpoint,
    status,
    metadata,
    details: {
      appliedMode,
      contentRevision: metadata.contentRevision ?? null
    }
  })
}
