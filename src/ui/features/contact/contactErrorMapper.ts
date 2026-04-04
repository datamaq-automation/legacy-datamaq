import type { ContactError } from '@/application/types/errors'

export function mapContactError(
  error: ContactError | undefined,
  messages: { unavailable: string; error: string }
): string {
  if (!error) {
    return messages.error
  }

  switch (error.type) {
    case 'Unavailable':
      return messages.unavailable
    case 'NetworkError':
      return appendTrackingId(messages.error, error.requestId)
    case 'BackendError':
      if (error.status === 429) {
        return appendTrackingId(
          'Demasiadas solicitudes. Intentá nuevamente en unos minutos.',
          error.requestId
        )
      }
      if (error.backendMessage && error.status >= 400 && error.status < 500) {
        return appendTrackingId(error.backendMessage, error.requestId)
      }
      return appendTrackingId(
        'No se pudo enviar la consulta. Verificá los datos e intentá nuevamente.',
        error.requestId
      )
    case 'ValidationError':
      return messages.error
    default:
      return messages.error
  }
}

function appendTrackingId(message: string, requestId: string | undefined): string {
  if (!requestId) {
    return message
  }

  return `${message} Código de seguimiento: ${requestId}.`
}
