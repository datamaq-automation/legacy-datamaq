import type { AnalyticsProvider } from '../ports/AnalyticsProvider'
import type { LoggerPort } from '../ports/Logger'

export class AnalyticsFacade {
  constructor(
    private providers: AnalyticsProvider[],
    private logger: LoggerPort
  ) {}

  track(event: string, payload: Record<string, unknown>): void {
    for (const provider of this.providers) {
      try {
        provider.track(event, payload)
      } catch (error) {
        this.logger.warn('[analytics] Error al enviar evento:', error)
      }
    }
  }
}
