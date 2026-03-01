import { describe, expect, it } from 'vitest'

const FASTAPI_CONTRACT_BASE_URL = normalizeBaseUrl(process.env.FASTAPI_CONTRACT_BASE_URL)
const FASTAPI_CONTRACT_TIMEOUT_MS = Number.parseInt(
  process.env.FASTAPI_CONTRACT_TIMEOUT_MS ?? '15000',
  10
)

type JsonRecord = Record<string, unknown>

describe.skipIf(!FASTAPI_CONTRACT_BASE_URL)('FastAPI contracts', () => {
  it('health endpoint exposes canonical metadata', async () => {
    const response = await fetchWithTimeout(apiUrl('/v1/health'))
    const payload = (await response.json()) as JsonRecord

    expect(response.status).toBe(200)
    expect(payload.status).toBe('ok')
    expect(typeof payload.service).toBe('string')
    expect(typeof payload.brand_id).toBe('string')
    expect(typeof payload.version).toBe('string')
    expect(typeof payload.timestamp).toBe('string')
    expectRequestId(payload)
  })

  it('site endpoint exposes full content, brand and seo snapshot inside data', async () => {
    const response = await fetchWithTimeout(apiUrl('/v1/site'))
    const payload = (await response.json()) as JsonRecord
    const data = asRecord(payload['data'])

    expect(response.status).toBe(200)
    expect(payload.status).toBe('ok')
    expect(typeof payload.brand_id).toBe('string')
    expect(typeof payload.version).toBe('string')
    expect(typeof payload.content_revision).toBe('string')
    expectRequestId(payload)
    expectRecordWithKeys(data, ['content', 'brand', 'seo'])

    const content = asRecord(data?.['content'])
    const brand = asRecord(data?.['brand'])
    const seo = asRecord(data?.['seo'])

    expectRecordWithKeys(content, [
      'hero',
      'services',
      'about',
      'profile',
      'navbar',
      'footer',
      'legal',
      'contact',
      'consent',
      'decisionFlow',
      'thanks',
      'homePage',
      'contactPage'
    ])
    expectRecordWithKeys(brand, ['brandId', 'brandName', 'brandAriaLabel', 'technician', 'whatsappQr'])
    expectRecordWithKeys(seo, ['siteUrl', 'siteName', 'siteDescription', 'siteOgImage', 'siteLocale', 'business'])
  })

  it('pricing endpoint exposes canonical ARS diagnostic price key', async () => {
    const response = await fetchWithTimeout(apiUrl('/v1/pricing'))
    const payload = (await response.json()) as JsonRecord
    const data = asRecord(payload['data'])

    expect(response.status).toBe(200)
    expect(payload.status).toBe('ok')
    expect(payload.version).toBe('v1')
    expect(payload.currency).toBe('ARS')
    expectRequestId(payload)
    expect(typeof data?.['diagnostico_lista_2h_ars']).toBe('number')
  })

  it('contact endpoint creates a durable submission with canonical envelope', async () => {
    const response = await fetchJson('/v1/contact', {
      email: 'contact-contract@example.com',
      phone: '+54 11 5555 4444',
      company: 'DataMaq',
      message: 'Necesito una propuesta para mantenimiento electrico industrial.'
    })
    const payload = (await response.json()) as JsonRecord

    expect(response.status).toBe(201)
    expectRequestId(payload)
    expectSubmissionId(payload)
    expect(payload.status).toBe('accepted')
    expect(payload.processing_status).toBe('queued')
    expect(typeof payload.detail).toBe('string')
  })

  it('mail endpoint creates a durable submission with canonical envelope', async () => {
    const response = await fetchJson('/v1/mail', {
      email: 'mail-contract@example.com',
      message: 'Necesito enviar una consulta por correo con detalle suficiente.'
    })
    const payload = (await response.json()) as JsonRecord

    expect(response.status).toBe(201)
    expectRequestId(payload)
    expectSubmissionId(payload)
    expect(payload.status).toBe('accepted')
    expect(payload.processing_status).toBe('queued')
    expect(typeof payload.detail).toBe('string')
  })

  it('contact endpoint returns canonical validation error shape', async () => {
    const response = await fetchJson('/v1/contact', {
      email: 'invalid-email',
      message: 'Mensaje valido en longitud para forzar error de email.'
    })
    const payload = (await response.json()) as JsonRecord

    expect(response.status).toBe(422)
    expectRequestId(payload)
    expect(payload.status).toBe('rejected')
    expect(payload.processing_status).toBe('failed')
    expect(typeof payload.detail).toBe('string')
    expect(typeof payload.code).toBe('string')
  })

  it('quote diagnostic endpoint returns canonical quote payload', async () => {
    const response = await fetchJson('/v1/quote/diagnostic', {
      company: 'ACME',
      contact_name: 'Juan Perez',
      locality: 'Escobar',
      scheduled: true,
      access_ready: true,
      safe_window_confirmed: true,
      bureaucracy: 'medium'
    })
    const payload = (await response.json()) as JsonRecord

    expect(response.status).toBe(200)
    expect(String(payload.quote_id)).toMatch(/^Q-\d{8}-\d{6}$/)
    expect(typeof payload.list_price_ars).toBe('number')
    expect(typeof payload.final_price_ars).toBe('number')
    expect(typeof payload.deposit_ars).toBe('number')
    expect(typeof payload.valid_until).toBe('string')
    expect(typeof payload.whatsapp_message).toBe('string')
    expect(typeof payload.whatsapp_url).toBe('string')
  })

  it('quote diagnostic endpoint returns FastAPI-style validation detail[]', async () => {
    const response = await fetchJson('/v1/quote/diagnostic', {
      company: '',
      contact_name: 'Juan Perez',
      locality: 'Escobar',
      scheduled: true,
      access_ready: true,
      safe_window_confirmed: true
    })
    const payload = (await response.json()) as JsonRecord

    expect(response.status).toBe(422)
    expect(Array.isArray(payload.detail)).toBe(true)
    expect(asRecordArray(payload.detail)[0]).toEqual(
      expect.objectContaining({
        loc: expect.any(Array),
        msg: expect.any(String)
      })
    )
  })

  it('quote pdf endpoint serves application/pdf with attachment filename', async () => {
    const quoteResponse = await fetchJson('/v1/quote/diagnostic', {
      company: 'ACME',
      contact_name: 'Juan Perez',
      locality: 'Escobar',
      scheduled: true,
      access_ready: true,
      safe_window_confirmed: true,
      bureaucracy: 'medium'
    })
    const quotePayload = (await quoteResponse.json()) as JsonRecord
    const quoteId = String(quotePayload.quote_id)

    const pdfResponse = await fetchWithTimeout(apiUrl(`/v1/quote/${encodeURIComponent(quoteId)}/pdf`), {
      headers: {
        Accept: 'application/pdf, application/json'
      }
    })

    expect(pdfResponse.status).toBe(200)
    expect(pdfResponse.headers.get('content-type')).toContain('application/pdf')
    expect(pdfResponse.headers.get('content-disposition')).toContain(`quote-${quoteId}.pdf`)
    expect(pdfResponse.headers.get('x-request-id')).toBeTruthy()
    expect(pdfResponse.headers.get('cache-control')).toBe('no-store')
    expect(pdfResponse.headers.get('x-content-type-options')).toBe('nosniff')
  })
})

