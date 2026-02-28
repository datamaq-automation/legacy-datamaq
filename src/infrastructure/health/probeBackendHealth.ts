/*
Path: src/infrastructure/health/probeBackendHealth.ts
*/

import type { HttpClient } from '@/application/ports/HttpClient'
import { publicConfig } from '@/infrastructure/config/publicConfig'
import { activeAppTarget } from '@/infrastructure/content/runtimeProfile'
import { FetchHttpClient } from '@/infrastructure/http/fetchHttpClient'
import { NoopLogger } from '@/infrastructure/logging/noopLogger'
import { mapKeysToCamelCase } from '@/infrastructure/mappers/caseMapper'

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
  endpoint: string = HEALTH_ENDPOINT,
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

      console.warn('[backend:health] sin conexion', {
        endpoint,
        status: response.status
      })
      return result
    }

    const payload = mapKeysToCamelCase<{
      status?: unknown
      service?: unknown
      brandId?: unknown
      version?: unknown
      timestamp?: unknown
    }>(response.data)

    const service = normalize(payload?.service)
    const brandId = normalize(payload?.brandId)
    const version = normalize(payload?.version)
    const timestamp = normalize(payload?.timestamp)
    const health = normalize(payload?.status)
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

    console.info('[backend:health] conexion OK', {
      endpoint,
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

    console.warn('[backend:health] error de red', {
      endpoint,
      error
    })
    return result
  }
}

function normalize(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null
  }
  const trimmed = value.trim()
  return trimmed ? trimmed : null
}

function resolveHealthEndpoint(): string {
  const runtimeEndpoint = normalizeEndpoint(publicConfig.healthApiUrl)
  const configuredEndpoint = normalizeEndpoint(import.meta.env.VITE_HEALTH_ENDPOINT)

  if (prefersRelativeHealthEndpoint()) {
    if (configuredEndpoint?.startsWith('/')) {
      return configuredEndpoint
    }

    if (runtimeEndpoint) {
      return runtimeEndpoint
    }

    return '/api/v1/health'
  }

  if (configuredEndpoint) {
    return configuredEndpoint
  }

  if (runtimeEndpoint) {
    return runtimeEndpoint
  }

  return '/api/v1/health'
}

function normalizeEndpoint(value: string | undefined): string | undefined {
  const trimmed = value?.trim()
  return trimmed ? trimmed : undefined
}

function prefersRelativeHealthEndpoint(): boolean {
  return activeAppTarget === 'integration' || activeAppTarget === 'e2e'
}
