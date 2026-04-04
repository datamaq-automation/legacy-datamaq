import { describe, expect, it } from 'vitest'
import {
  CONTACT_LEAD_TOTAL_STEPS,
  clampContactLeadStep,
  hasContactLeadStepErrors,
  normalizePreferredContact,
  validateContactLeadStep
} from '@/ui/features/contact/contactLeadWizard'

describe('contactLeadWizard', () => {
  it('keeps identity optional on step 1', () => {
    expect(
      validateContactLeadStep({
        email: 'invalid',
        phone: '+54 11 5555 4444',
        preferredContact: 'whatsapp'
      })
    ).toEqual({
      email: 'Ingresa un e-mail válido.'
    })
  })

  it('validates whatsapp as required when selected on final step', () => {
    expect(
      validateContactLeadStep({
        email: 'ada@example.com',
        phone: '1234567',
        preferredContact: 'whatsapp'
      })
    ).toEqual({
      phone: 'Ingresa un número de WhatsApp válido.'
    })
  })

  it('validates email as required when selected on final step', () => {
    expect(
      validateContactLeadStep({
        email: 'invalido',
        phone: '+54 11 5555 4444',
        preferredContact: 'email'
      })
    ).toEqual({
      email: 'Ingresa un e-mail válido.'
    })
  })

  it('reports whether a step has errors', () => {
    expect(hasContactLeadStepErrors({})).toBe(false)
    expect(hasContactLeadStepErrors({ email: 'Ingresa un e-mail válido.' })).toBe(true)
  })

  it('normalizes preferred contact and clamps step bounds', () => {
    expect(normalizePreferredContact('email')).toBe('email')
    expect(normalizePreferredContact('whatsapp')).toBe('whatsapp')
    expect(normalizePreferredContact('anything-else')).toBe('whatsapp')

    expect(clampContactLeadStep(undefined)).toBe(1)
    expect(clampContactLeadStep(0)).toBe(1)
    expect(clampContactLeadStep(2.8)).toBe(2)
    expect(clampContactLeadStep(99)).toBe(CONTACT_LEAD_TOTAL_STEPS)
  })
})
