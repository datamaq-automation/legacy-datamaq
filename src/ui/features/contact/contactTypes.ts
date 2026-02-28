import type { ContactFormPayload, ContactSubmitSuccess } from '@/application/dto/contact'
import type { ContactError } from '@/application/types/errors'
import type { Result } from '@/domain/shared/result'
import type { ContactContent } from '@/domain/types/content'
import type { ContactBackendChannel } from '@/ui/controllers/contactBackendController'

export type ContactFormSubmit = (
  payload: ContactFormPayload
) => Promise<Result<ContactSubmitSuccess, ContactError>>

export const CONTACT_FORM_FIELDS = [
  'firstName',
  'lastName',
  'company',
  'email',
  'phone',
  'geographicLocation',
  'comment'
] as const

export type ContactFormField = (typeof CONTACT_FORM_FIELDS)[number]

export type ContactFieldErrors = Record<ContactFormField, string>

export type ResolvedContactFormContent = Omit<ContactContent, 'labels'> & {
  labels: Required<NonNullable<ContactContent['labels']>>
}

export interface ContactFormProps {
  onSubmit: ContactFormSubmit
  backendChannel?: ContactBackendChannel
  sectionId?: string
  title?: string
  subtitle?: string
  submitLabel?: string
}
