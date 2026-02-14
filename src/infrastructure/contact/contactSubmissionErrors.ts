import type { ContactError } from '@/application/types/errors'

export function mapSubmitResponseError(status: number): ContactError {
  if (status === 0) {
    return { type: 'NetworkError' }
  }

  return {
    type: 'BackendError',
    status
  }
}
