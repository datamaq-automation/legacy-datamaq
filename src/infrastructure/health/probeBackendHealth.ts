import type { HttpClient } from '@/application/ports/HttpClient'
import { FetchHttpClient } from '@/infrastructure/http/fetchHttpClient'
import { NoopLogger } from '@/infrastructure/logging/noopLogger'

const HEALTH_ENDPOINT = '/api/v1/health'

export async function probeBackendHealth(
  endpoint: string = HEALTH_ENDPOINT,
  http: HttpClient = new FetchHttpClient(new NoopLogger())
): Promise<void> {
  try {
    const response = await http.get<{
      status?: unknown
      service?: unknown
      brand_id?: unknown
      brandId?: unknown
      version?: unknown
      timestamp?: unknown
    }>(endpoint, {
      headers: {
        Accept: 'application/json'
      },
      timeoutMs: 5_000,
      retries: 1
    })

    if (!response.ok) {
      console.warn('[backend:health] sin conexion', {
        endpoint,
        status: response.status
      })
      return
    }

    const payload = response.data

    const service = normalize(payload?.service)
    const brandId = normalize(payload?.brandId) ?? normalize(payload?.brand_id)
    const version = normalize(payload?.version)
    const timestamp = normalize(payload?.timestamp)
    const health = normalize(payload?.status)

    console.info('[backend:health] conexion OK', {
      endpoint,
      status: response.status,
      service,
      brandId,
      version,
      timestamp,
      health
    })
  } catch (error) {
    console.warn('[backend:health] error de red', {
      endpoint,
      error
    })
  }
}

function normalize(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null
  }
  const trimmed = value.trim()
  return trimmed ? trimmed : null
}

