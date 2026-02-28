export function emitRuntimeWarn(message: string, ...meta: unknown[]): void {
  globalThis.console?.warn?.(message, ...meta)
}

export function emitRuntimeError(message: string, ...meta: unknown[]): void {
  globalThis.console?.error?.(message, ...meta)
}
