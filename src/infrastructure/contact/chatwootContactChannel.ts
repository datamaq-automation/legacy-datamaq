import type { HttpClient, HttpResponse } from '@/application/ports/HttpClient'
import { hasCustomAttributes, type ContactPayloadBundle } from './contactPayloadBuilder'

export async function submitChatwootContact(
  http: HttpClient,
  apiUrl: string,
  payloads: ContactPayloadBundle,
  headers?: Record<string, string>
): Promise<HttpResponse> {
  const response = await http.postJson(apiUrl, payloads.chatwootPayload, headers)

  if (!response.ok) {
    return response
  }

  const contactIdentifier = extractContactIdentifier(response.data, response.text)
  if (contactIdentifier && hasCustomAttributes(payloads.customAttributes)) {
    const updateUrl = buildChatwootContactUpdateUrl(apiUrl, contactIdentifier)
    await http.patchJson(
      updateUrl,
      {
        custom_attributes: payloads.customAttributes,
        phone_number: payloads.normalizedPhone
      },
      headers
    )
  }

  return response
}

function extractContactIdentifier(data: unknown, text?: string): string | null {
  const identifierFromData = parseIdentifierRecord(data)
  if (identifierFromData) {
    return identifierFromData
  }

  if (!text) {
    return null
  }

  try {
    const parsed = JSON.parse(text) as { source_id?: string; id?: number | string }
    return parseIdentifierRecord(parsed)
  } catch {
    return null
  }
}

function parseIdentifierRecord(data: unknown): string | null {
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
