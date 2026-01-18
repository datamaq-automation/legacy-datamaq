import type { DomainEvent } from '@/application/ports/EventBus'
import type { LoggerPort } from '@/application/ports/Logger'
import type { AnalyticsFacade } from '../analyticsFacade'
import type { NotificationFacade } from '../notificationFacade'

export class ContactSubmittedHandler {
  constructor(
    private analytics: AnalyticsFacade,
    private notifications: NotificationFacade,
    private logger: LoggerPort
  ) {}

  handle(event: DomainEvent): void {
    this.logger.debug('[event] Contact submitted:', event)
    this.analytics.track('contact_submitted_domain', {
      occurred_at: event.occurredAt.toISOString()
    })
    this.notifications.notify('contact_submitted', {
      occurred_at: event.occurredAt.toISOString()
    })
  }
}
