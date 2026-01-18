import type { NotificationProvider } from '@/application/ports/NotificationProvider'

export class NoopNotificationProvider implements NotificationProvider {
  notify(): void {
    return
  }
}
