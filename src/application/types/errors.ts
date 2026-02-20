export type ContactError =
  | { type: 'ValidationError'; field?: string }
  | {
      type: 'NetworkError'
      requestId?: string
      errorCode?: string
      backendMessage?: string
    }
  | {
      type: 'BackendError'
      status: number
      requestId?: string
      errorCode?: string
      backendMessage?: string
    }
  | { type: 'Unavailable' }
