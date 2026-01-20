import type { ContactName } from '../value-objects/ContactName'
import type { Email } from '../value-objects/Email'
import type { Result } from '@/domain/shared/result'
import type { ContactDomainError } from '../errors'
import { ContactName as ContactNameFactory } from '../value-objects/ContactName'
import { Email as EmailFactory } from '../value-objects/Email'

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

  static createFromPrimitives(params: {
    id: string
    name: string
    email: string
    company?: string
    message?: string
    createdAt?: Date
  }): Result<ContactRequest, ContactDomainError> {
    const nameResult = ContactNameFactory.create(params.name)
    if (!nameResult.ok) {
      return { ok: false, error: nameResult.error }
    }

    const emailResult = EmailFactory.create(params.email)
    if (!emailResult.ok) {
      return { ok: false, error: emailResult.error }
    }

    const optionalParams: {
      company?: string
      message?: string
      createdAt?: Date
    } = {}

    if (typeof params.company !== 'undefined') {
      optionalParams.company = params.company
    }
    if (typeof params.message !== 'undefined') {
      optionalParams.message = params.message
    }
    if (typeof params.createdAt !== 'undefined') {
      optionalParams.createdAt = params.createdAt
    }

    return {
      ok: true,
      data: ContactRequest.create({
        id: params.id,
        name: nameResult.data,
        email: emailResult.data,
        ...optionalParams
      })
    }
  }
}
