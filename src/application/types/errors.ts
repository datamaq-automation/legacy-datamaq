export type ContactError =
  | { type: 'ValidationError'; field?: string }
  | { type: 'NetworkError' }
  | { type: 'BackendError'; status: number }
  | { type: 'Unavailable' }
