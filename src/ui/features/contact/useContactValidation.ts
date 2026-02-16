import { EmailContactSchema, validateContactDomainRules } from '@/application/validation/contactSchema'
import type { EmailContactPayload } from '@/application/dto/contact'
import type { Result } from '@/domain/shared/result'

export function useContactValidation() {
  function validate(payload: EmailContactPayload): Result<EmailContactPayload, null> {
    const parsed = EmailContactSchema.safeParse(payload)
    if (!parsed.success) {
      return { ok: false, error: null }
    }
    const domainResult = validateContactDomainRules(parsed.data)
    if (!domainResult.ok) {
      return { ok: false, error: null }
    }

    const validatedPayload: EmailContactPayload = {
      email: parsed.data.email,
      message: parsed.data.message
    }

    return { ok: true, data: validatedPayload }
  }

  return {
    validate
  }
}
