import type { DomainEvent, EventBus, EventHandler } from '@/application/ports/EventBus'

export class InMemoryEventBus implements EventBus {
  private handlers = new Map<string, Set<EventHandler>>()

  publish(event: DomainEvent): void {
    const listeners = this.handlers.get(event.name)
    if (!listeners) {
      return
    }
    listeners.forEach((handler) => {
      handler(event)
    })
  }

  subscribe(eventName: string, handler: EventHandler): () => void {
    const listeners = this.handlers.get(eventName)
    if (listeners) {
      listeners.add(handler)
    } else {
      this.handlers.set(eventName, new Set([handler]))
    }

    return () => {
      const current = this.handlers.get(eventName)
      if (!current) {
        return
      }
      current.delete(handler)
      if (current.size === 0) {
        this.handlers.delete(eventName)
      }
    }
  }
}
