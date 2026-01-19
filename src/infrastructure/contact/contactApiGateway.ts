import type { ContactGateway } from '@/application/contact/ports/ContactGateway'
import type { ContactSubmitPayload } from '@/application/dto/contact'
import type { Result } from '@/domain/shared/result'
import type { ContactError } from '@/application/types/errors'
import type { HttpClient } from '@/application/ports/HttpClient'
import type { ConfigPort } from '@/application/ports/Config'
import type { LoggerPort } from '@/application/ports/Logger'
import { getAttributionParams } from '@/infrastructure/attribution/utm'

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

    const attribution = getAttributionParams()
    const response = await this.http.postJson(apiUrl, {
      ...payload,
      ...attribution,
      page_location: payload.pageLocation,
      traffic_source: payload.trafficSource,
      user_agent: payload.userAgent,
      created_at: payload.createdAt
    })

    if (!response.ok) {
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
