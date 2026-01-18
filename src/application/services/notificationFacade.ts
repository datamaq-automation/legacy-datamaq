import type { NotificationProvider } from '../ports/NotificationProvider'
import type { LoggerPort } from '../ports/Logger'

export class NotificationFacade {
  constructor(
    private providers: NotificationProvider[],
    private logger: LoggerPort
  ) {}

  notify(event: string, payload: Record<string, unknown>): void {
    for (const provider of this.providers) {
      try {
        provider.notify(event, payload)
      } catch (error) {
        this.logger.warn('[notification] Error al notificar:', error)
      }
    }
  }
}
