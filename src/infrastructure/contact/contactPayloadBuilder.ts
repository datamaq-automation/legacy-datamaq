import type { ContactSubmitPayload } from '@/application/dto/contact'
import type { StoragePort } from '@/application/ports/Storage'
import { attachAttributionToPayload } from '@/infrastructure/attribution/utm'

export interface ContactPayloadBundle {
  normalizedPhone: string | undefined
  customAttributes: Record<string, string>
  chatwootPayload: {
    name: string
    email: string
    phone_number: string | undefined
    custom_attributes: Record<string, string>
  }
  backendPayload: {
    firstName: string
    lastName: string
    name: string
    email: string
    phoneNumber: string | undefined
    city: string | undefined
    country: string | undefined
    company: string | undefined
    custom_attributes: Record<string, string>
    meta: {
      page_location: string
      traffic_source: string
      user_agent: string
      created_at: string
    }
    attribution?: ContactSubmitPayload['attribution']
  }
}

export function buildContactPayloadBundle(
  payload: ContactSubmitPayload,
  storage: StoragePort
): ContactPayloadBundle {
  const enrichedPayload = attachAttributionToPayload(payload, storage)
  const normalizedPhone = normalizePhoneNumber(payload.phoneNumber, payload.country)
  const rawCustomAttributes = {
    first_name: payload.firstName,
    last_name: payload.lastName,
    company: payload.company,
    city: payload.city,
    country: payload.country,
    ...(payload.phoneNumber && !normalizedPhone ? { phone_raw: payload.phoneNumber } : {})
  }
  const customAttributes = sanitizeCustomAttributes(rawCustomAttributes)

  return {
    normalizedPhone,
    customAttributes,
    chatwootPayload: {
      name: enrichedPayload.name,
      email: enrichedPayload.email,
      phone_number: normalizedPhone,
      custom_attributes: customAttributes
    },
    backendPayload: {
      firstName: payload.firstName,
      lastName: payload.lastName,
      name: enrichedPayload.name,
      email: enrichedPayload.email,
      phoneNumber: payload.phoneNumber,
      city: payload.city,
      country: payload.country,
      company: payload.company,
      custom_attributes: customAttributes,
      meta: {
        page_location: payload.pageLocation,
        traffic_source: payload.trafficSource,
        user_agent: payload.userAgent,
        created_at: payload.createdAt
      },
      attribution: enrichedPayload.attribution
    }
  }
}

export function hasCustomAttributes(attrs: Record<string, string>): boolean {
  return Object.keys(attrs).length > 0
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

function normalizePhoneNumber(
  phoneNumber: string | undefined,
  country: string | undefined
): string | undefined {
  if (!phoneNumber) {
    return undefined
  }

  const trimmed = phoneNumber.trim()
  if (!trimmed) {
    return undefined
  }

  if (trimmed.startsWith('+')) {
    const digits = trimmed.replace(/[^\d]/g, '')
    if (digits.length < 8 || digits.length > 15) {
      return undefined
    }
    return `+${digits}`
  }

  const digits = trimmed.replace(/[^\d]/g, '')
  if (!digits) {
    return undefined
  }

  const normalizedCountry = country?.trim().toLowerCase()
  const isArgentina = !normalizedCountry || normalizedCountry === 'argentina' || normalizedCountry === 'ar'

  if (isArgentina) {
    let normalized = digits
    if (normalized.startsWith('0')) {
      normalized = normalized.slice(1)
    }
    if (normalized.startsWith('54')) {
      normalized = normalized.slice(2)
    }
    if (normalized.length >= 8 && normalized.length <= 13) {
      return `+54${normalized}`
    }
    return undefined
  }

  // For non-AR numbers we require explicit international prefix.
  return undefined
}
