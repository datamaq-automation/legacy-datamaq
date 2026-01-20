import type { ContactGateway } from '@/application/contact/ports/ContactGateway'
import type { ContactSubmitPayload } from '@/application/dto/contact'
import type { Result } from '@/domain/shared/result'
import type { ContactError } from '@/application/types/errors'
import type { HttpClient } from '@/application/ports/HttpClient'
import type { ConfigPort } from '@/application/ports/Config'
import type { LoggerPort } from '@/application/ports/Logger'
import { attachAttributionToPayload } from '@/infrastructure/attribution/utm'

export class ContactApiGateway implements ContactGateway {
  constructor(
    private http: HttpClient,
    private config: ConfigPort,
    private logger: LoggerPort
  ) {}

  async submit(payload: ContactSubmitPayload): Promise<Result<void, ContactError>> {
    const apiUrl = this.config.contactApiUrl
    if (!apiUrl) {
      this.logger.error('CONTACT_API_URL no esta configurada')
      return { ok: false, error: { type: 'Unavailable' } }
    }

    const enrichedPayload = attachAttributionToPayload(payload)
    const originVerify = this.config.originVerifySecret
    const headers = originVerify ? { 'X-Origin-Verify': originVerify } : undefined
    console.log('[contactApiGateway] submit start:', {
      apiUrl,
      hasOriginVerify: Boolean(originVerify)
    })
    console.log('[contactApiGateway] submit payload:', {
      apiUrl,
      hasOriginVerify: Boolean(originVerify),
      payload: {
        ...enrichedPayload,
        page_location: payload.pageLocation,
        traffic_source: payload.trafficSource,
        user_agent: payload.userAgent,
        created_at: payload.createdAt
      }
    })
    const response = await this.http.postJson(apiUrl, {
      ...enrichedPayload,
      page_location: payload.pageLocation,
      traffic_source: payload.trafficSource,
      user_agent: payload.userAgent,
      created_at: payload.createdAt
    }, headers)
    console.log('[contactApiGateway] submit response:', {
      status: response.status,
      ok: response.ok
    })

    if (!response.ok) {
      console.warn('[contactApiGateway] response no OK:', {
        status: response.status,
        text: response.text,
        data: response.data
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
