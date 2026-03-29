import type { ContactRequest } from '@/domain/contact/entities/ContactRequest'
import type { ContactSubmitPayload } from '@/application/dto/contact'

type ContactSubmitMeta = {
  pageLocation: string
  trafficSource: string
  userAgent: string
  createdAt: string
  captchaToken?: string
  preferredContactChannel?: 'whatsapp' | 'email'
}

export function mapContactRequestToSubmitPayload(
  contact: ContactRequest,
  meta: ContactSubmitMeta
): ContactSubmitPayload {
  const submitPayload: ContactSubmitPayload = {
    name: contact.name.value,
    comment: contact.message ?? '',
    ...(meta.captchaToken ? { captchaToken: meta.captchaToken } : {}),
    ...(meta.preferredContactChannel ? { preferredContactChannel: meta.preferredContactChannel } : {}),
    pageLocation: meta.pageLocation,
    trafficSource: meta.trafficSource,
    userAgent: meta.userAgent,
    createdAt: meta.createdAt
  }

  if (contact.email) {
    submitPayload.email = contact.email.value
  }
  if (contact.phone) {
    submitPayload.phone = contact.phone.value
  }
  if (contact.company) {
    submitPayload.company = contact.company
  }
  if (contact.firstName) {
    submitPayload.firstName = contact.firstName
  }
  if (contact.lastName) {
    submitPayload.lastName = contact.lastName
  }
  if (contact.geographicLocation) {
    submitPayload.geographicLocation = contact.geographicLocation
  }

  return submitPayload
}
