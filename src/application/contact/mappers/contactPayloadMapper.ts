import type { ContactRequest } from '@/domain/contact/entities/ContactRequest'
import type { ContactSubmitPayload } from '@/application/dto/contact'

type ContactSubmitMeta = {
  pageLocation: string
  trafficSource: string
  userAgent: string
  createdAt: string
}

export function mapContactRequestToSubmitPayload(
  contact: ContactRequest,
  meta: ContactSubmitMeta,
  details?: {
    firstName?: string
    lastName?: string
    phoneNumber?: string
    city?: string
    country?: string
  }
): ContactSubmitPayload {
  const submitPayload: ContactSubmitPayload = {
    name: contact.name.value,
    email: contact.email.value,
    firstName: details?.firstName ?? contact.name.value.split(' ')[0] ?? '',
    lastName:
      details?.lastName ??
      contact.name.value.split(' ').slice(1).join(' ') ??
      '',
    pageLocation: meta.pageLocation,
    trafficSource: meta.trafficSource,
    userAgent: meta.userAgent,
    createdAt: meta.createdAt
  }

  assignIfDefined(submitPayload, 'phoneNumber', details?.phoneNumber)
  assignIfDefined(submitPayload, 'city', details?.city)
  assignIfDefined(submitPayload, 'country', details?.country)
  assignIfDefined(submitPayload, 'company', contact.company ?? undefined)

  return submitPayload
}

function assignIfDefined<K extends keyof ContactSubmitPayload>(
  target: ContactSubmitPayload,
  key: K,
  value: ContactSubmitPayload[K] | undefined
): void {
  if (typeof value === 'undefined') {
    return
  }
  target[key] = value
}
