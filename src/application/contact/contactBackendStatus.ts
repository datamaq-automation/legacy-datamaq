import type { ConfigPort } from '../ports/Config'
import type { RuntimeFlags } from '../ports/Environment'
import type { HttpClient } from '../ports/HttpClient'
import type { LoggerPort } from '../ports/Logger'
import { emitRuntimeWarn } from '../utils/runtimeConsole'
import {
  describeBackendEndpoint,
  resolveBackendOrigin,
  resolveBackendPathname
} from '@/shared/backend/backendEndpoint'
import { evaluateContactEndpointPolicy } from './contactEndpointPolicy'

export type ContactBackendStatus = 'unknown' | 'available' | 'unavailable'

type StatusListener = (status: ContactBackendStatus) => void
type ApiUrlSelector = (config: ConfigPort) => string | undefined

const backendConsoleWarnCache = new Set<string>()

export class ContactBackendMonitor {
  private listeners = new Set<StatusListener>()
  private status: ContactBackendStatus
  private inFlightProbe: Promise<ContactBackendStatus> | null = null

  constructor(
    private http: HttpClient,
    private config: ConfigPort,
    private runtime: RuntimeFlags,
    private logger: LoggerPort,
    private selectApiUrl: ApiUrlSelector = (cfg) => cfg.healthApiUrl || cfg.inquiryApiUrl,
    private monitorLabel: string = 'contactBackendStatus'
  ) {
    this.status = this.selectApiUrl(config) ? 'unknown' : 'unavailable'
  }

  getStatus(): ContactBackendStatus {
    return this.status
  }

  subscribe(listener: StatusListener): () => void {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  async ensureStatus(): Promise<ContactBackendStatus> {
    if (this.status !== 'unknown') {
      return this.status
    }

    if (!this.inFlightProbe) {
      this.inFlightProbe = this.probe().finally(() => {
        this.inFlightProbe = null
      })
    }

    const currentProbe = this.inFlightProbe
    if (!currentProbe) {
      return this.status
    }
    return currentProbe
  }

  markAvailable(): void {
    if (this.status === 'available') {
      return
    }
    this.status = 'available'
    this.notify()
  }

  markUnavailable(): void {
    if (this.status === 'unavailable') {
      return
    }
    this.status = 'unavailable'
    this.notify()
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener(this.status))
  }

  private async probe(): Promise<ContactBackendStatus> {
    const apiUrl = this.selectApiUrl(this.config)
    const endpointPolicy = evaluateContactEndpointPolicy(apiUrl)
    if (!apiUrl || !endpointPolicy.allowed || !this.runtime.isBrowser()) {
      this.logger.debug(`[${this.monitorLabel}] Probe omitida`, {
        apiUrl: apiUrl ?? null,
        isBrowser: this.runtime.isBrowser(),
        reason: endpointPolicy.reason ?? null
      })
      if (this.runtime.isBrowser()) {
        logContactBackendWarnOnce(this.monitorLabel, {
          endpoint: apiUrl ?? null,
          reason: endpointPolicy.reason ?? (!this.runtime.isBrowser() ? 'not-browser' : 'missing')
        })
      }
      this.status = 'unavailable'
      this.notify()
      return this.status
    }

    try {
      this.logger.debug(`[${this.monitorLabel}] Probe start`, { apiUrl })
      const isHealthEndpoint = isHealthProbeEndpoint(apiUrl)
      const response = isHealthEndpoint ? await this.http.get(apiUrl) : await this.http.options(apiUrl)
      if (response.ok || response.status === 405 || response.status === 400) {
        this.status = 'available'
      } else if (response.status === 404) {
        this.status = 'unavailable'
        logContactBackendWarnOnce(this.monitorLabel, {
          endpoint: apiUrl,
          status: response.status,
          reason: 'endpoint-not-found'
        })
      } else {
        this.status = 'unavailable'
        logContactBackendWarnOnce(this.monitorLabel, {
          endpoint: apiUrl,
          status: response.status,
          reason: response.status === 0 ? 'network-error' : 'http-error'
        })
      }
    } catch (error) {
      this.logger.warn(
        `[${this.monitorLabel}] Error al verificar disponibilidad del backend:`,
        { apiUrl, error }
      )
      logContactBackendWarnOnce(this.monitorLabel, {
        endpoint: apiUrl,
        reason: 'network-error'
      })
      this.status = 'unavailable'
    }

    this.notify()
    return this.status
  }
}

function isHealthProbeEndpoint(apiUrl: string): boolean {
  const normalized = apiUrl.split(/[?#]/, 1)[0] ?? apiUrl
  return (
    normalized.endsWith('/health') ||
    normalized.endsWith('/healthz') ||
    normalized.endsWith('/healthz/readiness')
  )
}

function logContactBackendWarnOnce(
  monitorLabel: string,
  payload: {
    endpoint: string | null
    status?: number
    reason?: string
  }
): void {
  const reason = payload.reason ?? 'na'
  const dedupeKey =
    reason === 'network-error' || reason === 'endpoint-not-found'
      ? `${resolveBackendOrigin(payload.endpoint)}|${reason}`
      : `${monitorLabel}|${payload.endpoint ?? 'null'}|${payload.status ?? 'na'}|${reason}`
  if (backendConsoleWarnCache.has(dedupeKey)) {
    return
  }
  backendConsoleWarnCache.add(dedupeKey)
  const endpointContext = payload.endpoint ? describeBackendEndpoint(payload.endpoint) : null
  emitRuntimeWarn(`[backend:${monitorLabel}] sin conexion`, {
    pathname: resolveBackendPathname(payload.endpoint),
    transportMode: endpointContext?.transportMode ?? null,
    status: payload.status,
    reason: payload.reason ?? 'unknown'
  })
}
