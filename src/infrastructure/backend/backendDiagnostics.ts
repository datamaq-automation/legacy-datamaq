import { mapKeysToCamelCase } from '@/infrastructure/mappers/caseMapper'
import {
  describeBackendEndpoint,
  type BrowserLocationLike,
  type ResolvedBackendEndpoint
} from '@/infrastructure/backend/backendEndpoint'

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

export function extractBackendResponseMetadata(payload: unknown): BackendResponseMetadata {
  if (!isRecord(payload)) {
    return {}
  }

  const camelCasePayload = mapKeysToCamelCase<Partial<Record<BackendMetadataKey, unknown>>>(payload)
  const normalizedEntries = BACKEND_METADATA_KEYS.map((key) => [key, normalizeBackendString(camelCasePayload[key])])

  return Object.fromEntries(normalizedEntries) as BackendResponseMetadata
}

export function buildBackendEndpointContext(
  endpoint: string,
  currentLocation: BrowserLocationLike | undefined = globalThis.location
): Pick<ResolvedBackendEndpoint, 'configuredUrl' | 'browserUrl' | 'transportMode'> {
  return describeBackendEndpoint(endpoint, currentLocation)
}

export function normalizeBackendString(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null
  }

  const trimmed = value.trim()
  return trimmed ? trimmed : null
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
