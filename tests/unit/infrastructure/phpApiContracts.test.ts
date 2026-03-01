// Legacy contract snapshot for the current PHP/Laravel-style backend.
// Keep this suite as a reference of current behavior until an equivalent FastAPI contract suite replaces it.
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process'
import { existsSync } from 'node:fs'
import path from 'node:path'

const HOST = '127.0.0.1'
const PORT = Number(process.env.PHP_API_TEST_PORT ?? 8899)
const BASE_URL = `http://${HOST}:${PORT}`
const SERVER_BOOT_TIMEOUT_MS = Number(process.env.PHP_API_BOOT_TIMEOUT_MS ?? 30_000)
const SERVER_POLL_INTERVAL_MS = Number(process.env.PHP_API_BOOT_POLL_MS ?? 250)
const SERVER_LOG_LINES = 40
const PHP_API_V1_ROOT = path.resolve(process.cwd(), 'public', 'api', 'v1')
const HAS_LOCAL_PHP_API =
  existsSync(path.join(PHP_API_V1_ROOT, 'health.php')) || existsSync(path.join(PHP_API_V1_ROOT, 'health'))

let phpServer: ChildProcessWithoutNullStreams | undefined
let apiRouteMode: 'pretty' | 'php' = 'pretty'
let phpServerStdout = ''
let phpServerStderr = ''
let phpServerExit: { code: number | null; signal: NodeJS.Signals | null } | undefined

