import type { HttpClient, HttpResponse } from '@/application/ports/HttpClient'
import type { LoggerPort } from '@/application/ports/Logger'

export class FetchHttpClient implements HttpClient {
  constructor(private logger: LoggerPort) {}

  async postJson(url: string, body: unknown): Promise<HttpResponse> {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })

      const rawText = await response.text().catch(() => undefined)
      const text = normalizeErrorText(rawText)
      return {
        ok: response.ok,
        status: response.status,
        text
      }
    } catch (error) {
      this.logger.error('[http] Error en POST JSON:', error)
      throw error
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
      throw error
    }
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
