import { describe, expect, it } from 'vitest'
import {
  CONTACT_LEAD_TOTAL_STEPS,
  clampContactLeadStep,
  hasContactLeadStepErrors,
  normalizePreferredContact,
  validateContactLeadStep
} from '@/features/contact/application/leadWizard'

describe('leadWizard', () => {
  it('validates required identity fields on step 1', () => {
    expect(
      validateContactLeadStep(1, {
        firstName: ' ',
        email: 'invalid',
        comment: 'Proyecto largo',
        phone: '+54 11 5555 4444'
      })
    ).toEqual({
      firstName: 'Ingresa tu nombre.',
      email: 'Ingresa un e-mail valido.'
    })
  })

  it('validates minimum project description on step 2', () => {
    expect(
      validateContactLeadStep(2, {
        firstName: 'Ada',
        email: 'ada@example.com',
        comment: 'corto',
        phone: '+54 11 5555 4444'
      })
    ).toEqual({
      comment: 'Describe el proyecto en al menos 10 caracteres.'
    })
  })

  it('validates phone length on final step', () => {
    expect(
      validateContactLeadStep(3, {
        firstName: 'Ada',
        email: 'ada@example.com',
        comment: 'Descripcion valida',
        phone: '1234567'
      })
    ).toEqual({
      phone: 'Ingresa un numero de contacto valido.'
    })
  })

  it('reports whether a step has errors', () => {
    expect(hasContactLeadStepErrors({})).toBe(false)
    expect(hasContactLeadStepErrors({ email: 'Ingresa un e-mail valido.' })).toBe(true)
  })

  it('normalizes preferred contact and clamps step bounds', () => {
    expect(normalizePreferredContact('phone')).toBe('phone')
    expect(normalizePreferredContact('whatsapp')).toBe('whatsapp')
    expect(normalizePreferredContact('anything-else')).toBe('whatsapp')

    expect(clampContactLeadStep(undefined)).toBe(1)
    expect(clampContactLeadStep(0)).toBe(1)
    expect(clampContactLeadStep(2.8)).toBe(2)
    expect(clampContactLeadStep(99)).toBe(CONTACT_LEAD_TOTAL_STEPS)
  })
})
