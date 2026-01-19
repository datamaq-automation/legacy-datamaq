import type { Attribution } from '@/application/ports/Attribution'

type StoredAttribution = {
  data: Attribution
  expiresAt: number
}

const STORAGE_KEY = 'profebustos_attribution'
const DEFAULT_TTL_DAYS = 30

export function initAttribution(ttlDays: number = DEFAULT_TTL_DAYS): void {
  const attribution = readAttributionFromUrl()
  if (!attribution) {
    return
  }
  persistAttribution(attribution, ttlDays)
}

export function readAttributionFromUrl(): Attribution | null {
  if (typeof window === 'undefined') {
    return null
  }

  const params = new URLSearchParams(window.location.search)
  const attribution: Attribution = {
    utmSource: params.get('utm_source') ?? undefined,
    utmMedium: params.get('utm_medium') ?? undefined,
    utmCampaign: params.get('utm_campaign') ?? undefined,
    utmTerm: params.get('utm_term') ?? undefined,
    utmContent: params.get('utm_content') ?? undefined,
    gclid: params.get('gclid') ?? undefined
  }

  if (
    !attribution.utmSource &&
    !attribution.utmMedium &&
    !attribution.utmCampaign &&
    !attribution.utmTerm &&
    !attribution.utmContent &&
    !attribution.gclid
  ) {
    return null
  }

  return attribution
}

export function persistAttribution(
  attribution: Attribution,
  ttlDays: number = DEFAULT_TTL_DAYS
): void {
  if (typeof window === 'undefined') {
    return
  }

  const expiresAt = Date.now() + ttlDays * 24 * 60 * 60 * 1000
  const stored: StoredAttribution = { data: attribution, expiresAt }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stored))
}

export function getAttribution(): Attribution | null {
  if (typeof window === 'undefined') {
    return null
  }

  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return null
  }

  try {
    const stored = JSON.parse(raw) as StoredAttribution
    if (!stored.expiresAt || stored.expiresAt < Date.now()) {
      window.localStorage.removeItem(STORAGE_KEY)
      return null
    }
    return stored.data
  } catch {
    window.localStorage.removeItem(STORAGE_KEY)
    return null
  }
}

export function attachAttributionToPayload<T extends object>(
  payload: T
): T & { attribution?: Attribution } {
  const attribution = getAttribution()
  if (!attribution) {
    return payload
  }

  return {
    ...payload,
    attribution
  }
}
