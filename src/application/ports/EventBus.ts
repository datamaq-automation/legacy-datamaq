export type DomainEvent = {
  name: string
  occurredAt: Date
}

export type EventHandler = (event: DomainEvent) => void

export interface EventBus {
  publish(event: DomainEvent): void
  subscribe(eventName: string, handler: EventHandler): () => void
}
