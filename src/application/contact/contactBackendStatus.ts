import type { ConfigPort } from '../ports/Config'
import type { RuntimeFlags } from '../ports/Environment'
import type { HttpClient } from '../ports/HttpClient'
import type { LoggerPort } from '../ports/Logger'

export type ContactBackendStatus = 'unknown' | 'available' | 'unavailable'

type StatusListener = (status: ContactBackendStatus) => void
const CHATWOOT_PUBLIC_CONTACTS_PATTERN = /\/public\/api\/v1\/inboxes\/[^/]+\/contacts\/?$/i

export class ContactBackendMonitor {
  private listeners = new Set<StatusListener>()
  private status: ContactBackendStatus
  private inFlightProbe: Promise<ContactBackendStatus> | null = null

  constructor(
    private http: HttpClient,
    private config: ConfigPort,
    private runtime: RuntimeFlags,
    private logger: LoggerPort
  ) {
    this.status = config.inquiryApiUrl ? 'unknown' : 'unavailable'
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
    const apiUrl = this.config.inquiryApiUrl
    if (!apiUrl || !this.runtime.isBrowser()) {
      this.logger.debug('[contactBackendStatus] Probe omitida', {
        apiUrl: apiUrl ?? null,
        isBrowser: this.runtime.isBrowser()
      })
      this.status = 'unavailable'
      this.notify()
      return this.status
    }

    if (isChatwootPublicContactsEndpoint(apiUrl)) {
      this.logger.debug(
        '[contactBackendStatus] Probe omitida para endpoint Chatwoot Public API',
        { apiUrl }
      )
      this.status = 'available'
      this.notify()
      return this.status
    }

    try {
      this.logger.debug('[contactBackendStatus] Probe start', { apiUrl })
      const response = await this.http.options(apiUrl)
      if (
        response.ok ||
        response.status === 405 ||
        response.status === 400 ||
        response.status === 404
      ) {
        this.status = 'available'
      } else {
        this.status = 'unavailable'
      }
    } catch (error) {
      this.logger.warn(
        '[contactBackendStatus] Error al verificar disponibilidad del backend:',
        { apiUrl, error }
      )
      this.status = 'unavailable'
    }

    this.notify()
    return this.status
  }
}

function isChatwootPublicContactsEndpoint(apiUrl: string): boolean {
  return CHATWOOT_PUBLIC_CONTACTS_PATTERN.test(apiUrl.split(/[?#]/, 1)[0] ?? apiUrl)
}
