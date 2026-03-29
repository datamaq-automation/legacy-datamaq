import type { LoggerPort } from '@/application/ports/Logger'
import type { HttpClient } from '@/application/ports/HttpClient'
import { emitRuntimeError } from '@/application/utils/runtimeConsole'
import {
  buildBackendEndpointContext,
  emitBackendInfo,
  extractBackendResponseMetadata,
  isRecord
} from '@/infrastructure/backend/backendDiagnostics'
import { resolveBackendPathname } from '@/shared/backend/backendEndpoint'

export class DynamicContentService {
  private siteFetchStarted = false

  constructor(
    private http: HttpClient,
    private siteApiUrl: string | undefined,
    private logger: LoggerPort,
    private applySiteSnapshot: (snapshot: unknown) => boolean,
    private onReady: () => void = () => undefined,
    private onUnavailable: () => void = () => undefined
  ) {}

  bootstrap(): void {
    if (this.siteFetchStarted) {
      return
    }
    this.siteFetchStarted = true

    if (typeof window === 'undefined') {
      return
    }

    const siteApiUrl = normalizeUrl(this.siteApiUrl)
    if (!siteApiUrl) {
      this.logger.warn('[site] siteApiUrl no configurada; se mantiene fallback local.')
      this.onUnavailable()
      return
    }

    void this.syncRemoteSite(siteApiUrl)
  }

  private async syncRemoteSite(siteApiUrl: string): Promise<void> {
    try {
      const response = await this.http.get(siteApiUrl, {
        headers: {
          Accept: 'application/json, text/plain;q=0.9, */*;q=0.8'
        },
        timeoutMs: 8_000,
        retries: 1
      })

      if (!response.ok) {
        this.logger.warn('[site] fallo al consultar site remoto', {
          siteApiUrl,
          status: response.status
        })
        this.onUnavailable()
        return
      }

      const payload = response.data as unknown
      const siteSnapshot = extractSiteSnapshot(payload)
      if (!siteSnapshot) {
        this.logger.warn('[site] payload remoto sin data utilizable; se mantiene fallback local.')
        this.onUnavailable()
        return
      }

      const applied = this.applySiteSnapshot(siteSnapshot)
      if (!applied) {
        this.logger.warn('[site] snapshot remoto descartado; se mantiene fallback local.', { siteApiUrl })
        this.onUnavailable()
        return
      }

      logSiteInfo(siteApiUrl, response.status, payload)
      this.logger.debug('[site] snapshot remoto completo aplicado', {
        siteApiUrl
      })
      this.onReady()
    } catch (error) {
      this.logger.warn('[site] error consultando site remoto; se mantiene fallback local.', {
        siteApiUrl,
        error
      })
      const endpointContext = buildBackendEndpointContext(siteApiUrl)
      emitRuntimeError('[backend:site] error consultando site remoto', {
        pathname: resolveBackendPathname(siteApiUrl),
        transportMode: endpointContext.transportMode,
        reason: 'network-error'
      })
      this.onUnavailable()
    }
  }
}

function extractSiteSnapshot(payload: unknown): Record<string, unknown> | undefined {
  if (!isRecord(payload)) {
    return undefined
  }

  const dataValue = payload['data']
  if (isRecord(dataValue)) {
    return dataValue
  }

  return undefined
}

function normalizeUrl(url: string | undefined): string | undefined {
  const trimmed = url?.trim()
  return trimmed ? trimmed : undefined
}

function logSiteInfo(endpoint: string, status: number, payload: unknown): void {
  const metadata = extractBackendResponseMetadata(payload)
  emitBackendInfo({
    resource: 'site',
    endpoint,
    status,
    payload,
    metadata,
    details: {
      appliedMode: 'full-site-snapshot',
      contentRevision: metadata.contentRevision ?? null
    }
  })
}
