import { describe, expect, it } from 'vitest'
import {
  ContactLeadSchema,
  EmailContactSchema,
  validateContactDomainRules
} from '@/application/validation/contactSchema'

describe('contactSchema', () => {
  it('accepts contact payload when email is present', () => {
    const result = ContactLeadSchema.safeParse({
      firstName: 'Ada',
      lastName: 'Lovelace',
      company: 'Analytical',
      email: 'ada@example.com',
      phone: '',
      geographicLocation: 'CABA',
      comment: 'Necesito una propuesta.'
    })

    expect(result.success).toBe(true)
  })

  it('accepts contact payload when phone is present and email is blank', () => {
    const result = ContactLeadSchema.safeParse({
      firstName: '',
      lastName: '',
      company: '',
      email: '',
      phone: '+54 11 5555 4444',
      geographicLocation: '',
      comment: ''
    })

    expect(result.success).toBe(true)
  })

  it('rejects contact payload when both email and phone are missing', () => {
    const result = ContactLeadSchema.safeParse({
      firstName: '',
      lastName: '',
      company: '',
      email: '',
      phone: '',
      geographicLocation: '',
      comment: ''
    })

    expect(result.success).toBe(false)
  })

  it('rejects invalid phone in domain validation', () => {
    const result = validateContactDomainRules({
      email: '',
      phone: '123'
    })

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.type).toBe('InvalidPhone')
    }
  })

  it('requires email and comment for the mail channel', () => {
    const result = EmailContactSchema.safeParse({
      firstName: '',
      lastName: '',
      company: '',
      email: 'ada@example.com',
      phone: '',
      geographicLocation: '',
      comment: 'Necesito una propuesta por correo.'
    })

    expect(result.success).toBe(true)
  })
})
