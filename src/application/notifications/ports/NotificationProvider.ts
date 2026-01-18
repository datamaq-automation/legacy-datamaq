export interface NotificationProvider {
  notify(event: string, payload: Record<string, unknown>): void
}
