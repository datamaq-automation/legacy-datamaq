#!/usr/bin/env node

import process from 'node:process'

const urlFromArg = process.argv[2]
const urlFromEnv = process.env.CONTACT_API_URL ?? process.env.VITE_CONTACT_API_URL
const endpoint = (urlFromArg ?? urlFromEnv ?? '').trim()

if (!endpoint) {
  console.error('Uso: node scripts/smoke-contact-backend.mjs <CONTACT_API_URL>')
  console.error(
    'Tambien podes definir CONTACT_API_URL o VITE_CONTACT_API_URL en el entorno.'
  )
  process.exit(1)
}

if (!/^https?:\/\//i.test(endpoint)) {
  console.error(`Endpoint invalido: ${endpoint}`)
  console.error('Debe iniciar con http:// o https://')
  process.exit(1)
}

const now = new Date().toISOString()

const payload = {
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

const controller = new AbortController()
const timeout = setTimeout(() => controller.abort(), 15000)

try {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload),
    signal: controller.signal
  })

  const bodyText = await response.text()
  const bodyPreview = bodyText.slice(0, 500)

  if (!response.ok) {
    console.error(`Smoke FAIL: ${response.status} ${response.statusText}`)
    if (bodyPreview) {
      console.error(bodyPreview)
    }
    process.exit(1)
  }

  console.log(`Smoke OK: ${response.status} ${response.statusText}`)
  if (bodyPreview) {
    console.log(bodyPreview)
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
