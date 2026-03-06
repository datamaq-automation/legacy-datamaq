import type { QuoteBureaucracyLevel } from '@/application/dto/quote'
import type { QuoteValidationIssue } from '@/application/quote/quoteApiError'

export type BinaryChoice = boolean | null

export const QUOTE_FORM_FIELDS = [
  'company',
  'contact_name',
  'locality',
  'scheduled',
  'access_ready',
  'safe_window_confirmed',
  'bureaucracy',
  'email',
  'phone',
  'notes'
] as const

export type QuoteFormField = (typeof QUOTE_FORM_FIELDS)[number]
export type QuoteFormErrors = Partial<Record<QuoteFormField, string>>

export interface QuoteFormState {
  company: string
  contact_name: string
  locality: string
  scheduled: BinaryChoice
  access_ready: BinaryChoice
  safe_window_confirmed: BinaryChoice
  bureaucracy: QuoteBureaucracyLevel | ''
  email: string
  phone: string
  notes: string
}

const QUOTE_FORM_FIELDS_SET = new Set<string>(QUOTE_FORM_FIELDS)

export function validateQuoteForm(form: QuoteFormState): QuoteFormErrors {
  const errors: QuoteFormErrors = {}

  if (!form.company.trim()) {
    errors.company = 'Ingresa la empresa.'
  }
  if (!form.contact_name.trim()) {
    errors.contact_name = 'Ingresa el nombre de contacto.'
  }
  if (!form.locality.trim()) {
    errors.locality = 'Ingresa la localidad.'
  }
  if (form.scheduled === null) {
    errors.scheduled = 'Selecciona Si o No.'
  }
  if (form.access_ready === null) {
    errors.access_ready = 'Selecciona Si o No.'
  }
  if (form.safe_window_confirmed === null) {
    errors.safe_window_confirmed = 'Selecciona Si o No.'
  }

  return errors
}

export function hasQuoteFormErrors(errors: QuoteFormErrors): boolean {
  return collectInvalidQuoteFields(errors).length > 0
}

export function collectInvalidQuoteFields(errors: QuoteFormErrors): QuoteFormField[] {
  return QUOTE_FORM_FIELDS.filter((field) => Boolean(errors[field]?.trim()))
}

export function mapBackendValidationIssuesToQuoteErrors(
  validationIssues: QuoteValidationIssue[]
): QuoteFormErrors {
  const errors: QuoteFormErrors = {}

  validationIssues.forEach((issue) => {
    const field = resolveQuoteFormField(issue)
    if (!field) {
      return
    }

    const message = issue.message?.trim()
    if (!message) {
      return
    }

    errors[field] = message
  })

  return errors
}

function resolveQuoteFormField(issue: QuoteValidationIssue): QuoteFormField | undefined {
  if (issue.field && isQuoteFormField(issue.field)) {
    return issue.field
  }

  for (let index = issue.loc.length - 1; index >= 0; index -= 1) {
    const segment = issue.loc[index]
    if (typeof segment === 'string' && isQuoteFormField(segment)) {
      return segment
    }
  }

  return undefined
}

function isQuoteFormField(value: string): value is QuoteFormField {
  return QUOTE_FORM_FIELDS_SET.has(value)
}
