/*
Path: src/infrastructure/health/probeBackendHealth.ts
*/

import type { HttpClient } from '@/application/ports/HttpClient'
import { emitRuntimeWarn } from '@/application/utils/runtimeConsole'
import {
  buildBackendEndpointContext,
  emitBackendInfo,
  extractBackendResponseMetadata
} from '@/infrastructure/backend/backendDiagnostics'
import { resolveBackendPathname } from '@/infrastructure/backend/backendEndpoint'
import { FetchHttpClient } from '@/infrastructure/http/fetchHttpClient'
import { resolveHealthEndpoint } from '@/infrastructure/health/healthEndpointResolver'
import { NoopLogger } from '@/infrastructure/logging/noopLogger'

const HEALTH_ENDPOINT = resolveHealthEndpoint()

export type BackendHealthProbeResult = {
  endpoint: string
  ok: boolean
  status: number
  service: string | null
  brandId: string | null
  version: string | null
  timestamp: string | null
  health: string | null
}

export async function probeBackendHealth(
  endpoint: string = HEALTH_ENDPOINT.configuredUrl,
  http: HttpClient = new FetchHttpClient(new NoopLogger())
): Promise<BackendHealthProbeResult> {
  try {
    const response = await http.get<{
      status?: unknown
      service?: unknown
      brand_id?: unknown
      brandId?: unknown
      version?: unknown
      timestamp?: unknown
    }>(endpoint, {
      headers: {
        Accept: 'application/json'
      },
      timeoutMs: 5_000,
      retries: 1
    })

    if (!response.ok) {
      const reason = response.status === 0 ? 'network-error' : 'http-error'
      const warningLabel = response.status === 0 ? '[backend:health] error de red' : '[backend:health] sin conexion'
      const result: BackendHealthProbeResult = {
        endpoint,
        ok: false,
        status: response.status,
        service: null,
        brandId: null,
        version: null,
        timestamp: null,
        health: null
      }

      const endpointContext = buildBackendEndpointContext(endpoint)
      emitRuntimeWarn(warningLabel, {
        pathname: resolveBackendPathname(endpoint),
        transportMode: endpointContext.transportMode,
        status: response.status,
        reason
      })
      return result
    }

    const metadata = extractBackendResponseMetadata(response.data)
    const service = metadata.service ?? null
    const brandId = metadata.brandId ?? null
    const version = metadata.version ?? null
    const timestamp = metadata.timestamp ?? null
    const health = metadata.status ?? null
    const result: BackendHealthProbeResult = {
      endpoint,
      ok: true,
      status: response.status,
      service,
      brandId,
      version,
      timestamp,
      health
    }

    emitBackendInfo({
      resource: 'health',
      endpoint,
      status: response.status,
      metadata,
      details: {
        service
      }
    })
    return result
  } catch (error) {
    const result: BackendHealthProbeResult = {
      endpoint,
      ok: false,
      status: 0,
      service: null,
      brandId: null,
      version: null,
      timestamp: null,
      health: null
    }

    const endpointContext = buildBackendEndpointContext(endpoint)
    emitRuntimeWarn('[backend:health] error de red', {
      pathname: resolveBackendPathname(endpoint),
      transportMode: endpointContext.transportMode,
      status: 0,
      reason: 'network-error'
    })
    return result
  }
}
