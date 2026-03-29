import type { HttpClient, HttpResponse } from '@/application/ports/HttpClient'
import type { ContactPayloadBundle } from './contactPayloadBuilder'

const CHATWOOT_PUBLIC_CONTACTS_PATTERN = /\/public\/api\/v1\/inboxes\/[^/]+\/contacts\/?$/i
const MISSING_DATA_STATUS = 502

interface ChatwootContactResponse {
  source_id?: string | number
}

interface ChatwootConversationResponse {
  id?: string | number
}

export function isChatwootPublicContactsEndpoint(apiUrl: string): boolean {
  return CHATWOOT_PUBLIC_CONTACTS_PATTERN.test(stripQueryAndHash(apiUrl))
}

export async function submitChatwootPublicContact(
  http: HttpClient,
  apiUrl: string,
  payloads: ContactPayloadBundle
): Promise<HttpResponse> {
  const contactsEndpoint = stripTrailingSlash(stripQueryAndHash(apiUrl))
  const contactResponse = await http.postJson<ChatwootContactResponse>(
    contactsEndpoint,
    buildChatwootContactPayload(payloads)
  )

  if (!contactResponse.ok) {
    return contactResponse
  }

  const contactIdentifier = readStringValue(contactResponse.data?.source_id)
  if (!contactIdentifier) {
    return {
      ok: false,
      status: MISSING_DATA_STATUS,
      text: 'Chatwoot no devolvio source_id para create-contact.'
    }
  }

  const conversationsEndpoint = `${contactsEndpoint}/${encodeURIComponent(contactIdentifier)}/conversations`
  const conversationResponse = await http.postJson<ChatwootConversationResponse>(
    conversationsEndpoint,
    buildConversationPayload(payloads)
  )

  if (!conversationResponse.ok) {
    return conversationResponse
  }

  const conversationId = readStringValue(conversationResponse.data?.id)
  if (!conversationId) {
    return {
      ok: false,
      status: MISSING_DATA_STATUS,
      text: 'Chatwoot no devolvio id para create-conversation.'
    }
  }

  const messagesEndpoint = `${conversationsEndpoint}/${encodeURIComponent(conversationId)}/messages`
  return http.postJson(messagesEndpoint, buildMessagePayload(payloads))
}

function buildChatwootContactPayload(payloads: ContactPayloadBundle) {
  const payload = payloads.backendPayload
  const customAttributes = payload.custom_attributes ?? {}
  const pageLocation = readStringValue(customAttributes['page_location'])
  const trafficSource = readStringValue(customAttributes['traffic_source'])
  const createdAt = readStringValue(customAttributes['created_at'])
  const fallbackIdentifier =
    customAttributes['phone']?.replace(/\s+/g, '') ?? payload.name.trim()

  return {
    identifier: payload.email?.trim().toLowerCase() ?? fallbackIdentifier,
    name: payload.name,
    ...(payload.email ? { email: payload.email } : {}),
    custom_attributes: {
      ...customAttributes,
      source: 'landing_form',
      ...(pageLocation ? { page_location: pageLocation } : {}),
      ...(trafficSource ? { traffic_source: trafficSource } : {}),
      ...(createdAt ? { created_at: createdAt } : {})
    }
  }
}

function buildConversationPayload(payloads: ContactPayloadBundle) {
  const payload = payloads.backendPayload
  const customAttributes = payload.custom_attributes ?? {}
  const pageLocation = readStringValue(customAttributes['page_location'])
  const trafficSource = readStringValue(customAttributes['traffic_source'])
  return {
    custom_attributes: {
      source: 'landing_form',
      ...(pageLocation ? { page_location: pageLocation } : {}),
      ...(trafficSource ? { traffic_source: trafficSource } : {})
    }
  }
}

function buildMessagePayload(payloads: ContactPayloadBundle) {
  return {
    content: payloads.backendPayload.message
  }
}

function readStringValue(value: string | number | undefined): string | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value)
  }

  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (trimmed) {
      return trimmed
    }
  }

  return undefined
}

function stripTrailingSlash(value: string): string {
  return value.endsWith('/') ? value.slice(0, -1) : value
}

function stripQueryAndHash(value: string): string {
  return value.split(/[?#]/, 1)[0] ?? value
}
