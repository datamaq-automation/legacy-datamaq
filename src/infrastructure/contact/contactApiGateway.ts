import type { ContactGateway } from '@/application/contact/ports/ContactGateway'
import type { ContactSubmitPayload } from '@/application/dto/contact'
import type { Result } from '@/domain/shared/result'
import type { ContactError } from '@/application/types/errors'
import type { HttpClient } from '@/application/ports/HttpClient'
import type { ConfigPort } from '@/application/ports/Config'
import type { LoggerPort } from '@/application/ports/Logger'
import type { StoragePort } from '@/application/ports/Storage'
import { submitBackendContact } from './backendContactChannel'
import { resolveContactChannel } from './contactChannelResolver'
import { buildContactPayloadBundle } from './contactPayloadBuilder'
import { mapSubmitResponseError } from './contactSubmissionErrors'
import { submitChatwootContact } from './chatwootContactChannel'

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

    const headers = buildContactHeaders(this.config.originVerifySecret)
    const payloads = buildContactPayloadBundle(payload, this.storage)
    const channel = resolveContactChannel(apiUrl)
    const response =
      channel === 'chatwootPublic'
        ? await submitChatwootContact(this.http, apiUrl, payloads, headers)
        : await submitBackendContact(this.http, apiUrl, payloads, headers)

    if (!response.ok) {
      this.logger.warn('[contactApiGateway] response no OK', {
        status: response.status
      })
      return {
        ok: false,
        error: mapSubmitResponseError(response.status)
      }
    }

    return { ok: true, data: undefined }
  }
}

function buildContactHeaders(
  originVerifySecret: string | undefined
): Record<string, string> | undefined {
  if (!originVerifySecret) {
    return undefined
  }

  return { 'X-Origin-Verify': originVerifySecret }
}
