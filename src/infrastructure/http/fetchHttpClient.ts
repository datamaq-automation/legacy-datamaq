import type { HttpClient, HttpResponse } from '@/application/ports/HttpClient'
import type { LoggerPort } from '@/application/ports/Logger'
import type { JsonValue } from '@/application/types/json'

export class FetchHttpClient implements HttpClient {
  constructor(private logger: LoggerPort) {}

  async postJson<T = unknown>(
    url: string,
    body: unknown,
    headers: Record<string, string> = {}
  ): Promise<HttpResponse<T>> {
    try {
      this.logger.debug('[http] POST JSON request', {
        url,
        headers: Object.keys(headers)
      })
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: JSON.stringify(body)
      })

      const rawText = await response.text().catch(() => undefined)
      const data = parseJson<T>(rawText)
      const text = normalizeErrorText(rawText)
      const responseHeaders = extractResponseHeaders(response.headers)
      this.logger.debug('[http] POST JSON response', {
        url,
        status: response.status,
        ok: response.ok,
        text
      })
      if (!response.ok) {
        this.logger.warn('[http] POST JSON no OK:', {
          url,
          status: response.status,
          text
        })
      }
      return {
        ok: response.ok,
        status: response.status,
        headers: responseHeaders,
        ...(text ? { text } : {}),
        ...(typeof data !== 'undefined' ? { data } : {})
      }
    } catch (error) {
      this.logger.error('[http] Error en POST JSON:', { url, headers, error })
      return {
        ok: false,
        status: 0
      }
    }
  }

  async patchJson<T = unknown>(
    url: string,
    body: unknown,
    headers: Record<string, string> = {}
  ): Promise<HttpResponse<T>> {
    try {
      this.logger.debug('[http] PATCH JSON request', {
        url,
        headers: Object.keys(headers)
      })
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: JSON.stringify(body)
      })

      const rawText = await response.text().catch(() => undefined)
      const data = parseJson<T>(rawText)
      const text = normalizeErrorText(rawText)
      const responseHeaders = extractResponseHeaders(response.headers)
      this.logger.debug('[http] PATCH JSON response', {
        url,
        status: response.status,
        ok: response.ok,
        text
      })
      if (!response.ok) {
        this.logger.warn('[http] PATCH JSON no OK:', {
          url,
          status: response.status,
          text
        })
      }
      return {
        ok: response.ok,
        status: response.status,
        headers: responseHeaders,
        ...(text ? { text } : {}),
        ...(typeof data !== 'undefined' ? { data } : {})
      }
    } catch (error) {
      this.logger.error('[http] Error en PATCH JSON:', { url, headers, error })
      return {
        ok: false,
        status: 0
      }
    }
  }

  async options(url: string): Promise<HttpResponse> {
    try {
      this.logger.debug('[http] OPTIONS request', { url })
      const response = await fetch(url, {
        method: 'OPTIONS',
        mode: 'cors'
      })

      this.logger.debug('[http] OPTIONS response', {
        url,
        status: response.status,
        ok: response.ok
      })

      return {
        ok: response.ok,
        status: response.status,
        headers: extractResponseHeaders(response.headers)
      }
    } catch (error) {
      this.logger.warn('[http] Error en OPTIONS:', { url, error })
      return {
        ok: false,
        status: 0
      }
    }
  }
}

function parseJson<T>(rawText: string | undefined): T | undefined {
  if (!rawText) {
    return undefined
  }
  try {
    return JSON.parse(rawText) as T
  } catch {
    return undefined
  }
}

function normalizeErrorText(rawText: string | undefined): string | undefined {
  if (!rawText) {
    return rawText
  }

  try {
    const parsed = JSON.parse(rawText) as { error?: string }
    if (parsed?.error) {
      return parsed.error
    }
  } catch {
    return rawText
  }

  return rawText
}

function extractResponseHeaders(headers: Headers): Record<string, string> {
  const entries = Array.from(headers.entries()).map(([key, value]) => [key.toLowerCase(), value] as const)
  return Object.fromEntries(entries)
}
