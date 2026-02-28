import { describe, expect, it } from 'vitest'
import { Phone } from '@/domain/contact/value-objects/Phone'

describe('Phone', () => {
  it('accepts a valid phone number', () => {
    const result = Phone.create('+54 11 5555 4444')

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data.value).toBe('+54 11 5555 4444')
    }
  })

  it('rejects an invalid phone number', () => {
    const result = Phone.create('123')

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.type).toBe('InvalidPhone')
    }
  })
})