describe.skipIf(!HAS_LOCAL_PHP_API)('Legacy PHP API contracts', () => {
  beforeAll(async () => {
    phpServer = spawn('php', ['-S', `${HOST}:${PORT}`, '-t', 'public'], {
      cwd: path.resolve(process.cwd()),
      stdio: 'pipe'
    })
    phpServer.stdout.on('data', (chunk: Buffer | string) => {
      phpServerStdout += String(chunk)
    })
    phpServer.stderr.on('data', (chunk: Buffer | string) => {
      phpServerStderr += String(chunk)
    })
    phpServer.on('exit', (code, signal) => {
      phpServerExit = { code, signal }
    })

    await waitForServerReady()
  }, SERVER_BOOT_TIMEOUT_MS + 10_000)

  afterAll(() => {
    if (phpServer && !phpServer.killed) {
      phpServer.kill()
    }
  })

  it('contact endpoint accepts POST and returns request_id', async () => {
    const response = await fetch(apiUrl('contact'), {
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

  it('propagates incoming request id from x-request-id header', async () => {
    const response = await fetch(apiUrl('contact'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Request-Id': 'test-propagated-request-id'
      },
      body: JSON.stringify({
        email: 'user@example.com',
        message: 'Hola desde propagacion'
      })
    })
    const payload = (await response.json()) as Record<string, unknown>

    expect(response.status).toBe(202)
    expect(response.headers.get('x-request-id')).toBe('test-propagated-request-id')
    expect(payload.request_id).toBe('test-propagated-request-id')
  })

  it('mail endpoint rejects invalid method with standardized error shape', async () => {
    const response = await fetch(apiUrl('mail'), { method: 'GET' })
    const payload = (await response.json()) as Record<string, unknown>

    expect(response.status).toBe(405)
    expect(payload.status).toBe('error')
    expect(typeof payload.request_id).toBe('string')
    expect(payload.code).toBe('METHOD_NOT_ALLOWED')
    expect(typeof payload.message).toBe('string')
    expect(Array.isArray(payload.details)).toBe(true)
    expect(payload.error_code).toBe('METHOD_NOT_ALLOWED')
    expect(typeof payload.detail).toBe('string')
  })

  it('pricing endpoint exposes diagnostico_lista_2h_ars', async () => {
    const response = await fetch(apiUrl('pricing'))
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

  it('health endpoint includes request_id', async () => {
    const response = await fetch(apiUrl('health'))
    const payload = (await response.json()) as { request_id?: unknown; status?: unknown }

    expect(response.status).toBe(200)
    expect(payload.status).toBe('ok')
    expect(typeof payload.request_id).toBe('string')
  })

  it('content endpoint exposes full AppContent contract', async () => {
    const response = await fetch(apiUrl('content'))
    const payload = (await response.json()) as {
      request_id?: unknown
      brand_id?: unknown
      version?: unknown
      content_revision?: unknown
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
    expect(typeof payload.request_id).toBe('string')
    expect(typeof payload.brand_id).toBe('string')
    expect(payload.version).toBe('v2')
    expect(typeof payload.content_revision).toBe('string')
    expect(String(payload.content_revision)).toMatch(/^[a-f0-9]{64}$/)
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

  it('content endpoint rejects invalid method with standardized error shape', async () => {
    const response = await fetch(apiUrl('content'), { method: 'POST' })
    const payload = (await response.json()) as Record<string, unknown>

    expect(response.status).toBe(405)
    expect(payload.status).toBe('error')
    expect(payload.code).toBe('METHOD_NOT_ALLOWED')
    expect(payload.error_code).toBe('METHOD_NOT_ALLOWED')
    expect(typeof payload.request_id).toBe('string')
  })

  it('quote/diagnostic endpoint returns expected quote payload', async () => {
    const response = await fetch(apiUrl('quote/diagnostic'), {
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

  it('quote/pdf endpoint serves application/pdf when quote_id is valid', async () => {
    const response = await fetch(apiUrl('quote/pdf?quote_id=Q-20260226-000001'))

    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toContain('application/pdf')
    expect(response.headers.get('content-disposition')).toContain('quote-Q-20260226-000001.pdf')
    expect(response.headers.get('x-request-id')).toBeTruthy()
    expect(response.headers.get('cache-control')).toBe('no-store')
    expect(response.headers.get('x-content-type-options')).toBe('nosniff')
  })

  it('quote/pdf endpoint returns standardized validation error when quote_id is missing', async () => {
    const response = await fetch(apiUrl('quote/pdf'))
    const payload = (await response.json()) as Record<string, unknown>

    expect(response.status).toBe(422)
    expect(payload.status).toBe('error')
    expect(payload.code).toBe('VALIDATION_ERROR')
    expect(typeof payload.message).toBe('string')
    expect(Array.isArray(payload.details)).toBe(true)
    expect(payload.error_code).toBe('VALIDATION_ERROR')
    expect(typeof payload.request_id).toBe('string')
    expect(typeof payload.detail).toBe('string')
  })

  it('contact endpoint rejects invalid email format', async () => {
    const response = await fetch(apiUrl('contact'), {
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

  it('mail endpoint rejects short messages', async () => {
    const response = await fetch(apiUrl('mail'), {
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
    expect(payload.code).toBe('VALIDATION_ERROR')
    expect(payload.error_code).toBe('VALIDATION_ERROR')
  })

  it('contact endpoint rejects unsupported media type with 415', async () => {
    const response = await fetch(apiUrl('contact'), {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: 'email=user@example.com&message=hola'
    })
    const payload = (await response.json()) as Record<string, unknown>

    expect(response.status).toBe(415)
    expect(payload.status).toBe('error')
    expect(payload.code).toBe('UNSUPPORTED_MEDIA_TYPE')
  })

  it('contact endpoint rejects oversized payload with 413', async () => {
    const hugeMessage = 'a'.repeat(40_000)
    const response = await fetch(apiUrl('contact'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'user@example.com',
        message: hugeMessage
      })
    })
    const payload = (await response.json()) as Record<string, unknown>

    expect(response.status).toBe(413)
    expect(payload.status).toBe('error')
    expect(payload.code).toBe('PAYLOAD_TOO_LARGE')
  })

  it('keeps legacy alias path /api/v1/contact.php during transition window', async () => {
    const response = await fetch(`http://${HOST}:${PORT}/api/v1/contact.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'alias@example.com',
        message: 'Mensaje valido para compatibilidad legacy'
      })
    })
    const payload = (await response.json()) as Record<string, unknown>

    expect(response.status).toBe(202)
    expect(payload.status).toBe('ok')
    expect(typeof payload.request_id).toBe('string')
  })

  it('handles CORS preflight for contact endpoint', async () => {
    const response = await fetch(apiUrl('contact'), {
      method: 'OPTIONS',
      headers: {
        Origin: 'http://localhost:5173',
        'Access-Control-Request-Method': 'POST'
      }
    })

    expect(response.status).toBe(204)
    expect(response.headers.get('access-control-allow-origin')).toBe('http://localhost:5173')
  })

  it('returns 429 when contact endpoint exceeds rate limit', async () => {
    let limitedResponse: Response | undefined

    for (let attempt = 1; attempt <= 8; attempt += 1) {
      const response = await fetch(apiUrl('contact'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'vitest-rate-limit-contact'
        },
        body: JSON.stringify({
          email: 'rate-limit@example.com',
          message: `Mensaje de prueba para rate limit intento ${attempt}`
        })
      })

      if (response.status === 429) {
        limitedResponse = response
        break
      }
    }

    expect(limitedResponse).toBeDefined()
    expect(limitedResponse?.status).toBe(429)
    expect(limitedResponse?.headers.get('retry-after')).toBeTruthy()
  })
})

async function waitForServerReady(): Promise<void> {
  const startedAt = Date.now()
  while (Date.now() - startedAt < SERVER_BOOT_TIMEOUT_MS) {
    try {
      const prettyResponse = await fetch(`${BASE_URL}/api/v1/health`)
      if (prettyResponse.ok) {
        apiRouteMode = 'pretty'
        return
      }

      const phpResponse = await fetch(`${BASE_URL}/api/v1/health.php`)
      if (phpResponse.ok) {
        apiRouteMode = 'php'
        return
      }
    } catch {
      // wait and retry until server is available
    }
    await sleep(SERVER_POLL_INTERVAL_MS)
  }

  const stderrTail = tailLines(phpServerStderr, SERVER_LOG_LINES)
  const stdoutTail = tailLines(phpServerStdout, SERVER_LOG_LINES)
  const exitSummary = phpServerExit
    ? `process exited (code=${phpServerExit.code ?? 'null'}, signal=${phpServerExit.signal ?? 'null'})`
    : 'process still running or exit not observed'

  throw new Error(
    [
      `PHP server did not start in time for contract tests (timeout=${SERVER_BOOT_TIMEOUT_MS}ms, baseUrl=${BASE_URL}, ${exitSummary}).`,
      stderrTail ? `stderr (tail):\n${stderrTail}` : '',
      stdoutTail ? `stdout (tail):\n${stdoutTail}` : ''
    ]
      .filter(Boolean)
      .join('\n\n')
  )
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function apiUrl(route: string): string {
  if (apiRouteMode === 'pretty') {
    return `${BASE_URL}/api/v1/${route}`
  }

  const [pathPart, queryPart] = route.split('?', 2)
  const phpPath = `${pathPart}.php`
  return queryPart ? `${BASE_URL}/api/v1/${phpPath}?${queryPart}` : `${BASE_URL}/api/v1/${phpPath}`
}

function tailLines(text: string, maxLines: number): string {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trimEnd())
    .filter((line) => line.length > 0)
  return lines.slice(-maxLines).join('\n')
}


