import type { ContactGateway } from '@/application/contact/ports/ContactGateway'
import type { ContactSubmitPayload } from '@/application/dto/contact'
import type { Result } from '@/domain/shared/result'
import type { ContactError } from '@/application/types/errors'
import type { HttpClient } from '@/application/ports/HttpClient'
import type { ConfigPort } from '@/application/ports/Config'
import type { LoggerPort } from '@/application/ports/Logger'
import type { StoragePort } from '@/application/ports/Storage'
import { attachAttributionToPayload } from '@/infrastructure/attribution/utm'
import { buildChatwootContactPayload } from '@/application/contact/chatwootPayload'

export class ContactApiGateway implements ContactGateway {
  constructor(
    private http: HttpClient,
    private config: ConfigPort,
    private storage: StoragePort,
    private logger: LoggerPort
  ) {}

  async submit(payload: ContactSubmitPayload): Promise<Result<void, ContactError>> {
    const apiUrl = this.config.contactApiUrl
    if (!apiUrl) {
      this.logger.error('CONTACT_API_URL no esta configurada')
      return { ok: false, error: { type: 'Unavailable' } }
    }

    const enrichedPayload = attachAttributionToPayload(payload, this.storage)
    const originVerify = this.config.originVerifySecret
    const headers = originVerify ? { 'X-Origin-Verify': originVerify } : undefined
    const chatwootPayload = buildChatwootContactPayload({
      name: enrichedPayload.name,
      email: enrichedPayload.email,
      customAttributes: {
        first_name: payload.firstName,
        last_name: payload.lastName,
        company: enrichedPayload.company,
        message: enrichedPayload.message,
        page_location: payload.pageLocation,
        traffic_source: payload.trafficSource,
        user_agent: payload.userAgent,
        created_at: payload.createdAt,
        attribution: enrichedPayload.attribution
      }
    })
    this.logger.debug('[contactApiGateway] submit start', {
      apiUrl,
      hasOriginVerify: Boolean(originVerify),
      payloadKeys: Object.keys(chatwootPayload),
      customAttributeKeys: chatwootPayload.custom_attributes
        ? Object.keys(chatwootPayload.custom_attributes)
        : []
    })
    const response = await this.http.postJson(apiUrl, chatwootPayload, headers)
    this.logger.debug('[contactApiGateway] submit response', {
      status: response.status,
      ok: response.ok,
      text: response.text
    })

    if (!response.ok) {
      this.logger.warn('[contactApiGateway] response no OK', {
        status: response.status
      })
      return {
        ok: false,
        error: {
          type: response.status === 0 ? 'NetworkError' : 'BackendError',
          status: response.status
        }
      }
    }

    return { ok: true, data: undefined }
  }
}
