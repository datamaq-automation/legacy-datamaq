import { emitRuntimeError } from '@/application/utils/runtimeConsole'

export function handleImageLoadError(event: Event, context: string, fallbackSrc = '/favicon.ico'): void {
  try {
    const target = event.target
    if (!(target instanceof HTMLImageElement)) {
      emitRuntimeError('[image:error] target invalido', {
        context,
        reason: 'invalid-target'
      })
      return
    }

    const failedSrc = target.currentSrc || target.src
    const alreadyTriedFallback = target.dataset['fallbackApplied'] === 'true'

    emitRuntimeError('[image:error] no se pudo cargar imagen', {
      context,
      pathname: resolveSafePathname(failedSrc),
      fallbackPathname: resolveSafePathname(fallbackSrc),
      alreadyTriedFallback,
      reason: 'load-failed'
    })

    if (!alreadyTriedFallback) {
      target.dataset['fallbackApplied'] = 'true'
      target.src = fallbackSrc
    }
  } catch {
    emitRuntimeError('[image:error] fallo inesperado en handler', {
      context,
      reason: 'handler-error'
    })
  }
}

function resolveSafePathname(value: string | undefined): string | null {
  const normalizedValue = value?.trim()
  if (!normalizedValue) {
    return null
  }

  if (normalizedValue.startsWith('/')) {
    return stripQueryAndHash(normalizedValue)
  }

  try {
    return new URL(normalizedValue).pathname || stripQueryAndHash(normalizedValue)
  } catch {
    const currentOrigin = typeof window !== 'undefined' ? window.location.origin : undefined
    if (!currentOrigin) {
      return stripQueryAndHash(normalizedValue)
    }

    try {
      return new URL(normalizedValue, currentOrigin).pathname || stripQueryAndHash(normalizedValue)
    } catch {
      return stripQueryAndHash(normalizedValue)
    }
  }
}

function stripQueryAndHash(value: string): string | null {
  const [pathWithoutHash = ''] = value.split('#', 1)
  const [pathname] = pathWithoutHash.split('?', 1)
  return pathname || null
}
