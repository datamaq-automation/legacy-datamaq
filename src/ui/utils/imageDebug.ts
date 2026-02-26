export function handleImageLoadError(event: Event, context: string, fallbackSrc = '/favicon.ico'): void {
  try {
    const target = event.target
    if (!(target instanceof HTMLImageElement)) {
      console.error('[image:error] target invalido', { context, target })
      return
    }

    const failedSrc = target.currentSrc || target.src
    const alreadyTriedFallback = target.dataset['fallbackApplied'] === 'true'

    console.error('[image:error] no se pudo cargar imagen', {
      context,
      failedSrc,
      alt: target.alt,
      pageUrl: window.location.href,
      fallbackSrc,
      alreadyTriedFallback
    })

    if (!alreadyTriedFallback) {
      target.dataset['fallbackApplied'] = 'true'
      target.src = fallbackSrc
    }
  } catch (error) {
    console.error('[image:error] fallo inesperado en handler', {
      context,
      error
    })
  }
}
