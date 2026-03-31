import { mapKeysToCamelCase } from '@/infrastructure/mappers/caseMapper'
import {
  describeBackendEndpoint,
  resolveBackendPathname,
  type BrowserLocationLike,
  type ResolvedBackendEndpoint
} from '@/shared/backend/backendEndpoint'

const BACKEND_METADATA_KEYS = [
  'status',
  'requestId',
  'brandId',
  'version',
  'timestamp',
  'service',
  'contentRevision',
  'currency'
] as const

export type BackendMetadataKey = (typeof BACKEND_METADATA_KEYS)[number]

export type BackendResponseMetadata = Partial<Record<BackendMetadataKey, string | null>>

export type BackendInfoResource = 'health' | 'content' | 'pricing' | 'site'

export type BackendInfoPayload = {
  resource: BackendInfoResource
  endpoint: string
  pathname: string | null
  transportMode: ResolvedBackendEndpoint['transportMode']
  status: number
  backendStatus: string | null
  requestId: string | null
  version: string | null
  brandId: string | null
  timestamp: string | null
  details: Record<string, unknown> | null
}

function extractBackendResponseMetadata(payload: unknown): BackendResponseMetadata {
  if (!isRecord(payload)) {
    return {}
  }

  const camelCasePayload = mapKeysToCamelCase<Partial<Record<BackendMetadataKey, unknown>>>(payload)
  const normalizedEntries = BACKEND_METADATA_KEYS.map((key) => [key, normalizeBackendString(camelCasePayload[key])])

  return Object.fromEntries(normalizedEntries) as BackendResponseMetadata
}

function buildBackendEndpointContext(
  endpoint: string,
  currentLocation: BrowserLocationLike | undefined = globalThis.location
): Pick<ResolvedBackendEndpoint, 'configuredUrl' | 'browserUrl' | 'transportMode'> {
  return describeBackendEndpoint(endpoint, currentLocation)
}

export function buildBackendInfoPayload(options: {
  resource: BackendInfoResource
  endpoint: string
  status: number
  payload?: unknown
  metadata?: BackendResponseMetadata
  details?: Record<string, unknown> | null
  currentLocation?: BrowserLocationLike
}): BackendInfoPayload {
  const metadata = options.metadata ?? extractBackendResponseMetadata(options.payload)
  const endpointContext = buildBackendEndpointContext(options.endpoint, options.currentLocation)

  return {
    resource: options.resource,
    endpoint: endpointContext.browserUrl,
    pathname: resolveBackendPathname(options.endpoint, options.currentLocation),
    transportMode: endpointContext.transportMode,
    status: options.status,
    backendStatus: metadata.status ?? null,
    requestId: metadata.requestId ?? null,
    version: metadata.version ?? null,
    brandId: metadata.brandId ?? null,
    timestamp: metadata.timestamp ?? null,
    details: normalizeBackendInfoDetails(options.details)
  }
}

function normalizeBackendString(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null
  }

  const trimmed = value.trim()
  return trimmed ? trimmed : null
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function normalizeBackendInfoDetails(value: Record<string, unknown> | null | undefined): Record<string, unknown> | null {
  if (!value) {
    return null
  }

  const sanitizedEntries = Object.entries(value).filter(([, entry]) => entry !== undefined && entry !== null)
  if (sanitizedEntries.length === 0) {
    return null
  }

  return Object.fromEntries(sanitizedEntries)
}
