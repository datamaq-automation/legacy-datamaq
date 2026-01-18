import type { ConfigPort } from '../ports/Config'
import type { LocationProvider } from '../ports/Environment'
import type { HttpClient } from '../ports/HttpClient'
import type { LoggerPort } from '../ports/Logger'
import type { ContactBackendMonitor } from '../services/contactBackendStatus'
import type { EngagementTracker } from '../services/engagementTracker'

export interface EmailContactPayload {
  name: string
  email: string
  company?: string
  message?: string
}

export class SubmitEmailContact {
  constructor(
    private config: ConfigPort,
    private location: LocationProvider,
    private http: HttpClient,
    private contactBackend: ContactBackendMonitor,
    private engagementTracker: EngagementTracker,
    private logger: LoggerPort
  ) {}

  async execute(
    section: string,
    payload: EmailContactPayload
  ): Promise<{ ok: boolean; error?: string }> {
    const apiUrl = this.config.contactApiUrl
    if (!apiUrl) {
      this.logger.error('CONTACT_API_URL no esta configurada')
      this.contactBackend.markUnavailable()
      return { ok: false, error: 'No se encuentra configurado el backend de contacto.' }
    }

    const backendStatus = await this.contactBackend.ensureStatus()
    if (backendStatus !== 'available') {
      return {
        ok: false,
        error: 'El canal de correo electronico no se encuentra disponible en este momento.'
      }
    }

    this.logger.debug('[submitEmailContact] Enviando payload:', payload)
    this.logger.debug('[submitEmailContact] URL:', apiUrl)

    const extendedPayload = {
      ...payload,
      message: payload.message?.trim() ? payload.message : 'Null',
      page_location: this.location.href(),
      traffic_source: getTrafficSource(this.location)
    }

    try {
      const res = await this.http.postJson(apiUrl, extendedPayload)
      this.logger.debug('[submitEmailContact] Respuesta HTTP:', res.status)

      if (!res.ok) {
        const rawError = res.text ?? 'Error desconocido'
        this.logger.warn('[submitEmailContact] Error de backend:', rawError)

        if (res.status >= 500) {
          this.contactBackend.markUnavailable()
        } else {
          this.contactBackend.markAvailable()
        }

        return { ok: false, error: mapBackendError(res.status) }
      }

      this.contactBackend.markAvailable()
      this.engagementTracker.trackEmail(section, getTrafficSource(this.location))
      return { ok: true }
    } catch (error) {
      this.contactBackend.markUnavailable()
      this.logger.error('Error al enviar la consulta de contacto:', error)
      return { ok: false, error: 'No se pudo enviar la consulta. Intente mas tarde.' }
    }
  }
}

function getTrafficSource(location: LocationProvider): string {
  const params = new URLSearchParams(location.search())
  const utmSource = params.get('utm_source')
  if (utmSource) {
    return utmSource
  }
  return location.referrer() || 'direct'
}

function mapBackendError(status: number): string {
  if (status >= 500) {
    return 'No se pudo enviar la consulta. Intente mas tarde.'
  }
  if (status === 429) {
    return 'Demasiadas solicitudes. Intente nuevamente en unos minutos.'
  }
  return 'No se pudo enviar la consulta. Verifique los datos e intente nuevamente.'
}
