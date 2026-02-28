import { describe, expect, it } from 'vitest'
import { ContactRequest } from '@/domain/contact/entities/ContactRequest'

describe('ContactRequest', () => {
  it('creates a contact request from primitives with email', () => {
    const result = ContactRequest.createFromPrimitives({
      id: 'contact_1',
      name: 'Ada Lovelace',
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.com',
      company: 'Analytical',
      geographicLocation: 'CABA',
      message: 'Hola'
    })

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data.name.value).toBe('Ada Lovelace')
      expect(result.data.firstName).toBe('Ada')
      expect(result.data.lastName).toBe('Lovelace')
      expect(result.data.email?.value).toBe('ada@example.com')
      expect(result.data.company).toBe('Analytical')
      expect(result.data.geographicLocation).toBe('CABA')
      expect(result.data.message).toBe('Hola')
    }
  })

  it('accepts phone-only contacts', () => {
    const result = ContactRequest.createFromPrimitives({
      id: 'contact_2',
      name: 'Contacto +54 11 5555 4444',
      phone: '+54 11 5555 4444'
    })

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data.email).toBeNull()
      expect(result.data.phone?.value).toBe('+54 11 5555 4444')
    }
  })

  it('fails when name is invalid', () => {
    const result = ContactRequest.createFromPrimitives({
      id: 'contact_3',
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
      id: 'contact_4',
      name: 'Ada Lovelace',
      email: 'ada-at-example'
    })

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.type).toBe('InvalidEmail')
    }
  })

  it('fails when no contact method is present', () => {
    const result = ContactRequest.createFromPrimitives({
      id: 'contact_5',
      name: 'Grace Hopper'
    })

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.type).toBe('MissingContactMethod')
    }
  })

  it('acepta createdAt personalizado', () => {
    const customDate = new Date('2025-01-01T00:00:00.000Z')
    const result = ContactRequest.createFromPrimitives({
      id: 'contact_6',
      name: 'Grace Hopper',
      email: 'grace@example.com',
      createdAt: customDate
    })

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data.createdAt).toBe(customDate)
    }
  })
})
