import { EmailContactSchema } from '@/application/validation/contactSchema'
import type { EmailContactPayload } from '@/application/dto/contact'
import type { Result } from '@/application/types/result'

export function useContactValidation() {
  function validate(payload: EmailContactPayload): Result<EmailContactPayload, null> {
    const parsed = EmailContactSchema.safeParse(payload)
    if (!parsed.success) {
      return { ok: false, error: null }
    }
    return { ok: true, data: parsed.data }
  }

  return {
    validate
  }
}
