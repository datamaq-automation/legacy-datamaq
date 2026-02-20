import type { ContactError } from '@/application/types/errors'
import type { ContactSubmitFeedback } from '@/application/dto/contact'

export function mapSubmitResponseError(status: number, feedback?: ContactSubmitFeedback): ContactError {
  if (status === 0) {
    return {
      type: 'NetworkError',
      requestId: feedback?.requestId,
      errorCode: feedback?.errorCode,
      backendMessage: feedback?.backendMessage
    }
  }

  return {
    type: 'BackendError',
    status,
    requestId: feedback?.requestId,
    errorCode: feedback?.errorCode,
    backendMessage: feedback?.backendMessage
  }
}
