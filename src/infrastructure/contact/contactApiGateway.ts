import type { ContactGateway } from '@/application/contact/ports/ContactGateway'
import type { ContactSubmitPayload } from '@/application/dto/contact'
import type { Result } from '@/domain/shared/result'
import type { ContactError } from '@/application/types/errors'
import type { HttpClient } from '@/application/ports/HttpClient'
import type { ConfigPort } from '@/application/ports/Config'
import type { LoggerPort } from '@/application/ports/Logger'
import type { StoragePort } from '@/application/ports/Storage'
import { attachAttributionToPayload } from '@/infrastructure/attribution/utm'
import { buildChatwootContactPayload } from '@/application/contact/chatwootPayload'

export class ContactApiGateway implements ContactGateway {
  constructor(
    private http: HttpClient,
    private config: ConfigPort,
    private storage: StoragePort,
    private logger: LoggerPort
  ) {}

  async submit(payload: ContactSubmitPayload): Promise<Result<void, ContactError>> {
    const apiUrl = this.config.contactApiUrl
    if (!apiUrl) {
      this.logger.error('CONTACT_API_URL no esta configurada')
      return { ok: false, error: { type: 'Unavailable' } }
    }

    const enrichedPayload = attachAttributionToPayload(payload, this.storage)
    const originVerify = this.config.originVerifySecret
    const headers = originVerify ? { 'X-Origin-Verify': originVerify } : undefined
    const normalizedPhone = normalizePhoneNumber(payload.phoneNumber, payload.country)
    const rawCustomAttributes = {
      first_name: payload.firstName,
      last_name: payload.lastName,
      company: payload.company,
      city: payload.city,
      country: payload.country,
      ...(payload.phoneNumber && !normalizedPhone
        ? { phone_raw: payload.phoneNumber }
        : {})
    }
    const sanitizedCustomAttributes = sanitizeCustomAttributes(rawCustomAttributes)
    // Forzar envio de custom_attributes aunque esten vacios/compatibilidad con Chatwoot.
    const chatwootPayload = {
      name: enrichedPayload.name,
      email: enrichedPayload.email,
      phone_number: normalizedPhone,
      custom_attributes: sanitizedCustomAttributes
    }
    const backendPayload = {
      firstName: payload.firstName,
      lastName: payload.lastName,
      name: enrichedPayload.name,
      email: enrichedPayload.email,
      phoneNumber: payload.phoneNumber,
      city: payload.city,
      country: payload.country,
      company: payload.company,
      custom_attributes: sanitizedCustomAttributes,
      meta: {
        page_location: payload.pageLocation,
        traffic_source: payload.trafficSource,
        user_agent: payload.userAgent,
        created_at: payload.createdAt
      }
    }
    const looksLikeChatwootPublicEndpoint =
      apiUrl.includes('/public/api/v1/inboxes/') && apiUrl.endsWith('/contacts')
    const outgoingPayload = looksLikeChatwootPublicEndpoint
      ? chatwootPayload
      : backendPayload
    const response = await this.http.postJson(apiUrl, outgoingPayload, headers)

    if (!response.ok) {
      this.logger.warn('[contactApiGateway] response no OK', {
        status: response.status
      })
      return {
        ok: false,
        error: {
          type: response.status === 0 ? 'NetworkError' : 'BackendError',
          status: response.status
        }
      }
    }

    if (looksLikeChatwootPublicEndpoint) {
      const contactIdentifier = extractContactIdentifier(response.data, response.text)
      if (contactIdentifier && hasCustomAttributes(sanitizedCustomAttributes)) {
        const updateUrl = buildChatwootContactUpdateUrl(apiUrl, contactIdentifier)
        const updateResponse = await this.http.patchJson(
          updateUrl,
          {
            custom_attributes: sanitizedCustomAttributes,
            phone_number: normalizedPhone
          },
          headers
        )
      }
    }

    return { ok: true, data: undefined }
  }
}

function sanitizeCustomAttributes(
  attrs: Record<string, unknown>
): Record<string, string> {
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

function extractContactIdentifier(
  data: unknown,
  text?: string
): string | null {
  const identifierFromData = parseIdentifierRecord(data)
  if (identifierFromData) {
    return identifierFromData
  }

  if (text) {
    try {
      const parsed = JSON.parse(text) as { source_id?: string; id?: number | string }
      return parseIdentifierRecord(parsed)
    } catch {
      return null
    }
  }

  return null
}

function parseIdentifierRecord(
  data: unknown
): string | null {
  if (!data || typeof data !== 'object') {
    return null
  }
  const record = data as { source_id?: string; id?: number | string }
  if (record.source_id) {
    return record.source_id
  }
  if (record.id) {
    return String(record.id)
  }
  return null
}

function buildChatwootContactUpdateUrl(apiUrl: string, identifier: string): string {
  if (apiUrl.endsWith('/contacts')) {
    return `${apiUrl}/${identifier}`
  }
  return `${apiUrl.replace(/\/contacts.*$/, '/contacts')}/${identifier}`
}

function hasCustomAttributes(
  attrs: Record<string, string>
): boolean {
  return Object.keys(attrs).length > 0
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

  const isArgentina =
    !country ||
    country.trim().toLowerCase() === 'argentina' ||
    country.trim().toLowerCase() === 'ar'

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

  // Para otros paises, exigimos prefijo internacional.
  return undefined
}
