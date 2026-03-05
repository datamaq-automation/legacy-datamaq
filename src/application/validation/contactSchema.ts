import { z } from 'zod'
import type { Result } from '@/domain/shared/result'
import type { ContactDomainError } from '@/domain/contact/errors'
import { Email } from '@/domain/contact/value-objects/Email'
import { Phone } from '@/domain/contact/value-objects/Phone'
import type { ContactFormPayload } from '@/application/dto/contact'

const OptionalTextField = (maxLength: number) =>
  z.string().max(maxLength).transform((value) => value.trim())

const OptionalEmailField = OptionalTextField(160).refine(
  (value) => value.length === 0 || Email.create(value).ok,
  'Ingresa un e-mail valido.'
)

const OptionalPhoneField = OptionalTextField(40).refine(
  (value) => value.length === 0 || Phone.create(value).ok,
  'Ingresa un telefono valido.'
)

export const ContactLeadSchema = z
  .object({
    firstName: OptionalTextField(80),
    lastName: OptionalTextField(80),
    company: OptionalTextField(120),
    email: OptionalEmailField,
    phone: OptionalPhoneField,
    geographicLocation: OptionalTextField(160),
    comment: OptionalTextField(2000)
  })
  .superRefine((payload, context) => {
    if (!payload.email && !payload.phone) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['email'],
        message: 'Ingresa e-mail o teléfono (al menos uno).'
      })
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['phone'],
        message: 'Ingresa e-mail o teléfono (al menos uno).'
      })
    }
  })

export const EmailContactSchema = z.object({
  firstName: OptionalTextField(80),
  lastName: OptionalTextField(80),
  company: OptionalTextField(120),
  email: z
    .string()
    .max(160)
    .transform((value) => value.trim())
    .refine((value) => Email.create(value).ok, 'Ingresa un e-mail valido.'),
  phone: OptionalPhoneField,
  geographicLocation: OptionalTextField(160),
  comment: z
    .string()
    .min(10, 'Ingresa un comentario de al menos 10 caracteres.')
    .max(2000)
    .transform((value) => value.trim())
})

export type ContactLeadInput = z.infer<typeof ContactLeadSchema>
export type EmailContactInput = z.infer<typeof EmailContactSchema>

export function validateContactDomainRules(
  payload: Pick<ContactFormPayload, 'email' | 'phone'>
): Result<Pick<ContactFormPayload, 'email' | 'phone'>, ContactDomainError> {
  const normalizedEmail = payload.email.trim()
  const normalizedPhone = payload.phone.trim()

  if (!normalizedEmail && !normalizedPhone) {
    return { ok: false, error: { type: 'MissingContactMethod' } }
  }

  if (normalizedEmail) {
    const emailResult = Email.create(normalizedEmail)
    if (!emailResult.ok) {
      return { ok: false, error: emailResult.error }
    }
  }

  if (normalizedPhone) {
    const phoneResult = Phone.create(normalizedPhone)
    if (!phoneResult.ok) {
      return { ok: false, error: phoneResult.error }
    }
  }

  return { ok: true, data: payload }
}
