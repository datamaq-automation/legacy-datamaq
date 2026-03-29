import type { AppTarget } from '@/infrastructure/content/runtimeProfile'
import { activeAppTarget } from '@/infrastructure/content/runtimeProfile'
import { publicConfig } from '@/infrastructure/config/publicConfig'
import {
  describeBackendEndpoint,
  normalizeBackendEndpoint,
  type BrowserLocationLike,
  type ResolvedBackendEndpoint
} from '@/shared/backend/backendEndpoint'

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

function shouldPreferRelativeHealthEndpoint(appTarget: AppTarget): boolean {
  return appTarget === 'integration' || appTarget === 'e2e'
}
