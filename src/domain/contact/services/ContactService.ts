import type { Result } from '@/domain/shared/result'
import type { ContactDomainError } from '../errors'
import { ContactRequest } from '../entities/ContactRequest'
import { ContactName } from '../value-objects/ContactName'
import { Email } from '../value-objects/Email'

export class ContactService {
  createContact(params: {
    id: string
    name: string
    email: string
    company?: string
    message?: string
  }): Result<ContactRequest, ContactDomainError> {
    const nameResult = ContactName.create(params.name)
    if (!nameResult.ok) {
      return { ok: false, error: nameResult.error }
    }

    const emailResult = Email.create(params.email)
    if (!emailResult.ok) {
      return { ok: false, error: emailResult.error }
    }

    return {
      ok: true,
      data: ContactRequest.create({
        id: params.id,
        name: nameResult.data,
        email: emailResult.data,
        company: params.company,
        message: params.message
      })
    }
  }
}
