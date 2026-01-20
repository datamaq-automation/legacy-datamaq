import { describe, expect, it } from 'vitest'
import { Email } from '@/domain/contact/value-objects/Email'

describe('Email', () => {
  it('accepts a valid email', () => {
    const result = Email.create('ada@example.com')

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data.value).toBe('ada@example.com')
    }
  })

  it('rejects an invalid email', () => {
    const result = Email.create('invalid-email')

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.type).toBe('InvalidEmail')
    }
  })
})
