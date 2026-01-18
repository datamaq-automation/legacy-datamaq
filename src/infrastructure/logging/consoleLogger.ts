import type { RuntimeFlags } from '@/application/ports/Environment'
import type { LoggerPort } from '@/application/ports/Logger'

export class ConsoleLogger implements LoggerPort {
  constructor(private environment: RuntimeFlags) {}

  debug(message: string, ...meta: unknown[]): void {
    if (!this.environment.isDev()) {
      return
    }
    console.debug(message, ...meta)
  }

  warn(message: string, ...meta: unknown[]): void {
    if (!this.environment.isDev()) {
      return
    }
    console.warn(message, ...meta)
  }

  error(message: string, ...meta: unknown[]): void {
    if (!this.environment.isDev()) {
      return
    }
    console.error(message, ...meta)
  }
}
