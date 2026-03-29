import type { ContactGateway } from '@/application/contact/ports/ContactGateway'
import type { ContactSubmitPayload, ContactSubmitSuccess } from '@/application/dto/contact'
import type { Result } from '@/domain/shared/result'
import type { ContactError } from '@/application/types/errors'
import type { HttpClient } from '@/application/ports/HttpClient'
import type { ConfigPort } from '@/application/ports/Config'
import type { LoggerPort } from '@/application/ports/Logger'
import type { StoragePort } from '@/application/ports/Storage'
import { summarizeContactSubmitPayload } from '@/application/contact/contactSubmitDiagnostics'
import { emitRuntimeDebug, emitRuntimeWarn } from '@/application/utils/runtimeConsole'
import { submitBackendContact } from './backendContactChannel'
import { buildContactPayloadBundle } from './contactPayloadBuilder'
import { mapSubmitResponseError } from './contactSubmissionErrors'
import { evaluateContactEndpointPolicy } from '@/application/contact/contactEndpointPolicy'
import { extractContactSubmitFeedback } from './contactResponseFeedback'
import { describeBackendEndpoint, resolveBackendPathname } from '@/shared/backend/backendEndpoint'

export class ContactApiGateway implements ContactGateway {
  constructor(
    private http: HttpClient,
    private config: ConfigPort,
    private storage: StoragePort,
    private logger: LoggerPort
  ) {}

  async submit(payload: ContactSubmitPayload): Promise<Result<ContactSubmitSuccess, ContactError>> {
    const apiUrl = this.config.inquiryApiUrl
    const endpointPolicy = evaluateContactEndpointPolicy(apiUrl)
    const endpointLogContext = buildContactEndpointLogContext(apiUrl)
    emitRuntimeDebug('[contact:gateway] submit start', {
      channel: 'contact',
      ...endpointLogContext,
      payload: summarizeContactSubmitPayload(payload)
    })

    if (!apiUrl || !endpointPolicy.allowed) {
      emitRuntimeWarn('[contact:gateway] endpoint invalido para submit', {
        channel: 'contact',
        reason: endpointPolicy.reason ?? 'unknown',
        ...endpointLogContext
      })
      this.logger.error(`${this.resolveChannelLabel()} no es valida para backend-only`, {
        reason: endpointPolicy.reason ?? 'unknown',
        ...endpointLogContext
      })
      return { ok: false, error: { type: 'Unavailable' } }
    }

    const payloads = buildContactPayloadBundle(payload, this.storage)
    const response = await submitBackendContact(this.http, apiUrl, payloads)
    const feedback = extractContactSubmitFeedback(response)

    if (!response.ok) {
      emitRuntimeDebug('[contact:gateway] response no OK', {
        channel: 'contact',
        ...endpointLogContext,
        status: response.status,
        requestId: feedback.requestId ?? null,
        submissionId: feedback.submissionId ?? null,
        submitStatus: feedback.submitStatus ?? null,
        processingStatus: feedback.processingStatus ?? null,
        errorCode: feedback.errorCode ?? null,
        backendMessage: feedback.backendMessage ?? null
      })
      if (response.status >= 500 || response.status === 0) {
        emitRuntimeWarn('[contact:gateway] backend error resumen', {
          channel: 'contact',
          ...endpointLogContext,
          status: response.status,
          requestId: feedback.requestId ?? null,
          errorCode: feedback.errorCode ?? null,
          backendMessage: feedback.backendMessage ?? null
        })
      }
      this.logger.warn('[contactApiGateway] response no OK', {
        ...endpointLogContext,
        status: response.status,
        requestId: feedback.requestId ?? null,
        submissionId: feedback.submissionId ?? null,
        submitStatus: feedback.submitStatus ?? null,
        processingStatus: feedback.processingStatus ?? null,
        errorCode: feedback.errorCode ?? null,
        backendMessage: feedback.backendMessage ?? null
      })
      return {
        ok: false,
        error: mapSubmitResponseError(response.status, feedback)
      }
    }

    emitRuntimeDebug('[contact:gateway] response OK', {
      channel: 'contact',
      ...endpointLogContext,
      status: response.status,
      requestId: feedback.requestId ?? null,
      submissionId: feedback.submissionId ?? null,
      submitStatus: feedback.submitStatus ?? null,
      processingStatus: feedback.processingStatus ?? null
    })
    return {
      ok: true,
      data: feedback
    }
  }

  private resolveChannelLabel(): string {
    return 'INQUIRY_API_URL'
  }
}

function buildContactEndpointLogContext(apiUrl: string | undefined): {
  pathname: string | null
  transportMode: 'direct' | 'proxy' | null
} {
  if (!apiUrl) {
    return {
      pathname: null,
      transportMode: null
    }
  }

  const endpointContext = describeBackendEndpoint(apiUrl)
  return {
    pathname: resolveBackendPathname(apiUrl),
    transportMode: endpointContext.transportMode
  }
}
