import type { ContactName } from '../value-objects/ContactName'
import type { Email } from '../value-objects/Email'

export class ContactRequest {
  private constructor(
    readonly id: string,
    readonly name: ContactName,
    readonly email: Email,
    readonly company: string | null,
    readonly message: string | null,
    readonly createdAt: Date
  ) {}

  static create(params: {
    id: string
    name: ContactName
    email: Email
    company?: string
    message?: string
    createdAt?: Date
  }): ContactRequest {
    return new ContactRequest(
      params.id,
      params.name,
      params.email,
      params.company?.trim() || null,
      params.message?.trim() || null,
      params.createdAt ?? new Date()
    )
  }
}
