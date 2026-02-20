import type { ContactGateway } from '@/application/contact/ports/ContactGateway'
import type { ContactSubmitPayload, ContactSubmitSuccess } from '@/application/dto/contact'
import type { Result } from '@/domain/shared/result'
import type { ContactError } from '@/application/types/errors'
import type { HttpClient } from '@/application/ports/HttpClient'
import type { ConfigPort } from '@/application/ports/Config'
import type { LoggerPort } from '@/application/ports/Logger'
import type { StoragePort } from '@/application/ports/Storage'
import { submitBackendContact } from './backendContactChannel'
import { buildContactPayloadBundle } from './contactPayloadBuilder'
import { mapSubmitResponseError } from './contactSubmissionErrors'
import { evaluateContactEndpointPolicy } from '@/application/contact/contactEndpointPolicy'
import { extractContactSubmitFeedback } from './contactResponseFeedback'

type GatewayChannel = 'contact' | 'mail'

export class ContactApiGateway implements ContactGateway {
  constructor(
    private http: HttpClient,
    private config: ConfigPort,
    private storage: StoragePort,
    private logger: LoggerPort,
    private channel: GatewayChannel = 'contact'
  ) {}

  async submit(payload: ContactSubmitPayload): Promise<Result<ContactSubmitSuccess, ContactError>> {
    const apiUrl = this.channel === 'mail' ? this.config.mailApiUrl : this.config.inquiryApiUrl
    const endpointPolicy = evaluateContactEndpointPolicy(apiUrl)
    if (!apiUrl || !endpointPolicy.allowed) {
      this.logger.error(`${this.resolveChannelLabel()} no es valida para backend-only`, {
        reason: endpointPolicy.reason ?? 'unknown'
      })
      return { ok: false, error: { type: 'Unavailable' } }
    }

    const payloads = buildContactPayloadBundle(payload, this.storage)
    const response = await submitBackendContact(this.http, apiUrl, payloads)
    const feedback = extractContactSubmitFeedback(response)

    if (!response.ok) {
      this.logger.warn('[contactApiGateway] response no OK', {
        status: response.status,
        requestId: feedback.requestId ?? null,
        errorCode: feedback.errorCode ?? null,
        backendMessage: feedback.backendMessage ?? null
      })
      return {
        ok: false,
        error: mapSubmitResponseError(response.status, feedback)
      }
    }

    return {
      ok: true,
      data: feedback
    }
  }

  private resolveChannelLabel(): string {
    return this.channel === 'mail' ? 'MAIL_API_URL' : 'INQUIRY_API_URL'
  }
}
