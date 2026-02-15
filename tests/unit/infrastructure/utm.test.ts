import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Attribution } from '@/application/ports/Attribution'
import type { StoragePort } from '@/application/ports/Storage'
import {
  attachAttributionToPayload,
  getAttribution,
  initAttribution,
  persistAttribution,
  readAttributionFromUrl
} from '@/infrastructure/attribution/utm'

type MemoryStorage = StoragePort & {
  remove: ReturnType<typeof vi.fn>
}

function createMemoryStorage(initial: Record<string, string> = {}): MemoryStorage {
  const values = new Map<string, string>(Object.entries(initial))
  return {
    get(key: string): string | null {
      return values.get(key) ?? null
    },
    set(key: string, value: string): void {
      values.set(key, value)
    },
    remove: vi.fn((key: string) => {
      values.delete(key)
    })
  }
}

function setSearch(search: string): void {
  const url = search ? `/${search}` : '/'
  window.history.replaceState({}, '', url)
}

describe('utm attribution helpers', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    setSearch('')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('reads attribution fields from URL query params', () => {
    setSearch('?utm_source=google&utm_medium=cpc&utm_campaign=spring&utm_term=medicion&utm_content=hero&gclid=abc123')

    const attribution = readAttributionFromUrl()

    expect(attribution).toEqual({
      utmSource: 'google',
      utmMedium: 'cpc',
      utmCampaign: 'spring',
      utmTerm: 'medicion',
      utmContent: 'hero',
      gclid: 'abc123'
    })
  })

  it('returns null when URL has no attribution params', () => {
    setSearch('?foo=bar')

    const attribution = readAttributionFromUrl()

    expect(attribution).toBeNull()
  })

  it('initAttribution persists attribution with default TTL when params are present', () => {
    setSearch('?utm_source=linkedin')
    const storage = createMemoryStorage()
    vi.spyOn(Date, 'now').mockReturnValue(1_700_000_000_000)

    initAttribution(storage)

    const raw = storage.get('datamaq_attribution')
    expect(raw).not.toBeNull()
    expect(raw).toContain('"utmSource":"linkedin"')
    expect(raw).toContain('"expiresAt":1702592000000')
  })

  it('initAttribution does not write storage when URL has no attribution', () => {
    setSearch('?foo=bar')
    const storage = createMemoryStorage()
    const setSpy = vi.spyOn(storage, 'set')

    initAttribution(storage)

    expect(setSpy).not.toHaveBeenCalled()
  })

  it('getAttribution returns data when entry is valid and not expired', () => {
    const attribution: Attribution = { utmSource: 'newsletter', utmCampaign: 'promo' }
    const storage = createMemoryStorage()
    vi.spyOn(Date, 'now').mockReturnValue(1_700_000_000_000)
    persistAttribution(storage, attribution, 10)

    const result = getAttribution(storage)

    expect(result).toEqual(attribution)
    expect(storage.remove).not.toHaveBeenCalled()
  })

  it('getAttribution removes expired data and returns null', () => {
    const storage = createMemoryStorage({
      datamaq_attribution: JSON.stringify({
        data: { utmSource: 'expired' },
        expiresAt: 10
      })
    })
    vi.spyOn(Date, 'now').mockReturnValue(20)

    const result = getAttribution(storage)

    expect(result).toBeNull()
    expect(storage.remove).toHaveBeenCalledWith('datamaq_attribution')
  })

  it('getAttribution removes malformed data and returns null', () => {
    const storage = createMemoryStorage({
      datamaq_attribution: '{invalid-json'
    })

    const result = getAttribution(storage)

    expect(result).toBeNull()
    expect(storage.remove).toHaveBeenCalledWith('datamaq_attribution')
  })

  it('attachAttributionToPayload adds attribution when available', () => {
    const storage = createMemoryStorage({
      datamaq_attribution: JSON.stringify({
        data: { utmSource: 'google' },
        expiresAt: Number.MAX_SAFE_INTEGER
      })
    })
    const payload = { foo: 'bar' }

    const result = attachAttributionToPayload(payload, storage)

    expect(result).toEqual({
      foo: 'bar',
      attribution: { utmSource: 'google' }
    })
  })

  it('attachAttributionToPayload returns original payload when attribution is absent', () => {
    const storage = createMemoryStorage()
    const payload = { foo: 'bar' }

    const result = attachAttributionToPayload(payload, storage)

    expect(result).toBe(payload)
  })
})
