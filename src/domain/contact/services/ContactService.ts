import type { Result } from '@/domain/shared/result'
import type { ContactDomainError } from '../errors'
import { ContactRequest } from '../entities/ContactRequest'

export class ContactService {
  createContact(params: {
    id: string
    name: string
    email?: string
    phone?: string
    firstName?: string
    lastName?: string
    company?: string
    geographicLocation?: string
    message?: string
  }): Result<ContactRequest, ContactDomainError> {
    return ContactRequest.createFromPrimitives(params)
  }
}
