const isRuntimeDebugEnabled = Boolean(import.meta.env?.DEV) && import.meta.env?.MODE !== 'test'

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
  if (!isRuntimeDebugEnabled) {
    return
  }
  globalThis.console?.debug?.(...buildRuntimeLogArgs(message, ...meta))
}

export function emitRuntimeInfo(message: string, ...meta: unknown[]): void {
  if (!isRuntimeDebugEnabled) {
    return
  }
  globalThis.console?.info?.(...buildRuntimeLogArgs(message, ...meta))
}

export function emitRuntimeWarn(message: string, ...meta: unknown[]): void {
  globalThis.console?.warn?.(...buildRuntimeLogArgs(message, ...meta))
}

export function emitRuntimeError(message: string, ...meta: unknown[]): void {
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

  return Object.fromEntries(normalizedEntries)
}

function isRuntimeLogRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
