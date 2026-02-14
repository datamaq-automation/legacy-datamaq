import type { Attribution } from '@/application/ports/Attribution'
import type { StoragePort } from '@/application/ports/Storage'

type StoredAttribution = {
  data: Attribution
  expiresAt: number
}

const STORAGE_KEY = 'datamaq_attribution'
const DEFAULT_TTL_DAYS = 30

export function initAttribution(
  storage: StoragePort,
  ttlDays: number = DEFAULT_TTL_DAYS
): void {
  const attribution = readAttributionFromUrl()
  if (!attribution) {
    return
  }
  persistAttribution(storage, attribution, ttlDays)
}

export function readAttributionFromUrl(): Attribution | null {
  if (typeof window === 'undefined') {
    return null
  }

  const params = new URLSearchParams(window.location.search)
  const attribution: Attribution = {}

  const utmSource = params.get('utm_source')
  if (utmSource) {
    attribution.utmSource = utmSource
  }

  const utmMedium = params.get('utm_medium')
  if (utmMedium) {
    attribution.utmMedium = utmMedium
  }

  const utmCampaign = params.get('utm_campaign')
  if (utmCampaign) {
    attribution.utmCampaign = utmCampaign
  }

  const utmTerm = params.get('utm_term')
  if (utmTerm) {
    attribution.utmTerm = utmTerm
  }

  const utmContent = params.get('utm_content')
  if (utmContent) {
    attribution.utmContent = utmContent
  }

  const gclid = params.get('gclid')
  if (gclid) {
    attribution.gclid = gclid
  }

  if (Object.keys(attribution).length === 0) {
    return null
  }

  return attribution
}

export function persistAttribution(
  storage: StoragePort,
  attribution: Attribution,
  ttlDays: number = DEFAULT_TTL_DAYS
): void {
  const expiresAt = Date.now() + ttlDays * 24 * 60 * 60 * 1000
  const stored: StoredAttribution = { data: attribution, expiresAt }

  storage.set(STORAGE_KEY, JSON.stringify(stored))
}

export function getAttribution(storage: StoragePort): Attribution | null {
  const raw = storage.get(STORAGE_KEY)
  if (!raw) {
    return null
  }

  try {
    const stored = JSON.parse(raw) as StoredAttribution
    if (!stored.expiresAt || stored.expiresAt < Date.now()) {
      storage.remove(STORAGE_KEY)
      return null
    }
    return stored.data
  } catch {
    storage.remove(STORAGE_KEY)
    return null
  }
}

export function attachAttributionToPayload<T extends object>(
  payload: T,
  storage: StoragePort
): T & { attribution?: Attribution } {
  const attribution = getAttribution(storage)
  if (!attribution) {
    return payload
  }

  return {
    ...payload,
    attribution
  }
}
