import type { EnvironmentPort } from '@/application/ports/Environment'

export class BrowserEnvironment implements EnvironmentPort {
  now(): number {
    return Date.now()
  }

  href(): string {
    return typeof window !== 'undefined' ? window.location.href : ''
  }

  referrer(): string {
    return typeof document !== 'undefined' ? document.referrer : ''
  }

  search(): string {
    return typeof window !== 'undefined' ? window.location.search : ''
  }

  userAgent(): string {
    return typeof navigator !== 'undefined' ? navigator.userAgent : ''
  }

  open(url: string): void {
    if (typeof window === 'undefined') {
      return
    }
    window.open(url, '_blank', 'noopener')
  }

  isBrowser(): boolean {
    return typeof window !== 'undefined'
  }

  isDev(): boolean {
    return Boolean(import.meta.env.DEV)
  }
}
