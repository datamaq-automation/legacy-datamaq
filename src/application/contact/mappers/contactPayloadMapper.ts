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
    company: contact.company ?? undefined,
    message: contact.message ?? undefined,
    pageLocation: meta.pageLocation,
    trafficSource: meta.trafficSource,
    userAgent: meta.userAgent,
    createdAt: meta.createdAt
  }
}
