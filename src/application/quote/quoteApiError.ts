export interface QuoteValidationIssue {
  field?: string
  loc: string[]
  message: string
  type?: string
}

interface QuoteApiErrorParams {
  message: string
  status: number
  detail?: string | undefined
  retryAfterSeconds?: number | undefined
  validationIssues?: QuoteValidationIssue[] | undefined
  kind?: 'network' | 'http'
}

export class QuoteApiError extends Error {
  readonly status: number
  readonly detail: string | undefined
  readonly retryAfterSeconds: number | undefined
  readonly validationIssues: QuoteValidationIssue[]
  readonly kind: 'network' | 'http'

  constructor({
    message,
    status,
    detail,
    retryAfterSeconds,
    validationIssues,
    kind = 'http'
  }: QuoteApiErrorParams) {
    super(message)
    this.name = 'QuoteApiError'
    this.status = status
    this.detail = detail
    this.retryAfterSeconds = retryAfterSeconds
    this.validationIssues = validationIssues ?? []
    this.kind = kind
  }

  static network(message: string): QuoteApiError {
    return new QuoteApiError({
      message,
      status: 0,
      kind: 'network'
    })
  }

  static is(value: unknown): value is QuoteApiError {
    return value instanceof QuoteApiError
  }
}
