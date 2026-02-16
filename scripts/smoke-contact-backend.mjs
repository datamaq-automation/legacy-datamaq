#!/usr/bin/env node

import process from 'node:process'

const urlFromArg = process.argv[2]
const urlFromEnv = process.env.INQUIRY_API_URL ?? process.env.VITE_INQUIRY_API_URL
const endpoint = (urlFromArg ?? urlFromEnv ?? '').trim()

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

const backendPayload = {
  name: 'Smoke Datamaq',
  email: 'smoke@datamaq.com.ar',
  message: `Smoke test DataMaq (${now})`,
  custom_attributes: {
    source: 'frontend-smoke-script',
    message: `Smoke test DataMaq (${now})`
  },
  meta: {
    page_location: 'https://www.datamaq.com.ar',
    traffic_source: 'smoke-script',
    user_agent: 'smoke-contact-backend-script',
    created_at: now
  },
  attribution: {}
}

const controller = new AbortController()
const timeout = setTimeout(() => controller.abort(), 15000)

try {
  const response = await postJson(endpoint, backendPayload, controller.signal)
  if (!response.ok) {
    reportFailure(response)
    process.exit(1)
  }
  console.log(`Smoke OK: ${response.status} ${response.statusText}`)
  if (response.preview) {
    console.log(response.preview)
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
