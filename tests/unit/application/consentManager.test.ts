import { describe, expect, it, vi } from 'vitest'
import { analyticsConsentStorageKey } from '@/application/consent/consentStorage'
import { createConsentManager } from '@/application/consent/consentManager'
import type { LoggerPort } from '@/application/ports/Logger'
import type { StoragePort } from '@/application/ports/Storage'

function createMemoryStorage(seed: Record<string, string> = {}): StoragePort {
  const map = new Map(Object.entries(seed))

  return {
    get(key: string): string | null {
      return map.get(key) ?? null
    },
    set(key: string, value: string): void {
      map.set(key, value)
    },
    remove(key: string): void {
      map.delete(key)
    }
  }
}

function createLogger(): LoggerPort {
  return {
    debug: vi.fn(),
    warn: vi.fn(),
    error: vi.fn()
  }
}

describe('consentManager', () => {
  it('loads consent from the canonical storage key', () => {
    const storage = createMemoryStorage({
      [analyticsConsentStorageKey]: 'granted'
    })
    const manager = createConsentManager(storage, createLogger())

    expect(manager.getStatus()).toBe('granted')
  })

  it('persists granted consent in the canonical storage key', () => {
    const storage = createMemoryStorage()
    const manager = createConsentManager(storage, createLogger())

    manager.grant()

    expect(manager.getStatus()).toBe('granted')
    expect(storage.get(analyticsConsentStorageKey)).toBe('granted')
  })

  it('persists denied consent and notifies subscribers', () => {
    const storage = createMemoryStorage()
    const manager = createConsentManager(storage, createLogger())
    const listener = vi.fn()
    const unsubscribe = manager.subscribe(listener)

    manager.deny()

    expect(manager.getStatus()).toBe('denied')
    expect(storage.get(analyticsConsentStorageKey)).toBe('denied')
    expect(listener).toHaveBeenCalledWith('denied')

    unsubscribe()
  })

  it('removes the canonical key when consent is reset', () => {
    const storage = createMemoryStorage({
      [analyticsConsentStorageKey]: 'granted'
    })
    const manager = createConsentManager(storage, createLogger())

    manager.reset()

    expect(manager.getStatus()).toBe('unknown')
    expect(storage.get(analyticsConsentStorageKey)).toBeNull()
  })
})
