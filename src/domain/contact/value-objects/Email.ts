import type { Result } from '@/application/types/result'
import type { ContactDomainError } from '../errors'

export class Email {
  private constructor(readonly value: string) {}

  static create(raw: string): Result<Email, ContactDomainError> {
    const value = raw.trim()
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(value)) {
      return { ok: false, error: { type: 'InvalidEmail' } }
    }
    return { ok: true, data: new Email(value) }
  }
}
