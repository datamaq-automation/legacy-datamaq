import type { LoggerPort } from '@/application/ports/Logger'

export class NoopLogger implements LoggerPort {
  debug(): void {}
  warn(): void {}
  error(): void {}
}
