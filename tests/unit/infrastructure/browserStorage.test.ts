import { describe, expect, it, beforeEach } from 'vitest'
import { BrowserStorage } from '@/infrastructure/storage/browserStorage'

describe('BrowserStorage', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('stores and retrieves values from localStorage', () => {
    const storage = new BrowserStorage()

    storage.set('key', 'value')

    expect(storage.get('key')).toBe('value')
    storage.remove('key')
    expect(storage.get('key')).toBeNull()
  })

  it('tolera la ausencia de window sin lanzar errores', () => {
    const originalWindow = globalThis.window
    // @ts-expect-error simulamos entorno sin window
    globalThis.window = undefined

    const storage = new BrowserStorage()

    expect(storage.get('key')).toBeNull()
    expect(() => storage.set('key', 'value')).not.toThrow()
    expect(() => storage.remove('key')).not.toThrow()

    // @ts-expect-error restauramos window
    globalThis.window = originalWindow
  })
})
