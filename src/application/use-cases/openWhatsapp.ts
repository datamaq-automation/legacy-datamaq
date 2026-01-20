import type { ConfigPort } from '../ports/Config'
import type {
  LocationProvider,
  NavigatorProvider,
  WindowOpener
} from '../ports/Environment'
import type { HttpClient } from '../ports/HttpClient'
import type { LoggerPort } from '../ports/Logger'
import type { ContactBackendMonitor } from '../contact/contactBackendStatus'
import type { EngagementTracker } from '../analytics/engagementTracker'
import type { AttributionProvider } from '../ports/Attribution'

export class OpenWhatsappUseCase {
  constructor(
    private config: ConfigPort,
    private location: LocationProvider,
    private navigator: NavigatorProvider,
    private opener: WindowOpener,
    private http: HttpClient,
    private contactBackend: ContactBackendMonitor,
    private engagementTracker: EngagementTracker,
    private attribution: AttributionProvider,
    private logger: LoggerPort
  ) {}

  async execute(section: string = 'fab'): Promise<void> {
    if (!this.config.whatsappNumber) {
      this.logger.warn('Intento de abrir WhatsApp cuando el canal esta deshabilitado')
      return
    }

    if (!import.meta.env.DEV) {
      void this.sendWhatsappContactEvent(section)
    }

    const url = this.buildWhatsappUrl()
    if (!url) {
      return
    }

    this.opener.open(url)

    const trafficSource = getTrafficSource(this.location)
    this.engagementTracker.trackWhatsapp(section, trafficSource)
  }

  private buildWhatsappUrl(): string | null {
    if (!this.config.whatsappNumber) {
      this.logger.error('WhatsApp number is not configured')
      return null
    }

    const presetMessage = this.config.whatsappPresetMessage ?? ''
    return `https://wa.me/${this.config.whatsappNumber}?text=${encodeURIComponent(
      presetMessage
    )}`
  }

  private async sendWhatsappContactEvent(section: string): Promise<void> {
    const apiUrl = this.config.contactApiUrl
    if (!apiUrl) {
      this.logger.error('CONTACT_API_URL no esta configurada')
      this.contactBackend.markUnavailable()
      return
    }

    const backendStatus = await this.contactBackend.ensureStatus()
    if (backendStatus !== 'available') {
      this.logger.warn(
        '[sendWhatsappContactEvent] Backend de contacto no disponible, omitiendo envio.'
      )
      console.log('[sendWhatsappContactEvent] backend status:', backendStatus)
      return
    }

    const payload = {
      name: 'from_whatsapp',
      email: 'whatsapp@profebustos.com.ar',
      company: 'from_whatsapp',
      message: 'from_whatsapp',
      page_location: this.location.href(),
      traffic_source: getTrafficSource(this.location),
      user_agent: this.navigator.userAgent(),
      created_at: new Date().toISOString(),
      attribution: this.attribution.getAttribution() ?? undefined
    }

    this.logger.debug('[sendWhatsappContactEvent] Payload:', payload)

    const originVerify = this.config.originVerifySecret
    const headers = originVerify ? { 'X-Origin-Verify': originVerify } : undefined
    console.log('[sendWhatsappContactEvent] Request:', {
      apiUrl,
      hasOriginVerify: Boolean(originVerify),
      payload
    })

    try {
      const response = await this.http.postJson(apiUrl, payload, headers)
      console.log('[sendWhatsappContactEvent] Response:', {
        status: response.status,
        ok: response.ok
      })
      if (!response.ok) {
        console.warn('[sendWhatsappContactEvent] response no OK:', {
          status: response.status,
          text: response.text,
          data: response.data
        })
      }
      if (!response.ok && response.status >= 500) {
        this.contactBackend.markUnavailable()
        this.logger.warn(
          `[sendWhatsappContactEvent] Respuesta no exitosa del backend (${response.status}).`
        )
      } else {
        this.contactBackend.markAvailable()
      }
    } catch (error) {
      this.contactBackend.markUnavailable()
      this.logger.error('Error al enviar evento de WhatsApp:', error)
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
