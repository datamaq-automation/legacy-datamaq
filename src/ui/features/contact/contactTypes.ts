import type { EmailContactPayload } from '@/application/dto/contact'
import type { ContactError } from '@/application/types/errors'
import type { Result } from '@/domain/shared/result'
import type { ContactBackendChannel } from '@/ui/controllers/contactBackendController'

export type ContactFormSubmit = (
  payload: EmailContactPayload
) => Promise<Result<void, ContactError>>

export interface ContactFormProps {
  contactEmail?: string | undefined
  onSubmit: ContactFormSubmit
  backendChannel?: ContactBackendChannel
}
