import { z } from 'zod'
import type { Result } from '@/domain/shared/result'
import type { ContactDomainError } from '@/domain/contact/errors'
import { ContactName } from '@/domain/contact/value-objects/ContactName'
import { Email } from '@/domain/contact/value-objects/Email'

export const EmailContactSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(160),
  company: z.string().max(160).optional(),
  message: z.string().max(1200).optional()
})

export type EmailContactInput = z.infer<typeof EmailContactSchema>

export function validateContactDomainRules(
  payload: EmailContactInput
): Result<EmailContactInput, ContactDomainError> {
  const nameResult = ContactName.create(payload.name)
  if (!nameResult.ok) {
    return { ok: false, error: nameResult.error }
  }

  const emailResult = Email.create(payload.email)
  if (!emailResult.ok) {
    return { ok: false, error: emailResult.error }
  }

  return { ok: true, data: payload }
}
