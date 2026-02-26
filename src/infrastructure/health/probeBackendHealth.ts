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
