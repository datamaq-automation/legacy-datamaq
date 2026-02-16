#!/usr/bin/env node

import process from 'node:process'

const urlFromArg = process.argv[2]
const urlFromEnv = process.env.INQUIRY_API_URL ?? process.env.VITE_INQUIRY_API_URL
const endpoint = (urlFromArg ?? urlFromEnv ?? '').trim()
const CHATWOOT_PUBLIC_CONTACTS_PATTERN = /\/public\/api\/v1\/inboxes\/[^/]+\/contacts\/?$/i

if (!endpoint) {
  console.error('Uso: node scripts/smoke-contact-backend.mjs <INQUIRY_API_URL>')
  console.error(
    'Tambien podes definir INQUIRY_API_URL o VITE_INQUIRY_API_URL en el entorno.'
  )
  process.exit(1)
}

if (!/^https?:\/\//i.test(endpoint)) {
  console.error(`Endpoint invalido: ${endpoint}`)
  console.error('Debe iniciar con http:// o https://')
  process.exit(1)
}

const now = new Date().toISOString()

const legacyPayload = {
  firstName: 'Smoke',
  lastName: 'Datamaq',
  name: 'Smoke Datamaq',
  email: 'smoke@datamaq.com.ar',
  phoneNumber: '+5491100000000',
  city: 'Escobar',
  country: 'AR',
  company: 'DataMaq',
  custom_attributes: {
    source: 'frontend-smoke-script'
  },
  meta: {
    page_location: 'https://www.datamaq.com.ar',
    traffic_source: 'smoke-script',
    user_agent: 'smoke-contact-backend-script',
    created_at: now
  },
  attribution: {}
}

const chatwootContactPayload = {
  identifier: 'smoke@datamaq.com.ar',
  name: 'Smoke Datamaq',
  email: 'smoke@datamaq.com.ar',
  custom_attributes: {
    source: 'frontend-smoke-script',
    page_location: 'https://www.datamaq.com.ar',
    traffic_source: 'smoke-script',
    created_at: now
  }
}

const controller = new AbortController()
const timeout = setTimeout(() => controller.abort(), 15000)

try {
  if (isChatwootPublicContactsEndpoint(endpoint)) {
    const contactResponse = await postJson(endpoint, chatwootContactPayload, controller.signal)
    if (!contactResponse.ok) {
      reportFailure(contactResponse)
      process.exit(1)
    }

    const contactData = parseJson(contactResponse.text)
    const contactIdentifier = readStringValue(contactData?.source_id)
    if (!contactIdentifier) {
      console.error('Smoke FAIL: Chatwoot no devolvio source_id en create-contact')
      process.exit(1)
    }

    const conversationsEndpoint = `${stripTrailingSlash(endpoint)}/${encodeURIComponent(contactIdentifier)}/conversations`
    const conversationResponse = await postJson(
      conversationsEndpoint,
      {
        custom_attributes: {
          source: 'frontend-smoke-script',
          traffic_source: 'smoke-script'
        }
      },
      controller.signal
    )
    if (!conversationResponse.ok) {
      reportFailure(conversationResponse)
      process.exit(1)
    }

    const conversationData = parseJson(conversationResponse.text)
    const conversationId = readStringValue(conversationData?.id)
    if (!conversationId) {
      console.error('Smoke FAIL: Chatwoot no devolvio id en create-conversation')
      process.exit(1)
    }

    const messagesEndpoint = `${conversationsEndpoint}/${encodeURIComponent(conversationId)}/messages`
    const messageResponse = await postJson(
      messagesEndpoint,
      {
        content: `Smoke test DataMaq (${now})`
      },
      controller.signal
    )
    if (!messageResponse.ok) {
      reportFailure(messageResponse)
      process.exit(1)
    }

    console.log(`Smoke OK: Chatwoot Public API flow completo (${messageResponse.status})`)
    if (messageResponse.preview) {
      console.log(messageResponse.preview)
    }
  } else {
    const response = await postJson(endpoint, legacyPayload, controller.signal)
    if (!response.ok) {
      reportFailure(response)
      process.exit(1)
    }
    console.log(`Smoke OK: ${response.status} ${response.statusText}`)
    if (response.preview) {
      console.log(response.preview)
    }
  }
} catch (error) {
  if (error instanceof Error && error.name === 'AbortError') {
    console.error('Smoke FAIL: timeout (15s)')
  } else if (error instanceof Error) {
    console.error(`Smoke FAIL: ${error.message}`)
  } else {
    console.error('Smoke FAIL: error desconocido')
  }
  process.exit(1)
} finally {
  clearTimeout(timeout)
}

function isChatwootPublicContactsEndpoint(url) {
  return CHATWOOT_PUBLIC_CONTACTS_PATTERN.test(stripQueryAndHash(url))
}

function stripTrailingSlash(value) {
  return value.endsWith('/') ? value.slice(0, -1) : value
}

function stripQueryAndHash(value) {
  return value.split(/[?#]/, 1)[0]
}

function parseJson(value) {
  if (!value) {
    return undefined
  }
  try {
    return JSON.parse(value)
  } catch {
    return undefined
  }
}

function readStringValue(value) {
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

async function postJson(url, payload, signal) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload),
    signal
  })

  const text = await response.text()
  const preview = text.slice(0, 500)

  return {
    ok: response.ok,
    status: response.status,
    statusText: response.statusText,
    text,
    preview
  }
}

function reportFailure(response) {
  console.error(`Smoke FAIL: ${response.status} ${response.statusText}`)
  if (response.preview) {
    console.error(response.preview)
  }
}
