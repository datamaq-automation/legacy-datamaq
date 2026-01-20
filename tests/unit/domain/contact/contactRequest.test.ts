import { describe, expect, it } from 'vitest'
import { ContactRequest } from '@/domain/contact/entities/ContactRequest'

describe('ContactRequest', () => {
  it('creates a contact request from primitives', () => {
    const result = ContactRequest.createFromPrimitives({
      id: 'contact_1',
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      company: 'Analytical',
      message: 'Hola'
    })

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data.name.value).toBe('Ada Lovelace')
      expect(result.data.email.value).toBe('ada@example.com')
      expect(result.data.company).toBe('Analytical')
      expect(result.data.message).toBe('Hola')
    }
  })

  it('fails when name is invalid', () => {
    const result = ContactRequest.createFromPrimitives({
      id: 'contact_2',
      name: 'A',
      email: 'ada@example.com'
    })

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.type).toBe('InvalidName')
    }
  })

  it('fails when email is invalid', () => {
    const result = ContactRequest.createFromPrimitives({
      id: 'contact_3',
      name: 'Ada Lovelace',
      email: 'ada-at-example'
    })

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.type).toBe('InvalidEmail')
    }
  })
})
