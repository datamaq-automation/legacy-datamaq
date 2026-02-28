import type { AppTarget } from '@/infrastructure/content/runtimeProfile'
import { activeAppTarget } from '@/infrastructure/content/runtimeProfile'
import { publicConfig } from '@/infrastructure/config/publicConfig'
import {
  describeBackendEndpoint,
  isAbsoluteHttpBackendEndpoint,
  normalizeBackendEndpoint,
  type BrowserLocationLike,
  type ResolvedBackendEndpoint
} from '@/infrastructure/backend/backendEndpoint'

const DEFAULT_HEALTH_ENDPOINT = '/api/v1/health'

export function resolveHealthEndpoint(
  options: {
    runtimeEndpoint?: string
    configuredEndpoint?: string
    appTarget?: AppTarget
    currentLocation?: BrowserLocationLike
  } = {}
): ResolvedBackendEndpoint {
  const runtimeEndpoint = normalizeBackendEndpoint(options.runtimeEndpoint ?? publicConfig.healthApiUrl)
  const configuredEndpoint = normalizeBackendEndpoint(
    options.configuredEndpoint ?? import.meta.env.VITE_HEALTH_ENDPOINT
  )
  const appTarget = options.appTarget ?? activeAppTarget
  const currentLocation = options.currentLocation ?? globalThis.location

  if (shouldPreferRelativeHealthEndpoint(appTarget)) {
    const preferredDirectEndpoint = resolvePreferredDirectEndpoint(runtimeEndpoint, configuredEndpoint)
    if (preferredDirectEndpoint && shouldUseDirectHealthEndpointForCurrentOrigin(currentLocation)) {
      return describeBackendEndpoint(preferredDirectEndpoint, currentLocation)
    }

    if (configuredEndpoint?.startsWith('/')) {
      return describeBackendEndpoint(configuredEndpoint, currentLocation)
    }

    if (runtimeEndpoint?.startsWith('/')) {
      return describeBackendEndpoint(runtimeEndpoint, currentLocation)
    }

    if (runtimeEndpoint || configuredEndpoint) {
      return describeBackendEndpoint(DEFAULT_HEALTH_ENDPOINT, currentLocation)
    }

    return describeBackendEndpoint(DEFAULT_HEALTH_ENDPOINT, currentLocation)
  }

  return describeBackendEndpoint(
    configuredEndpoint ?? runtimeEndpoint ?? DEFAULT_HEALTH_ENDPOINT,
    currentLocation
  )
}

function resolvePreferredDirectEndpoint(
  runtimeEndpoint: string | undefined,
  configuredEndpoint: string | undefined
): string | undefined {
  if (isAbsoluteHttpBackendEndpoint(runtimeEndpoint)) {
    return runtimeEndpoint
  }

  if (isAbsoluteHttpBackendEndpoint(configuredEndpoint)) {
    return configuredEndpoint
  }

  return undefined
}

function shouldUseDirectHealthEndpointForCurrentOrigin(
  currentLocation: BrowserLocationLike | undefined
): boolean {
  if (!currentLocation) {
    return false
  }

  return (
    currentLocation.protocol === 'http:' &&
    currentLocation.hostname === 'localhost' &&
    currentLocation.port === '5173'
  )
}

function shouldPreferRelativeHealthEndpoint(appTarget: AppTarget): boolean {
  return appTarget === 'integration' || appTarget === 'e2e'
}
