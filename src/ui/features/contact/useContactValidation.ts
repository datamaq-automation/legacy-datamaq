import {
  ContactLeadSchema,
  validateContactDomainRules
} from '@/application/validation/contactSchema'
import type { ContactFormPayload } from '@/application/dto/contact'
import type { ContactFieldErrors, ContactFormField } from './contactTypes'

export type ContactValidationResult =
  | {
      ok: true
      data: ContactFormPayload
    }
  | {
      ok: false
      fieldErrors: Partial<ContactFieldErrors>
    }

export function useContactValidation() {
  function validate(payload: ContactFormPayload): ContactValidationResult {
    const parsed = ContactLeadSchema.safeParse(payload)
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

    return { ok: true, data: parsed.data }
  }

  return {
    validate
  }
}

function flattenFieldErrors(
  errors: Record<string, string[] | undefined>
): Partial<ContactFieldErrors> {
  return Object.fromEntries(
    Object.entries(errors)
      .map(([field, messages]) => {
        const message = messages?.[0]?.trim()
        return message ? [field, message] : null
      })
      .filter(Boolean) as Array<[ContactFormField, string]>
  )
}

function buildDomainFieldErrors(
  errorType: string
): Partial<ContactFieldErrors> {
  switch (errorType) {
    case 'InvalidEmail':
      return { email: 'Ingresa un e-mail válido.' }
    case 'InvalidPhone':
      return { phone: 'Ingresa un teléfono válido.' }
    case 'MissingContactMethod':
      return {
        email: 'Ingresa e-mail o teléfono (al menos uno).',
        phone: 'Ingresa e-mail o teléfono (al menos uno).'
      }
    default:
      return {}
  }
}
