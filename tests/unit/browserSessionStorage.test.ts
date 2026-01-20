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
})
