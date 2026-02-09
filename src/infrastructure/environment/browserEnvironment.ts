import type {
  Clock,
  LocationProvider,
  NavigatorProvider,
  RuntimeFlags
} from '@/application/ports/Environment'

export class BrowserEnvironment
  implements Clock, LocationProvider, NavigatorProvider, RuntimeFlags
{
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

  isBrowser(): boolean {
    return typeof window !== 'undefined'
  }

  isDev(): boolean {
    return Boolean(import.meta.env.DEV)
  }
}
