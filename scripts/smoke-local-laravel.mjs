import fs from 'node:fs'
import path from 'node:path'

const FRONTEND_BASE_URL = normalizeBaseUrl(process.env.FRONTEND_BASE_URL) ?? 'http://127.0.0.1:4173'
const OUTPUT_PATH = process.env.SMOKE_OUTPUT_PATH?.trim() || 'tests/fixtures/api-regressions/local-laravel-smoke.json'
const TIMEOUT_MS = parsePositiveInteger(process.env.SMOKE_TIMEOUT_MS) ?? 8_000

const smokeChecks = [
  {
    id: 'health',
    method: 'GET',
    path: '/api/v1/health',
    expectedStatus: 200,
    headers: {
      Accept: 'application/json'
    }
  },
  {
    id: 'pricing',
    method: 'GET',
    path: '/api/v1/pricing',
    expectedStatus: 200,
    headers: {
      Accept: 'application/json, text/plain;q=0.9, */*;q=0.8'
    }
  },
  {
    id: 'content',
    method: 'GET',
    path: '/api/v1/content',
    expectedStatus: 200,
    headers: {
      Accept: 'application/json, text/plain;q=0.9, */*;q=0.8'
    }
  },
  {
    id: 'contact-options',
    method: 'OPTIONS',
    path: '/api/v1/contact',
    expectedStatus: 204
  },
  {
    id: 'contact-post',
    method: 'POST',
    path: '/api/v1/contact',
    expectedStatus: 422,
    headers: {
      'Content-Type': 'application/json'
    },
    body: {}
  },
  {
    id: 'mail-options',
    method: 'OPTIONS',
    path: '/api/v1/mail',
    expectedStatus: 204
  },
  {
    id: 'mail-post',
    method: 'POST',
    path: '/api/v1/mail',
    expectedStatus: 422,
    headers: {
      'Content-Type': 'application/json'
    },
    body: {}
  }
]

const results = []
let failureCount = 0

for (const smokeCheck of smokeChecks) {
  const result = await runSmokeCheck(smokeCheck)
  results.push(result)

  const outcome = result.passed ? 'OK' : 'FAIL'
  console.log(
    `[smoke:local:laravel] ${outcome} ${result.method} ${result.path} -> ${result.status}${result.note ? ` (${result.note})` : ''}`
  )

  if (!result.passed) {
    failureCount += 1
  }
}

const report = {
  generatedAt: new Date().toISOString(),
  frontendBaseUrl: FRONTEND_BASE_URL,
  timeoutMs: TIMEOUT_MS,
  success: failureCount === 0,
  failures: failureCount,
  checks: results
}

writeReport(report)

if (failureCount > 0) {
  console.error(
    `[smoke:local:laravel] ${failureCount} check(s) failed. See ${path.resolve(OUTPUT_PATH)} for details.`
  )
  process.exitCode = 1
} else {
  console.log(`[smoke:local:laravel] all checks passed. Report written to ${path.resolve(OUTPUT_PATH)}`)
}

async function runSmokeCheck(smokeCheck) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS)
  const url = `${FRONTEND_BASE_URL}${smokeCheck.path}`

  try {
    const response = await fetch(url, {
      method: smokeCheck.method,
      headers: smokeCheck.headers,
      body: typeof smokeCheck.body === 'undefined' ? undefined : JSON.stringify(smokeCheck.body),
      redirect: 'manual',
      signal: controller.signal
    })
    clearTimeout(timeoutId)

    const rawBody = await response.text().catch(() => '')
    const parsedBody = tryParseJson(rawBody)
    const compactHeaders = compactResponseHeaders(response.headers)
    const passed = response.status === smokeCheck.expectedStatus

    return {
      id: smokeCheck.id,
      method: smokeCheck.method,
      path: smokeCheck.path,
      url,
      status: response.status,
      expectedStatus: smokeCheck.expectedStatus,
      passed,
      headers: compactHeaders,
      bodyPreview: truncate(rawBody, 600),
      bodyJson: parsedBody,
      note: passed ? undefined : `expected ${smokeCheck.expectedStatus}`
    }
  } catch (error) {
    clearTimeout(timeoutId)

    return {
      id: smokeCheck.id,
      method: smokeCheck.method,
      path: smokeCheck.path,
      url,
      status: 0,
      expectedStatus: smokeCheck.expectedStatus,
      passed: false,
      headers: {},
      bodyPreview: '',
      note: error instanceof Error ? error.message : 'unknown error'
    }
  }
}

function compactResponseHeaders(headers) {
  const allowedHeaders = [
    'access-control-allow-methods',
    'cache-control',
    'content-disposition',
    'content-type',
    'location',
    'retry-after',
    'vary',
    'x-content-type-options',
    'x-request-id'
  ]

  return Object.fromEntries(
    allowedHeaders
      .map((headerName) => [headerName, headers.get(headerName)] as const)
      .filter(([, headerValue]) => typeof headerValue === 'string' && headerValue.length > 0)
  )
}

function writeReport(report) {
  const reportPath = path.resolve(OUTPUT_PATH)
  fs.mkdirSync(path.dirname(reportPath), { recursive: true })
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
}

function tryParseJson(rawBody) {
  if (!rawBody) {
    return undefined
  }

  try {
    return JSON.parse(rawBody)
  } catch {
    return undefined
  }
}

function truncate(value, maxLength) {
  if (value.length <= maxLength) {
    return value
  }

  return `${value.slice(0, maxLength)}...`
}

function normalizeBaseUrl(value) {
  const trimmed = value?.trim()
  return trimmed ? trimmed.replace(/\/+$/, '') : undefined
}

function parsePositiveInteger(value) {
  const parsed = Number.parseInt(value ?? '', 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined
}
