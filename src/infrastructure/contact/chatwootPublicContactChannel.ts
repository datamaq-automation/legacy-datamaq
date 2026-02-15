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
      text: 'Chatwoot no devolvio source_id para el contacto.'
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
      text: 'Chatwoot no devolvio id de conversacion.'
    }
  }

  const messagesEndpoint = `${conversationsEndpoint}/${encodeURIComponent(conversationId)}/messages`
  return http.postJson(messagesEndpoint, buildMessagePayload(payloads))
}

function buildChatwootContactPayload(payloads: ContactPayloadBundle) {
  const payload = payloads.backendPayload
  return {
    identifier: payload.email.trim().toLowerCase(),
    name: payload.name,
    email: payload.email,
    ...(payload.normalizedPhoneNumber ? { phone_number: payload.normalizedPhoneNumber } : {}),
    custom_attributes: {
      ...payload.custom_attributes,
      source: 'landing_form',
      page_location: payload.meta.page_location,
      traffic_source: payload.meta.traffic_source,
      created_at: payload.meta.created_at
    }
  }
}

function buildConversationPayload(payloads: ContactPayloadBundle) {
  const payload = payloads.backendPayload
  return {
    custom_attributes: {
      source: 'landing_form',
      page_location: payload.meta.page_location,
      traffic_source: payload.meta.traffic_source
    }
  }
}

function buildMessagePayload(payloads: ContactPayloadBundle) {
  const payload = payloads.backendPayload
  const lines = [
    'Nueva consulta desde landing DataMaq.',
    `Nombre: ${payload.name}`,
    `Email: ${payload.email}`,
    `Telefono: ${payload.normalizedPhoneNumber ?? payload.phoneNumber ?? 'No informado'}`,
    `Empresa: ${payload.company ?? 'No informada'}`,
    `Ciudad: ${payload.city ?? 'No informada'}`,
    `Pais: ${payload.country ?? 'No informado'}`,
    `Origen: ${payload.meta.traffic_source}`,
    `Pagina: ${payload.meta.page_location}`,
    `Fecha: ${payload.meta.created_at}`
  ]

  return {
    content: lines.join('\n')
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
