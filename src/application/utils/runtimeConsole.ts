type RuntimeLogLevel = 'debug' | 'info' | 'warn' | 'error'

const DEFAULT_LEVEL: RuntimeLogLevel = import.meta.env?.DEV ? 'info' : 'warn'
const runtimeLogLevel = resolveRuntimeLogLevel(import.meta.env?.VITE_RUNTIME_LOG_LEVEL, DEFAULT_LEVEL)

export function buildRuntimeLogArgs(message: string, ...meta: unknown[]): [string] | [string, ...unknown[]] {
  const normalizedMeta = meta
    .map((entry) => normalizeRuntimeLogMeta(entry))
    .filter((entry) => entry !== undefined)

  if (normalizedMeta.length === 0) {
    return [message]
  }

  return [message, ...normalizedMeta]
}

export function emitRuntimeDebug(message: string, ...meta: unknown[]): void {
  if (!isLevelEnabled('debug')) {
    return
  }
  globalThis.console?.debug?.(...buildRuntimeLogArgs(message, ...meta))
}

export function emitRuntimeInfo(message: string, ...meta: unknown[]): void {
  if (!isLevelEnabled('info')) {
    return
  }
  globalThis.console?.info?.(...buildRuntimeLogArgs(message, ...meta))
}

export function emitRuntimeWarn(message: string, ...meta: unknown[]): void {
  if (!isLevelEnabled('warn')) {
    return
  }
  globalThis.console?.warn?.(...buildRuntimeLogArgs(message, ...meta))
}

export function emitRuntimeError(message: string, ...meta: unknown[]): void {
  if (!isLevelEnabled('error')) {
    return
  }
  globalThis.console?.error?.(...buildRuntimeLogArgs(message, ...meta))
}

function normalizeRuntimeLogMeta(value: unknown): unknown {
  if (value === undefined) {
    return undefined
  }

  if (value instanceof Error) {
    return {
      name: value.name,
      message: value.message
    }
  }

  if (Array.isArray(value)) {
    return value
      .map((entry) => normalizeRuntimeLogMeta(entry))
      .filter((entry) => entry !== undefined)
  }

  if (!isRuntimeLogRecord(value)) {
    return value
  }

  const normalizedEntries = Object.entries(value)
    .filter(([, entry]) => entry !== undefined)
    .map(([key, entry]) => [key, normalizeRuntimeLogMeta(entry)])
    .filter(([, entry]) => entry !== undefined)

  if (normalizedEntries.length === 0) {
    return undefined
  }

  return Object.fromEntries(normalizedEntries)
}

function isRuntimeLogRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function resolveRuntimeLogLevel(
  value: string | undefined,
  fallback: RuntimeLogLevel
): RuntimeLogLevel {
  const normalized = value?.trim().toLowerCase()
  if (
    normalized === 'debug' ||
    normalized === 'info' ||
    normalized === 'warn' ||
    normalized === 'error'
  ) {
    return normalized
  }
  return fallback
}

function isLevelEnabled(level: RuntimeLogLevel): boolean {
  return rank(level) >= rank(runtimeLogLevel)
}

function rank(level: RuntimeLogLevel): number {
  switch (level) {
    case 'debug':
      return 0
    case 'info':
      return 1
    case 'warn':
      return 2
    case 'error':
      return 3
  }
}
