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
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      email: parsed.data.email
    }
    if (typeof parsed.data.phoneNumber !== 'undefined') {
      validatedPayload.phoneNumber = parsed.data.phoneNumber
    }
    if (typeof parsed.data.city !== 'undefined') {
      validatedPayload.city = parsed.data.city
    }
    if (typeof parsed.data.country !== 'undefined') {
      validatedPayload.country = parsed.data.country
    }
    if (typeof parsed.data.company !== 'undefined') {
      validatedPayload.company = parsed.data.company
    }

    return { ok: true, data: validatedPayload }
  }

  return {
    validate
  }
}
