import type { EventBus } from '@/application/ports/EventBus'

export class InMemoryEventBus implements EventBus {
  publish(): void {
    return
  }
}
