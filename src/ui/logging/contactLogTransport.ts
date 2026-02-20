type ContactLogLevel = 'debug' | 'info' | 'warn' | 'error'

export interface ContactLogEnvelope {
  event: string
  level: ContactLogLevel
  timestamp: string
  payload: Record<string, unknown>
}

const LOG_INGEST_URL = normalizeUrl(import.meta.env.VITE_CLIENT_LOG_INGEST_URL)

export function sendContactLogToBackend(envelope: ContactLogEnvelope): void {
  if (!LOG_INGEST_URL) {
    return
  }

  const body = JSON.stringify(envelope)

  // sendBeacon is non-blocking and survives navigations to /gracias.
  if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
    try {
      const ok = navigator.sendBeacon(
        LOG_INGEST_URL,
        new Blob([body], { type: 'application/json' })
      )
      if (ok) {
        return
      }
    } catch {
      // Fallback to fetch below.
    }
  }

  if (typeof fetch === 'function') {
    void fetch(LOG_INGEST_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body,
      keepalive: true
    }).catch(() => {
      // No-op by design: transport errors must not break UX.
    })
  }
}

function normalizeUrl(value: string | undefined): string | undefined {
  const trimmed = value?.trim()
  return trimmed ? trimmed : undefined
}
