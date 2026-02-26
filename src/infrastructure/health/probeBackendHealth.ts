const HEALTH_ENDPOINT = '/api/health.php'

type HealthPayload = {
  status?: string
  service?: string
  brand_id?: string
  version?: string
  timestamp?: string
}

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

    const payload = (await response.json().catch(() => ({}))) as HealthPayload
    console.info('[backend:health] conexion OK', {
      endpoint,
      status: response.status,
      service: normalize(payload.service),
      brandId: normalize(payload.brand_id),
      version: normalize(payload.version),
      timestamp: normalize(payload.timestamp),
      health: normalize(payload.status)
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
