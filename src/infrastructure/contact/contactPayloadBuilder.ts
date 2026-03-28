import type { ContactSubmitPayload } from '@/application/dto/contact'
import type { StoragePort } from '@/application/ports/Storage'
import { attachAttributionToPayload } from '@/infrastructure/attribution/utm'

export interface ContactPayloadBundle {
  backendPayload: {
    name: string
    email?: string
    message: string
    custom_attributes: Record<string, string>
    captcha_token?: string
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
  const customAttributes = sanitizeCustomAttributes({
    first_name: payload.firstName,
    last_name: payload.lastName,
    company: payload.company,
    phone: payload.phone,
    geographic_location: payload.geographicLocation,
    comment: payload.comment,
    message: payload.comment
  })

  return {
    backendPayload: {
      name: enrichedPayload.name,
      ...(enrichedPayload.email ? { email: enrichedPayload.email } : {}),
      message: payload.comment,
      custom_attributes: customAttributes,
      ...(enrichedPayload.captchaToken ? { captcha_token: enrichedPayload.captchaToken } : {}),
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
