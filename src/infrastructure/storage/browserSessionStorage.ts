import type { StoragePort } from '@/application/ports/Storage'

export class BrowserSessionStorage implements StoragePort {
  get(key: string): string | null {
    if (typeof window === 'undefined') {
      return null
    }
    return window.sessionStorage.getItem(key)
  }

  set(key: string, value: string): void {
    if (typeof window === 'undefined') {
      return
    }
    window.sessionStorage.setItem(key, value)
  }

  remove(key: string): void {
    if (typeof window === 'undefined') {
      return
    }
    window.sessionStorage.removeItem(key)
  }
}
