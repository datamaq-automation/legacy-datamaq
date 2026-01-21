import { describe, expect, it, beforeEach } from 'vitest'
import { BrowserSessionStorage } from '@/infrastructure/storage/browserSessionStorage'

describe('BrowserSessionStorage', () => {
  beforeEach(() => {
    window.sessionStorage.clear()
  })

  it('stores and retrieves values from sessionStorage', () => {
    const storage = new BrowserSessionStorage()

    storage.set('key', 'value')

    expect(storage.get('key')).toBe('value')
    storage.remove('key')
    expect(storage.get('key')).toBeNull()
  })

  it('tolera la ausencia de window sin lanzar errores', () => {
    const originalWindow = globalThis.window
    // @ts-expect-error simulamos entorno sin window
    globalThis.window = undefined

    const storage = new BrowserSessionStorage()

    expect(storage.get('key')).toBeNull()
    expect(() => storage.set('key', 'value')).not.toThrow()
    expect(() => storage.remove('key')).not.toThrow()

    // @ts-expect-error restauramos window
    globalThis.window = originalWindow
  })
})
