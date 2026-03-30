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
    currentLocation?: BrowserLocationLike
  } = {}
): ResolvedBackendEndpoint {
  const runtimeEndpoint = normalizeBackendEndpoint(options.runtimeEndpoint ?? publicConfig.healthApiUrl)
  const configuredEndpoint = normalizeBackendEndpoint(
    options.configuredEndpoint ?? import.meta.env.VITE_HEALTH_ENDPOINT
  )
  const currentLocation = options.currentLocation ?? globalThis.location

  if (configuredEndpoint?.startsWith('/')) {
    return describeBackendEndpoint(configuredEndpoint, currentLocation)
  }

  if (runtimeEndpoint?.startsWith('/')) {
    return describeBackendEndpoint(runtimeEndpoint, currentLocation)
  }

  return describeBackendEndpoint(configuredEndpoint ?? runtimeEndpoint ?? DEFAULT_HEALTH_ENDPOINT, currentLocation)
}
