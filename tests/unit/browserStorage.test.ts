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
})
