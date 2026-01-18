import type { EmailContactPayload } from '@/application/use-cases/submitEmailContact'

export type ContactFormSubmit = (
  payload: EmailContactPayload
) => Promise<{ ok: boolean; error?: string }>

export interface ContactFormProps {
  contactEmail?: string
  onSubmit: ContactFormSubmit
}
