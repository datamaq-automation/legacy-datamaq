import { config } from '@/infrastructure/config'

export type ContactBackendStatus = 'unknown' | 'available' | 'unavailable'

type StatusListener = (status: ContactBackendStatus) => void

const listeners = new Set<StatusListener>()
let status: ContactBackendStatus = config.CONTACT_API_URL ? 'unknown' : 'unavailable'
let inFlightProbe: Promise<ContactBackendStatus> | null = null
const isDev = import.meta.env.DEV
const isBrowser = typeof window !== 'undefined'

function notify(): void {
  listeners.forEach((listener) => listener(status))
}

async function probeContactBackend(): Promise<ContactBackendStatus> {
  const apiUrl = config.CONTACT_API_URL
  if (!apiUrl || !isBrowser) {
    status = 'unavailable'
    notify()
    return status
  }

  try {
    const response = await fetch(apiUrl, {
      method: 'OPTIONS',
      mode: 'cors'
    })

    if (response.ok || response.status === 405 || response.status === 400) {
      status = 'available'
    } else {
      status = 'unavailable'
    }
  } catch (error) {
    if (isDev) {
      console.warn('[contactBackendStatus] Error al verificar disponibilidad del backend:', error)
    }
    status = 'unavailable'
  }

  notify()
  return status
}

export function getContactBackendStatus(): ContactBackendStatus {
  return status
}

export function subscribeToContactBackendStatus(listener: StatusListener): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export async function ensureContactBackendStatus(): Promise<ContactBackendStatus> {
  if (status !== 'unknown') {
    return status
  }

  if (!inFlightProbe) {
    inFlightProbe = probeContactBackend().finally(() => {
      inFlightProbe = null
    })
  }

  return inFlightProbe
}

export function markContactBackendAvailable(): void {
  if (status === 'available') {
    return
  }

  status = 'available'
  notify()
}

export function markContactBackendUnavailable(): void {
  if (status === 'unavailable') {
    return
  }

  status = 'unavailable'
  notify()
}
