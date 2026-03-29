import type { ContactSubmitPayload } from '@/application/dto/contact'
import type { StoragePort } from '@/application/ports/Storage'
import { attachAttributionToPayload } from '@/infrastructure/attribution/utm'

export interface ContactPayloadBundle {
  backendPayload: {
    name: string
    first_name?: string
    last_name?: string
    email?: string
    message: string
    preferred_contact_channel?: 'whatsapp' | 'email'
    custom_attributes?: Record<string, string>
    captcha_token?: string
  }
}

export function buildContactPayloadBundle(
  payload: ContactSubmitPayload,
  storage: StoragePort
): ContactPayloadBundle {
  const enrichedPayload = attachAttributionToPayload(payload, storage)
  const customAttributes = sanitizeCustomAttributes({
    company: payload.company,
    phone: payload.phone
  })
  const firstName = normalizeOptionalText(payload.firstName)
  const lastName = normalizeOptionalText(payload.lastName)
  const preferredContactChannel = normalizePreferredContactChannel(payload.preferredContactChannel)

  return {
    backendPayload: {
      name: enrichedPayload.name,
      ...(firstName ? { first_name: firstName } : {}),
      ...(lastName ? { last_name: lastName } : {}),
      ...(enrichedPayload.email ? { email: enrichedPayload.email } : {}),
      message: payload.comment,
      ...(preferredContactChannel ? { preferred_contact_channel: preferredContactChannel } : {}),
      ...(Object.keys(customAttributes).length > 0 ? { custom_attributes: customAttributes } : {}),
      ...(enrichedPayload.captchaToken ? { captcha_token: enrichedPayload.captchaToken } : {}),
    }
  }
}

function sanitizeCustomAttributes(attrs: Record<string, unknown>): Record<string, string> {
  const entries = Object.entries(attrs)
    .map(([key, value]) => {
      if (value === undefined || value === null) {
        return null
      }
      if (typeof value === 'string') {
        const trimmed = value.trim()
        return trimmed ? [key, trimmed] : null
      }
      return [key, String(value)]
    })
    .filter(Boolean) as Array<[string, string]>

  return Object.fromEntries(entries)
}

function normalizePreferredContactChannel(
  value: ContactSubmitPayload['preferredContactChannel']
): 'whatsapp' | 'email' | undefined {
  if (value === 'whatsapp' || value === 'email') {
    return value
  }
  return undefined
}

function normalizeOptionalText(value: string | undefined): string | undefined {
  if (typeof value !== 'string') {
    return undefined
  }
  const trimmed = value.trim()
  return trimmed || undefined
}
