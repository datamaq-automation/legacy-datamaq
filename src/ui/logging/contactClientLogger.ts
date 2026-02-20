type LogLevel = 'debug' | 'info' | 'warn' | 'error'

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40
}

const DEFAULT_LEVEL: LogLevel = 'info'
const configuredLevel = resolveConfiguredLevel(import.meta.env.VITE_CLIENT_LOG_LEVEL)
const activeLevel = configuredLevel ?? DEFAULT_LEVEL
const emittedOnce = new Set<string>()

export const contactClientLogger = {
  debug(event: string, data?: Record<string, unknown>): void {
    log('debug', event, data)
  },
  info(event: string, data?: Record<string, unknown>): void {
    log('info', event, data)
  },
  warn(event: string, data?: Record<string, unknown>): void {
    log('warn', event, data)
  },
  error(event: string, data?: Record<string, unknown>): void {
    log('error', event, data)
  },
  warnOnce(key: string, event: string, data?: Record<string, unknown>): void {
    logOnce('warn', key, event, data)
  },
  errorOnce(key: string, event: string, data?: Record<string, unknown>): void {
    logOnce('error', key, event, data)
  }
}

function resolveConfiguredLevel(raw: string | undefined): LogLevel | undefined {
  const normalized = raw?.trim().toLowerCase()
  if (!normalized) {
    return undefined
  }

  if (
    normalized === 'debug' ||
    normalized === 'info' ||
    normalized === 'warn' ||
    normalized === 'error'
  ) {
    return normalized
  }

  return undefined
}

function isEnabled(level: LogLevel): boolean {
  return LEVEL_PRIORITY[level] >= LEVEL_PRIORITY[activeLevel]
}

function log(level: LogLevel, event: string, data?: Record<string, unknown>): void {
  if (!isEnabled(level)) {
    return
  }

  const payload = data ?? {}
  const message = `[contact-ui] ${event}`
  switch (level) {
    case 'debug':
      console.debug(message, payload)
      break
    case 'info':
      console.info(message, payload)
      break
    case 'warn':
      console.warn(message, payload)
      break
    case 'error':
      console.error(message, payload)
      break
  }
}

function logOnce(
  level: Extract<LogLevel, 'warn' | 'error'>,
  key: string,
  event: string,
  data?: Record<string, unknown>
): void {
  const onceKey = `${level}:${key}`
  if (emittedOnce.has(onceKey)) {
    return
  }
  emittedOnce.add(onceKey)
  log(level, event, data)
}
