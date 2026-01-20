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
      if (import.meta.env.DEV) {
        console.log('[http] POST JSON request:', {
          url,
          headers: Object.keys(headers),
          body
        })
      }
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
      if (import.meta.env.DEV) {
        console.log('[http] POST JSON response:', {
          url,
          status: response.status,
          ok: response.ok,
          text
        })
      }
      if (!response.ok) {
        this.logger.warn('[http] POST JSON no OK:', {
          url,
          status: response.status,
          text
        })
        if (import.meta.env.DEV) {
          console.warn('[http] POST JSON no OK (debug):', {
            url,
            status: response.status,
            text
          })
        }
      }
      return {
        ok: response.ok,
        status: response.status,
        ...(text ? { text } : {}),
        ...(typeof data !== 'undefined' ? { data } : {})
      }
    } catch (error) {
      this.logger.error('[http] Error en POST JSON:', error)
      if (import.meta.env.DEV) {
        console.error('[http] POST JSON exception:', { url, body, headers, error })
      }
      return {
        ok: false,
        status: 0
      }
    }
  }

  async options(url: string): Promise<HttpResponse> {
    try {
      const response = await fetch(url, {
        method: 'OPTIONS',
        mode: 'cors'
      })

      return {
        ok: response.ok,
        status: response.status
      }
    } catch (error) {
      this.logger.warn('[http] Error en OPTIONS:', error)
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
