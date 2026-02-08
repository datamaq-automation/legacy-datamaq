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
  return {
    name: contact.name.value,
    email: contact.email.value,
    firstName: details?.firstName ?? contact.name.value.split(' ')[0] ?? '',
    lastName:
      details?.lastName ??
      contact.name.value.split(' ').slice(1).join(' ') ??
      '',
    phoneNumber: details?.phoneNumber,
    city: details?.city,
    country: details?.country,
    company: contact.company ?? undefined,
    pageLocation: meta.pageLocation,
    trafficSource: meta.trafficSource,
    userAgent: meta.userAgent,
    createdAt: meta.createdAt
  }
}
