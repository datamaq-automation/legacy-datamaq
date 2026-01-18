export interface EventBus {
  publish(event: { name: string; occurredAt: Date }): void
}
