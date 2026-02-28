export type BrowserLocationLike = {
  origin?: string
  protocol?: string
  hostname?: string
  port?: string
}

export type BackendTransportMode = 'direct' | 'proxy'

export type ResolvedBackendEndpoint = {
  configuredUrl: string
  browserUrl: string
  transportMode: BackendTransportMode
}

export function normalizeBackendEndpoint(value: string | undefined): string | undefined {
  const trimmed = value?.trim()
  return trimmed ? trimmed : undefined
}

export function isAbsoluteHttpBackendEndpoint(value: string | undefined): value is string {
  if (!value) {
    return false
  }

  try {
    const parsed = new URL(value)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

export function describeBackendEndpoint(
  configuredUrl: string,
  currentLocation: BrowserLocationLike | undefined = globalThis.location
): ResolvedBackendEndpoint {
  const normalizedConfiguredUrl = normalizeBackendEndpoint(configuredUrl) ?? configuredUrl
  if (!normalizedConfiguredUrl.startsWith('/')) {
    return {
      configuredUrl: normalizedConfiguredUrl,
      browserUrl: normalizedConfiguredUrl,
      transportMode: 'direct'
    }
  }

  const browserOrigin = resolveBrowserOrigin(currentLocation)
  if (!browserOrigin) {
    return {
      configuredUrl: normalizedConfiguredUrl,
      browserUrl: normalizedConfiguredUrl,
      transportMode: 'proxy'
    }
  }

  try {
    return {
      configuredUrl: normalizedConfiguredUrl,
      browserUrl: new URL(normalizedConfiguredUrl, browserOrigin).toString(),
      transportMode: 'proxy'
    }
  } catch {
    return {
      configuredUrl: normalizedConfiguredUrl,
      browserUrl: normalizedConfiguredUrl,
      transportMode: 'proxy'
    }
  }
}

export function resolveBackendPathname(
  endpoint: string | null | undefined,
  currentLocation: BrowserLocationLike | undefined = globalThis.location
): string | null {
  const normalizedEndpoint = normalizeBackendEndpoint(endpoint ?? undefined)
  if (!normalizedEndpoint) {
    return null
  }

  if (normalizedEndpoint.startsWith('/')) {
    return stripQueryAndHash(normalizedEndpoint)
  }

  try {
    return new URL(normalizedEndpoint).pathname || stripQueryAndHash(normalizedEndpoint)
  } catch {
    const browserOrigin = resolveBrowserOrigin(currentLocation)
    if (!browserOrigin) {
      return stripQueryAndHash(normalizedEndpoint)
    }

    try {
      return new URL(normalizedEndpoint, browserOrigin).pathname || stripQueryAndHash(normalizedEndpoint)
    } catch {
      return stripQueryAndHash(normalizedEndpoint)
    }
  }
}

export function resolveBackendOrigin(
  endpoint: string | null | undefined,
  currentLocation: BrowserLocationLike | undefined = globalThis.location
): string | null {
  const normalizedEndpoint = normalizeBackendEndpoint(endpoint ?? undefined)
  if (!normalizedEndpoint) {
    return null
  }

  if (normalizedEndpoint.startsWith('/')) {
    return resolveBrowserOrigin(currentLocation) ?? normalizedEndpoint
  }

  try {
    return new URL(normalizedEndpoint).origin
  } catch {
    const browserOrigin = resolveBrowserOrigin(currentLocation)
    if (!browserOrigin) {
      return normalizedEndpoint
    }

    try {
      return new URL(normalizedEndpoint, browserOrigin).origin
    } catch {
      return normalizedEndpoint
    }
  }
}

export function resolveBrowserOrigin(
  currentLocation: BrowserLocationLike | undefined = globalThis.location
): string | undefined {
  const normalizedOrigin = normalizeBackendEndpoint(currentLocation?.origin)
  if (normalizedOrigin) {
    return normalizedOrigin
  }

  const protocol = normalizeBackendEndpoint(currentLocation?.protocol)
  const hostname = normalizeBackendEndpoint(currentLocation?.hostname)
  if (!protocol || !hostname) {
    return undefined
  }

  const port = normalizeBackendEndpoint(currentLocation?.port)
  return port ? `${protocol}//${hostname}:${port}` : `${protocol}//${hostname}`
}

function stripQueryAndHash(value: string): string | null {
  const [pathWithoutHash = ''] = value.split('#', 1)
  const [pathname] = pathWithoutHash.split('?', 1)
  return pathname || null
}
