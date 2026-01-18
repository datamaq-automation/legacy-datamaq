import type { Result } from '@/application/types/result'
import type { ContactDomainError } from '../errors'

export class ContactName {
  private constructor(readonly value: string) {}

  static create(raw: string): Result<ContactName, ContactDomainError> {
    const value = raw.trim()
    if (value.length < 2) {
      return { ok: false, error: { type: 'InvalidName' } }
    }
    return { ok: true, data: new ContactName(value) }
  }
}
