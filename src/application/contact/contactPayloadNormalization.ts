import type { ContactFormPayload, ContactSubmitPayload } from '@/application/dto/contact'

type PreferredContactChannel = ContactFormPayload['preferredContactChannel']

export function normalizePreferredContactChannel(
  value: PreferredContactChannel
): 'whatsapp' | 'email' | undefined {
  if (value === 'whatsapp' || value === 'email') {
    return value
  }
  return undefined
}

export function normalizeOptionalText(value: string | undefined): string | undefined {
  if (typeof value !== 'string') {
    return undefined
  }
  const trimmed = value.trim()
  return trimmed || undefined
}

export function normalizeContactFormPayload(payload: ContactFormPayload): {
  firstName?: string
  lastName?: string
  company?: string
  email?: string
  phone?: string
  preferredContactChannel?: 'whatsapp' | 'email'
  geographicLocation?: string
  comment?: string
  captchaToken?: string
} {
  const firstName = normalizeOptionalText(payload.firstName)
  const lastName = normalizeOptionalText(payload.lastName)
  const company = normalizeOptionalText(payload.company)
  const email = normalizeOptionalText(payload.email)
  const phone = normalizeOptionalText(payload.phone)
  const preferredContactChannel = normalizePreferredContactChannel(payload.preferredContactChannel)
  const geographicLocation = normalizeOptionalText(payload.geographicLocation)
  const comment = normalizeOptionalText(payload.comment)
  const captchaToken = normalizeOptionalText(payload.captchaToken ?? '')

  return {
    ...(firstName ? { firstName } : {}),
    ...(lastName ? { lastName } : {}),
    ...(company ? { company } : {}),
    ...(email ? { email } : {}),
    ...(phone ? { phone } : {}),
    ...(preferredContactChannel ? { preferredContactChannel } : {}),
    ...(geographicLocation ? { geographicLocation } : {}),
    ...(comment ? { comment } : {}),
    ...(captchaToken ? { captchaToken } : {})
  }
}

export function normalizeContactSubmitMetadata(payload: ContactSubmitPayload): {
  firstName?: string
  lastName?: string
  preferredContactChannel?: 'whatsapp' | 'email'
} {
  const firstName = normalizeOptionalText(payload.firstName)
  const lastName = normalizeOptionalText(payload.lastName)
  const preferredContactChannel = normalizePreferredContactChannel(payload.preferredContactChannel)

  return {
    ...(firstName ? { firstName } : {}),
    ...(lastName ? { lastName } : {}),
    ...(preferredContactChannel ? { preferredContactChannel } : {})
  }
}
