import type { NotificationProvider } from '@/application/notifications/ports/NotificationProvider'

export class NoopNotificationProvider implements NotificationProvider {
  notify(): void {
    return
  }
}
