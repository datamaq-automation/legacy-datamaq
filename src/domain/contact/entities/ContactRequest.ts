import type { ContactName } from '../value-objects/ContactName'
import type { Email } from '../value-objects/Email'
import type { Phone } from '../value-objects/Phone'
import type { Result } from '@/domain/shared/result'
import type { ContactDomainError } from '../errors'
import { ContactName as ContactNameFactory } from '../value-objects/ContactName'
import { Email as EmailFactory } from '../value-objects/Email'
import { Phone as PhoneFactory } from '../value-objects/Phone'

export class ContactRequest {
  private constructor(
    readonly id: string,
    readonly name: ContactName,
    readonly email: Email | null,
    readonly phone: Phone | null,
    readonly firstName: string | null,
    readonly lastName: string | null,
    readonly company: string | null,
    readonly geographicLocation: string | null,
    readonly message: string | null,
    readonly createdAt: Date
  ) {}

  static create(params: {
    id: string
    name: ContactName
    email?: Email | null
    phone?: Phone | null
    firstName?: string
    lastName?: string
    company?: string
    geographicLocation?: string
    message?: string
    createdAt?: Date
  }): ContactRequest {
    return new ContactRequest(
      params.id,
      params.name,
      params.email ?? null,
      params.phone ?? null,
      params.firstName?.trim() || null,
      params.lastName?.trim() || null,
      params.company?.trim() || null,
      params.geographicLocation?.trim() || null,
      params.message?.trim() || null,
      params.createdAt ?? new Date()
    )
  }

  static createFromPrimitives(params: {
    id: string
    name: string
    email?: string
    phone?: string
    firstName?: string
    lastName?: string
    company?: string
    geographicLocation?: string
    message?: string
    createdAt?: Date
  }): Result<ContactRequest, ContactDomainError> {
    const nameResult = ContactNameFactory.create(params.name)
    if (!nameResult.ok) {
      return { ok: false, error: nameResult.error }
    }

    const normalizedEmail = params.email?.trim() ?? ''
    const normalizedPhone = params.phone?.trim() ?? ''

    if (!normalizedEmail && !normalizedPhone) {
      return { ok: false, error: { type: 'MissingContactMethod' } }
    }

    const optionalParams: {
      email?: Email | null
      phone?: Phone | null
      firstName?: string
      lastName?: string
      company?: string
      geographicLocation?: string
      message?: string
      createdAt?: Date
    } = {}

    if (normalizedEmail) {
      const emailResult = EmailFactory.create(normalizedEmail)
      if (!emailResult.ok) {
        return { ok: false, error: emailResult.error }
      }
      optionalParams.email = emailResult.data
    }

    if (normalizedPhone) {
      const phoneResult = PhoneFactory.create(normalizedPhone)
      if (!phoneResult.ok) {
        return { ok: false, error: phoneResult.error }
      }
      optionalParams.phone = phoneResult.data
    }

    if (typeof params.firstName !== 'undefined') {
      optionalParams.firstName = params.firstName
    }
    if (typeof params.lastName !== 'undefined') {
      optionalParams.lastName = params.lastName
    }
    if (typeof params.company !== 'undefined') {
      optionalParams.company = params.company
    }
    if (typeof params.geographicLocation !== 'undefined') {
      optionalParams.geographicLocation = params.geographicLocation
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
        ...optionalParams
      })
    }
  }
}
