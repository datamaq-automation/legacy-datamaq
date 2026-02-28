/*
Path: src/infrastructure/health/probeBackendHealth.ts
*/

import type { HttpClient } from '@/application/ports/HttpClient'
import { buildBackendEndpointContext, extractBackendResponseMetadata } from '@/infrastructure/backend/backendDiagnostics'
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
      console.warn('[backend:health] sin conexion', {
        endpoint: endpointContext.browserUrl,
        transportMode: endpointContext.transportMode,
        status: response.status
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

    const endpointContext = buildBackendEndpointContext(endpoint)
    console.info('[backend:health] conexion OK', {
      endpoint: endpointContext.browserUrl,
      transportMode: endpointContext.transportMode,
      status: response.status,
      service,
      brandId,
      version,
      timestamp,
      health
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
    console.warn('[backend:health] error de red', {
      endpoint: endpointContext.browserUrl,
      transportMode: endpointContext.transportMode,
      status: 0,
      error
    })
    return result
  }
}
