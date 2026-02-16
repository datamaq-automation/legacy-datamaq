import { describe, expect, it } from 'vitest'
import { validateContactDomainRules } from '@/application/validation/contactSchema'

describe('validateContactDomainRules', () => {
  it('accepts valid contact data', () => {
    const result = validateContactDomainRules({
      email: 'ada@example.com',
      message: 'Necesito cotizar instalacion para una linea industrial.'
    })

    expect(result.ok).toBe(true)
  })

  it('rejects invalid email', () => {
    const result = validateContactDomainRules({
      email: 'ada-at-example',
      message: 'Necesito cotizar instalacion para una linea industrial.'
    })

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.type).toBe('InvalidEmail')
    }
  })

  it('no aplica regla de largo de mensaje en validacion de dominio', () => {
    const result = validateContactDomainRules({
      email: 'ada@example.com',
      message: 'Hola'
    })

    expect(result.ok).toBe(true)
  })
})
