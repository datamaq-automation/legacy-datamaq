export const CONTACT_LEAD_TOTAL_STEPS = 3
export const CONTACT_LEAD_STEP_LABELS = ['Identidad', 'Proyecto', 'Contacto'] as const

export type PreferredContact = 'whatsapp' | 'email'

export interface ContactLeadDraft {
  firstName: string
  lastName: string
  company: string
  email: string
  comment: string
  phone: string
  preferredContact: PreferredContact
  currentStep: number
}

export interface ContactPersistedDraft {
  company: string
  comment: string
  preferredContact: PreferredContact
  currentStep: number
}

export interface ContactLeadStepErrors {
  firstName?: string
  lastName?: string
  company?: string
  email?: string
  comment?: string
  phone?: string
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateContactLeadStep(
  step: number,
  values: Pick<ContactLeadDraft, 'firstName' | 'lastName' | 'company' | 'email' | 'comment' | 'phone' | 'preferredContact'>
): ContactLeadStepErrors {
  if (step === 1) {
    return {}
  }

  if (step === 2) {
    return {}
  }

  const phone = values.phone.trim()
  const email = values.email.trim()

  if (values.preferredContact === 'whatsapp') {
    if (phone.length < 8) {
      return { phone: 'Ingresa un número de WhatsApp válido.' }
    }
    if (email && !EMAIL_REGEX.test(email)) {
      return { email: 'Ingresa un e-mail válido.' }
    }
    return {}
  }

  if (!EMAIL_REGEX.test(email)) {
    return { email: 'Ingresa un e-mail válido.' }
  }
  if (phone && phone.length < 8) {
    return { phone: 'Ingresa un número de WhatsApp válido.' }
  }

  return {}
}

export function hasContactLeadStepErrors(errors: ContactLeadStepErrors): boolean {
  return Boolean(
    errors.firstName ||
      errors.lastName ||
      errors.company ||
      errors.email ||
      errors.comment ||
      errors.phone
  )
}

export function normalizePreferredContact(value: unknown): PreferredContact {
  return value === 'email' ? 'email' : 'whatsapp'
}

export function clampContactLeadStep(step: unknown): number {
  if (typeof step !== 'number' || !Number.isFinite(step)) {
    return 1
  }

  return Math.min(Math.max(Math.trunc(step), 1), CONTACT_LEAD_TOTAL_STEPS)
}
