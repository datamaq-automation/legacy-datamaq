import type { ContactSubmitPayload } from '@/application/dto/contact'
import type { StoragePort } from '@/application/ports/Storage'
import { attachAttributionToPayload } from '@/infrastructure/attribution/utm'

export interface ContactPayloadBundle {
  backendPayload: {
    name: string
    email?: string
    message: string
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

  return {
    backendPayload: {
      name: enrichedPayload.name,
      ...(enrichedPayload.email ? { email: enrichedPayload.email } : {}),
      message: payload.comment,
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
