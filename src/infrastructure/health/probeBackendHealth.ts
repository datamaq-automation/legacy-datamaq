const HEALTH_ENDPOINT = '/api/health.php'

export async function probeBackendHealth(endpoint: string = HEALTH_ENDPOINT): Promise<void> {
  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    })

    if (!response.ok) {
      console.warn('[backend:health] sin conexion', {
        endpoint,
        status: response.status
      })
      return
    }

    const payload = (await response.json().catch(() => undefined)) as
      | {
          status?: unknown
          service?: unknown
          brand_id?: unknown
          brandId?: unknown
          version?: unknown
          timestamp?: unknown
        }
      | undefined

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
