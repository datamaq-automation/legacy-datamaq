import type { ContactError } from '@/application/types/errors'
import type { ContactSubmitFeedback } from '@/application/dto/contact'

export function mapSubmitResponseError(status: number, feedback?: ContactSubmitFeedback): ContactError {
  const feedbackMeta = buildFeedbackMeta(feedback)

  if (status === 0) {
    return {
      type: 'NetworkError',
      ...feedbackMeta
    }
  }

  return {
    type: 'BackendError',
    status,
    ...feedbackMeta
  }
}

function buildFeedbackMeta(
  feedback: ContactSubmitFeedback | undefined
): { requestId?: string; errorCode?: string; backendMessage?: string } {
  const meta: { requestId?: string; errorCode?: string; backendMessage?: string } = {}

  if (feedback?.requestId) {
    meta.requestId = feedback.requestId
  }

  if (feedback?.errorCode) {
    meta.errorCode = feedback.errorCode
  }

  if (feedback?.backendMessage) {
    meta.backendMessage = feedback.backendMessage
  }

  return meta
}
