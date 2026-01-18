import type { AnalyticsPort } from '../ports/Analytics'
import type { LoggerPort } from '../ports/Logger'

export class AnalyticsComposite implements AnalyticsPort {
  constructor(
    private providers: AnalyticsPort[],
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
