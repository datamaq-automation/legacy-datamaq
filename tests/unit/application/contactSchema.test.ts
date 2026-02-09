import { describe, expect, it } from 'vitest'
import { validateContactDomainRules } from '@/application/validation/contactSchema'

describe('validateContactDomainRules', () => {
  it('accepts valid contact data', () => {
    const result = validateContactDomainRules({
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.com',
      company: 'Analytical'
    })

    expect(result.ok).toBe(true)
  })

  it('rejects invalid email', () => {
    const result = validateContactDomainRules({
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada-at-example'
    })

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.type).toBe('InvalidEmail')
    }
  })

  it('rechaza nombre demasiado corto', () => {
    const result = validateContactDomainRules({
      firstName: 'A',
      lastName: '',
      email: 'ada@example.com'
    })

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.type).toBe('InvalidName')
    }
  })
})
