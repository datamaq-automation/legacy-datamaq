import { z } from 'zod'
import type { Result } from '@/domain/shared/result'
import type { ContactDomainError } from '@/domain/contact/errors'
import { Email } from '@/domain/contact/value-objects/Email'

export const EmailContactSchema = z.object({
  email: z.string().email().max(160),
  message: z.string().min(10).max(2000)
})

export type EmailContactInput = z.infer<typeof EmailContactSchema>

export function validateContactDomainRules(
  payload: EmailContactInput
): Result<EmailContactInput, ContactDomainError> {
  const emailResult = Email.create(payload.email)
  if (!emailResult.ok) {
    return { ok: false, error: emailResult.error }
  }

  return { ok: true, data: payload }
}
