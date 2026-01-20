import type { Result } from '@/domain/shared/result'
import type { ContactDomainError } from '../errors'
import { ContactRequest } from '../entities/ContactRequest'

export class ContactService {
  createContact(params: {
    id: string
    name: string
    email: string
    company?: string
    message?: string
  }): Result<ContactRequest, ContactDomainError> {
    return ContactRequest.createFromPrimitives(params)
  }
}
