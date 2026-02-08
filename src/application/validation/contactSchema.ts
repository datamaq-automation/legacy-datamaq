import { z } from 'zod'
import type { Result } from '@/domain/shared/result'
import type { ContactDomainError } from '@/domain/contact/errors'
import { ContactName } from '@/domain/contact/value-objects/ContactName'
import { Email } from '@/domain/contact/value-objects/Email'

export const EmailContactSchema = z.object({
  firstName: z.string().min(2).max(80),
  lastName: z.string().min(2).max(80),
  email: z.string().email().max(160),
  company: z.string().max(160).optional(),
  message: z.string().max(1200).optional()
})

export type EmailContactInput = z.infer<typeof EmailContactSchema>

export function validateContactDomainRules(
  payload: EmailContactInput
): Result<EmailContactInput, ContactDomainError> {
  const fullName = `${payload.firstName} ${payload.lastName}`.trim()
  const nameResult = ContactName.create(fullName)
  if (!nameResult.ok) {
    return { ok: false, error: nameResult.error }
  }

  const emailResult = Email.create(payload.email)
  if (!emailResult.ok) {
    return { ok: false, error: emailResult.error }
  }

  return { ok: true, data: payload }
}
