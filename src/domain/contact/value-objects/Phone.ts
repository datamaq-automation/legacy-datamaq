import type { Result } from '@/domain/shared/result'
import type { ContactDomainError } from '../errors'

export class Phone {
  private constructor(readonly value: string) {}

  static create(raw: string): Result<Phone, ContactDomainError> {
    const value = raw.trim()
    const digits = value.replace(/\D/g, '')

    if (digits.length < 8 || digits.length > 15) {
      return { ok: false, error: { type: 'InvalidPhone' } }
    }

    return { ok: true, data: new Phone(value) }
  }
}