function apiUrl(pathname: string): string {
  return `${FASTAPI_CONTRACT_BASE_URL}${pathname.startsWith('/') ? pathname : `/${pathname}`}`
}

async function fetchJson(pathname: string, payload: unknown): Promise<Response> {
  return fetchWithTimeout(apiUrl(pathname), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
}

async function fetchWithTimeout(input: string, init?: RequestInit): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), FASTAPI_CONTRACT_TIMEOUT_MS)

  try {
    return await fetch(input, {
      ...init,
      signal: controller.signal
    })
  } finally {
    clearTimeout(timeoutId)
  }
}

function expectRequestId(payload: JsonRecord): void {
  expect(typeof payload.request_id).toBe('string')
  expect(String(payload.request_id)).not.toHaveLength(0)
}

function expectSubmissionId(payload: JsonRecord): void {
  expect(typeof payload.submission_id).toBe('string')
  expect(String(payload.submission_id)).not.toHaveLength(0)
}

function expectRecordWithKeys(value: unknown, keys: string[]): void {
  const record = asRecord(value)
  expect(record).toBeTruthy()
  keys.forEach((key) => {
    expect(record).toHaveProperty(key)
  })
}

function asRecord(value: unknown): JsonRecord | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null
  }
  return value as JsonRecord
}

function asRecordArray(value: unknown): JsonRecord[] {
  if (!Array.isArray(value)) {
    return []
  }
  return value.filter((entry): entry is JsonRecord => Boolean(asRecord(entry)))
}

function normalizeBaseUrl(value: string | undefined): string | undefined {
  const normalized = value?.trim()
  if (!normalized) {
    return undefined
  }
  return normalized.replace(/\/+$/, '')
}
