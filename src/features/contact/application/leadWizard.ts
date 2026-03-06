export const CONTACT_LEAD_TOTAL_STEPS = 3
export const CONTACT_LEAD_STEP_LABELS = ['Identidad', 'Proyecto', 'Contacto'] as const

export type PreferredContact = 'whatsapp' | 'phone'

export interface ContactLeadDraft {
  firstName: string
  email: string
  comment: string
  phone: string
  preferredContact: PreferredContact
  currentStep: number
}

export interface ContactLeadStepErrors {
  firstName?: string
  email?: string
  comment?: string
  phone?: string
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateContactLeadStep(
  step: number,
  values: Pick<ContactLeadDraft, 'firstName' | 'email' | 'comment' | 'phone'>
): ContactLeadStepErrors {
  if (step === 1) {
    const errors: ContactLeadStepErrors = {}
    if (!values.firstName.trim()) {
      errors.firstName = 'Ingresa tu nombre.'
    }
    if (!EMAIL_REGEX.test(values.email.trim())) {
      errors.email = 'Ingresa un e-mail valido.'
    }
    return errors
  }

  if (step === 2) {
    if (values.comment.trim().length < 10) {
      return { comment: 'Describe el proyecto en al menos 10 caracteres.' }
    }

    return {}
  }

  if (values.phone.trim().length < 8) {
    return { phone: 'Ingresa un numero de contacto valido.' }
  }

  return {}
}

export function hasContactLeadStepErrors(errors: ContactLeadStepErrors): boolean {
  return Boolean(errors.firstName || errors.email || errors.comment || errors.phone)
}

export function normalizePreferredContact(value: unknown): PreferredContact {
  return value === 'phone' ? 'phone' : 'whatsapp'
}

export function clampContactLeadStep(step: unknown): number {
  if (typeof step !== 'number' || !Number.isFinite(step)) {
    return 1
  }

  return Math.min(Math.max(Math.trunc(step), 1), CONTACT_LEAD_TOTAL_STEPS)
}
