import type { AnalyticsProvider } from '@/application/ports/AnalyticsProvider'
import type { LoggerPort } from '@/application/ports/Logger'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    clarity?: (...args: unknown[]) => void
  }
}

export class BrowserAnalytics implements AnalyticsProvider {
  constructor(private logger: LoggerPort) {}

  track(event: string, payload: Record<string, unknown>): void {
    this.sendGaEvent(event, payload)
    this.sendClarityEvent(event, payload)
  }

  private sendGaEvent(event: string, payload: Record<string, unknown>): void {
    if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
      if (!import.meta.env.DEV) {
        this.logger.warn(`[GA4] gtag no se encuentra disponible. Evento "${event}" no enviado.`)
      }
      return
    }

    window.gtag('event', event, {
      event_category: 'engagement',
      ...payload
    })
  }

  private sendClarityEvent(event: string, payload: Record<string, unknown>): void {
    if (typeof window === 'undefined' || typeof window.clarity !== 'function') {
      if (!import.meta.env.DEV) {
        this.logger.warn(
          `[Clarity] clarity no se encuentra disponible. Evento "${event}" no enviado.`
        )
      }
      return
    }

    window.clarity('event', event, payload)
  }
}
