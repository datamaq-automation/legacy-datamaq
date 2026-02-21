import type { ConfigPort } from '../ports/Config'
import type { RuntimeFlags } from '../ports/Environment'
import type { HttpClient } from '../ports/HttpClient'
import type { LoggerPort } from '../ports/Logger'
import { evaluateContactEndpointPolicy } from './contactEndpointPolicy'

export type ContactBackendStatus = 'unknown' | 'available' | 'unavailable'

type StatusListener = (status: ContactBackendStatus) => void
type ApiUrlSelector = (config: ConfigPort) => string | undefined

export class ContactBackendMonitor {
  private listeners = new Set<StatusListener>()
  private status: ContactBackendStatus
  private inFlightProbe: Promise<ContactBackendStatus> | null = null

  constructor(
    private http: HttpClient,
    private config: ConfigPort,
    private runtime: RuntimeFlags,
    private logger: LoggerPort,
    private selectApiUrl: ApiUrlSelector = (cfg) => cfg.inquiryApiUrl,
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
        console.warn(
          `[backend:${this.monitorLabel}] sin conexion disponible`,
          {
            endpoint: apiUrl ?? null,
            reason: endpointPolicy.reason ?? (!this.runtime.isBrowser() ? 'not-browser' : 'missing')
          }
        )
      }
      this.status = 'unavailable'
      this.notify()
      return this.status
    }

    try {
      this.logger.debug(`[${this.monitorLabel}] Probe start`, { apiUrl })
      const response = await this.http.options(apiUrl)
      if (
        response.ok ||
        response.status === 405 ||
        response.status === 400 ||
        response.status === 404
      ) {
        this.status = 'available'
        console.info(`[backend:${this.monitorLabel}] conexion OK`, {
          endpoint: apiUrl,
          status: response.status
        })
      } else {
        this.status = 'unavailable'
        console.warn(`[backend:${this.monitorLabel}] sin conexion`, {
          endpoint: apiUrl,
          status: response.status
        })
      }
    } catch (error) {
      this.logger.warn(
        `[${this.monitorLabel}] Error al verificar disponibilidad del backend:`,
        { apiUrl, error }
      )
      console.warn(`[backend:${this.monitorLabel}] sin conexion`, {
        endpoint: apiUrl,
        reason: 'network-error'
      })
      this.status = 'unavailable'
    }

    this.notify()
    return this.status
  }
}
