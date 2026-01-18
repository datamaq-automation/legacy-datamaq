import type { EmailContactPayload } from '@/application/dto/contact'
import type { ContactError } from '@/application/types/errors'
import type { Result } from '@/application/types/result'

export type ContactFormSubmit = (
  payload: EmailContactPayload
) => Promise<Result<void, ContactError>>

export interface ContactFormProps {
  contactEmail?: string
  onSubmit: ContactFormSubmit
}
