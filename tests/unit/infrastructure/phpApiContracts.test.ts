import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process'
import path from 'node:path'

const HOST = '127.0.0.1'
const PORT = 8899
const BASE_URL = `http://${HOST}:${PORT}/api`

let phpServer: ChildProcessWithoutNullStreams | undefined

describe('PHP API contracts', () => {
  beforeAll(async () => {
    phpServer = spawn('php', ['-S', `${HOST}:${PORT}`, '-t', 'public'], {
      cwd: path.resolve(process.cwd()),
      stdio: 'pipe'
    })
    await waitForServerReady()
  }, 20_000)

  afterAll(() => {
    if (phpServer && !phpServer.killed) {
      phpServer.kill()
    }
  })

  it('contact.php accepts POST and returns request_id', async () => {
    const response = await fetch(`${BASE_URL}/contact.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'user@example.com',
        message: 'Hola desde contrato'
      })
    })
    const payload = (await response.json()) as Record<string, unknown>

    expect(response.status).toBe(202)
    expect(payload.status).toBe('ok')
    expect(typeof payload.request_id).toBe('string')
  })

  it('mail.php rejects invalid method with standardized error shape', async () => {
    const response = await fetch(`${BASE_URL}/mail.php`, { method: 'GET' })
    const payload = (await response.json()) as Record<string, unknown>

    expect(response.status).toBe(405)
    expect(payload.status).toBe('error')
    expect(typeof payload.request_id).toBe('string')
    expect(payload.error_code).toBe('METHOD_NOT_ALLOWED')
    expect(typeof payload.detail).toBe('string')
  })

  it('pricing.php exposes diagnostico_lista_2h_ars', async () => {
    const response = await fetch(`${BASE_URL}/pricing.php`)
    const payload = (await response.json()) as {
      request_id?: unknown
      version?: unknown
      currency?: unknown
      data?: Record<string, unknown>
    }

    expect(response.status).toBe(200)
    expect(typeof payload.request_id).toBe('string')
    expect(payload.version).toBe('v1')
    expect(payload.currency).toBe('ARS')
    expect(payload.data?.diagnostico_lista_2h_ars).toBeTypeOf('number')
  })

  it('health.php includes request_id', async () => {
    const response = await fetch(`${BASE_URL}/health.php`)
    const payload = (await response.json()) as { request_id?: unknown; status?: unknown }

    expect(response.status).toBe(200)
    expect(payload.status).toBe('ok')
    expect(typeof payload.request_id).toBe('string')
  })

  it('content.php exposes full AppContent contract', async () => {
    const response = await fetch(`${BASE_URL}/content.php`)
    const payload = (await response.json()) as {
      data?: {
        hero?: { title?: unknown; subtitle?: unknown; primaryCta?: { href?: unknown } }
        services?: { cards?: unknown[] }
        about?: { paragraphs?: unknown[] }
        contact?: { labels?: { email?: unknown; message?: unknown } }
        decisionFlow?: {
          processSteps?: unknown[]
          faqItems?: unknown[]
          processTitle?: unknown
          processStepPrefixLabel?: unknown
          pricingIncludesTitle?: unknown
          pricingExcludesTitle?: unknown
          pricingVariablesTitle?: unknown
          coverageAreasTitle?: unknown
          responseTimesTitle?: unknown
        }
        thanks?: { title?: unknown; goHomeButtonLabel?: unknown }
      }
    }

    expect(response.status).toBe(200)
    expect(typeof payload.data?.hero?.title).toBe('string')
    expect(String(payload.data?.hero?.title)).not.toHaveLength(0)
    expect(typeof payload.data?.hero?.subtitle).toBe('string')
    expect(typeof payload.data?.hero?.primaryCta?.href).toBe('string')
    expect(Array.isArray(payload.data?.services?.cards)).toBe(true)
    expect((payload.data?.services?.cards ?? []).length).toBeGreaterThan(0)
    expect(Array.isArray(payload.data?.about?.paragraphs)).toBe(true)
    expect(typeof payload.data?.contact?.labels?.email).toBe('string')
    expect(typeof payload.data?.contact?.labels?.message).toBe('string')
    expect(typeof payload.data?.decisionFlow?.processTitle).toBe('string')
    expect(typeof payload.data?.decisionFlow?.processStepPrefixLabel).toBe('string')
    expect(typeof payload.data?.decisionFlow?.pricingIncludesTitle).toBe('string')
    expect(typeof payload.data?.decisionFlow?.pricingExcludesTitle).toBe('string')
    expect(typeof payload.data?.decisionFlow?.pricingVariablesTitle).toBe('string')
    expect(typeof payload.data?.decisionFlow?.coverageAreasTitle).toBe('string')
    expect(typeof payload.data?.decisionFlow?.responseTimesTitle).toBe('string')
    expect(Array.isArray(payload.data?.decisionFlow?.processSteps)).toBe(true)
    expect(Array.isArray(payload.data?.decisionFlow?.faqItems)).toBe(true)
    expect(typeof payload.data?.thanks?.title).toBe('string')
    expect(typeof payload.data?.thanks?.goHomeButtonLabel).toBe('string')
  })

  it('quote/diagnostic.php returns expected quote payload', async () => {
    const response = await fetch(`${BASE_URL}/quote/diagnostic.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        company: 'ACME',
        contact_name: 'Juan',
        locality: 'Escobar',
        scheduled: true,
        access_ready: true,
        safe_window_confirmed: true
      })
    })
    const payload = (await response.json()) as Record<string, unknown>

    expect(response.status).toBe(200)
    expect(payload.quote_id).toMatch(/^Q-\d{8}-\d{6}$/)
    expect(payload.final_price_ars).toBeTypeOf('number')
    expect(payload.whatsapp_url).toBeTypeOf('string')
  })

  it('quote/pdf.php serves application/pdf when quote_id is valid', async () => {
    const response = await fetch(`${BASE_URL}/quote/pdf.php?quote_id=Q-20260226-000001`)

    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toContain('application/pdf')
    expect(response.headers.get('content-disposition')).toContain('quote-Q-20260226-000001.pdf')
  })

  it('quote/pdf.php returns standardized validation error when quote_id is missing', async () => {
    const response = await fetch(`${BASE_URL}/quote/pdf.php`)
    const payload = (await response.json()) as Record<string, unknown>

    expect(response.status).toBe(422)
    expect(payload.status).toBe('error')
    expect(payload.error_code).toBe('VALIDATION_ERROR')
    expect(typeof payload.request_id).toBe('string')
    expect(typeof payload.detail).toBe('string')
  })

  it('contact.php rejects invalid email format', async () => {
    const response = await fetch(`${BASE_URL}/contact.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'not-an-email',
        message: 'Mensaje suficientemente largo'
      })
    })
    const payload = (await response.json()) as Record<string, unknown>

    expect(response.status).toBe(422)
    expect(payload.status).toBe('error')
    expect(payload.error_code).toBe('VALIDATION_ERROR')
  })

  it('mail.php rejects short messages', async () => {
    const response = await fetch(`${BASE_URL}/mail.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'user@example.com',
        message: 'corto'
      })
    })
    const payload = (await response.json()) as Record<string, unknown>

    expect(response.status).toBe(422)
    expect(payload.status).toBe('error')
    expect(payload.error_code).toBe('VALIDATION_ERROR')
  })

  it('handles CORS preflight for contact.php', async () => {
    const response = await fetch(`${BASE_URL}/contact.php`, {
      method: 'OPTIONS',
      headers: {
        Origin: 'http://localhost:5173',
        'Access-Control-Request-Method': 'POST'
      }
    })

    expect(response.status).toBe(204)
    expect(response.headers.get('access-control-allow-origin')).toBe('http://localhost:5173')
  })
})

async function waitForServerReady(): Promise<void> {
  const maxAttempts = 30
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const response = await fetch(`${BASE_URL}/health.php`)
      if (response.ok) {
        return
      }
    } catch {
      // wait and retry until server is available
    }
    await sleep(200)
  }
  throw new Error('PHP server did not start in time for contract tests')
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

