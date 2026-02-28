import {
  ContactLeadSchema,
  EmailContactSchema,
  validateContactDomainRules
} from '@/application/validation/contactSchema'
import type { ContactFormPayload } from '@/application/dto/contact'
import type { ContactBackendChannel } from '@/ui/controllers/contactBackendController'

export function useContactValidation() {
  function validate(
    payload: ContactFormPayload,
    channel: ContactBackendChannel
  ): {
    ok: true
    data: ContactFormPayload
  } | {
    ok: false
    fieldErrors: Partial<Record<keyof ContactFormPayload, string>>
  } {
    const schema = channel === 'mail' ? EmailContactSchema : ContactLeadSchema
    const parsed = schema.safeParse(payload)
    if (!parsed.success) {
      return {
        ok: false,
        fieldErrors: flattenFieldErrors(parsed.error.flatten().fieldErrors)
      }
    }
    const domainResult = validateContactDomainRules({
      email: parsed.data.email,
      phone: parsed.data.phone
    })
    if (!domainResult.ok) {
      return {
        ok: false,
        fieldErrors: buildDomainFieldErrors(domainResult.error.type)
      }
    }

    const validatedPayload: ContactFormPayload = {
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      company: parsed.data.company,
      email: parsed.data.email,
      phone: parsed.data.phone,
      geographicLocation: parsed.data.geographicLocation,
      comment: parsed.data.comment
    }

    return { ok: true, data: validatedPayload }
  }

  return {
    validate
  }
}

function flattenFieldErrors(
  errors: Record<string, string[] | undefined>
): Partial<Record<keyof ContactFormPayload, string>> {
  return Object.fromEntries(
    Object.entries(errors)
      .map(([field, messages]) => {
        const message = messages?.[0]?.trim()
        return message ? [field, message] : null
      })
      .filter(Boolean) as Array<[keyof ContactFormPayload, string]>
  )
}

function buildDomainFieldErrors(
  errorType: string
): Partial<Record<keyof ContactFormPayload, string>> {
  switch (errorType) {
    case 'InvalidEmail':
      return { email: 'Ingresa un e-mail valido.' }
    case 'InvalidPhone':
      return { phone: 'Ingresa un telefono valido.' }
    case 'MissingContactMethod':
      return {
        email: 'Ingresa e-mail o telefono.',
        phone: 'Ingresa e-mail o telefono.'
      }
    default:
      return {}
  }
}
