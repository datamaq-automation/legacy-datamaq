import type { HttpClient, HttpResponse, HttpRequestOptions } from '@/application/ports/HttpClient'
import type { LoggerPort } from '@/application/ports/Logger'

export class FetchHttpClient implements HttpClient {
  private static readonly DEFAULT_TIMEOUT_MS = 10_000

  constructor(private logger: LoggerPort) {}

  async get<T = unknown>(url: string, options: HttpRequestOptions = {}): Promise<HttpResponse<T>> {
    return this.requestWithBody<T>('GET', url, undefined, options.headers, options)
  }

  async postJson<T = unknown>(
    url: string,
    body: unknown,
    headers: Record<string, string> = {},
    options: Omit<HttpRequestOptions, 'headers'> = {}
  ): Promise<HttpResponse<T>> {
    return this.requestWithBody<T>('POST', url, body, headers, options)
  }

  async patchJson<T = unknown>(
    url: string,
    body: unknown,
    headers: Record<string, string> = {},
    options: Omit<HttpRequestOptions, 'headers'> = {}
  ): Promise<HttpResponse<T>> {
    return this.requestWithBody<T>('PATCH', url, body, headers, options)
  }

  async options(url: string, options: Omit<HttpRequestOptions, 'headers'> = {}): Promise<HttpResponse> {
    try {
      this.logger.debug('[http] OPTIONS request', { url })
      const response = await this.fetchWithRetry(url, {
        method: 'OPTIONS',
        mode: 'cors'
      }, options)

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

  private async requestWithBody<T>(
    method: 'GET' | 'POST' | 'PATCH',
    url: string,
    body: unknown,
    headers: Record<string, string> = {},
    options: Omit<HttpRequestOptions, 'headers'> = {}
  ): Promise<HttpResponse<T>> {
    const requestHeaders: Record<string, string> =
      method === 'GET' ? { ...headers } : { 'Content-Type': 'application/json', ...headers }
    const logPrefix = `[http] ${method} JSON`
    try {
      this.logger.debug(`${logPrefix} request`, {
        url,
        headers: Object.keys(requestHeaders)
      })
      const response = await this.fetchWithRetry(
        url,
        {
          method,
          headers: requestHeaders,
          mode: 'cors',
          credentials: 'include',
          ...(method === 'GET' ? {} : { body: JSON.stringify(body) })
        },
        options
      )

      const responseHeaders = extractResponseHeaders(response.headers)
      const contentType = responseHeaders['content-type'] ?? ''
      const acceptHeader = requestHeaders['Accept'] ?? requestHeaders['accept'] ?? ''
      const expectsPdf = typeof acceptHeader === 'string' && acceptHeader.includes('application/pdf')
      if (method === 'GET' && (contentType.includes('application/pdf') || (expectsPdf && response.ok))) {
        let blob = await response.blob().catch(() => undefined)
        if (!blob) {
          const buffer = await response.arrayBuffer().catch(() => undefined)
          if (buffer) {
            blob = new Blob([buffer], { type: contentType || 'application/pdf' })
          }
        }
        if (!blob) {
          const rawPdfText = await response.text().catch(() => undefined)
          if (typeof rawPdfText === 'string') {
            blob = new Blob([rawPdfText], { type: contentType || 'application/pdf' })
          }
        }
        if (!blob) {
          blob = new Blob([], { type: contentType || 'application/pdf' })
        }
        return {
          ok: response.ok,
          status: response.status,
          headers: responseHeaders,
          data: { blob } as T
        }
      }

      const rawText = await response.text().catch(() => undefined)
      const data = parseJson<T>(rawText)
      const text = normalizeErrorText(rawText)
      this.logger.debug(`${logPrefix} response`, {
        url,
        status: response.status,
        ok: response.ok,
        text
      })
      if (!response.ok) {
        this.logger.warn(`${logPrefix} no OK:`, {
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
      this.logger.error(`${logPrefix} error:`, { url, headers: requestHeaders, error })
      return {
        ok: false,
        status: 0
      }
    }
  }

  private async fetchWithRetry(
    url: string,
    init: RequestInit,
    options: Omit<HttpRequestOptions, 'headers'>
  ): Promise<Response> {
    const retries = Math.max(0, options.retries ?? 0)
    const timeoutMs = Math.max(1, options.timeoutMs ?? FetchHttpClient.DEFAULT_TIMEOUT_MS)
    const baseDelayMs = 1000 // Base para backoff exponencial: 1s, 2s, 4s

    let attempt = 0
    let lastError: unknown
    while (attempt <= retries) {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs)
      try {
        const response = await fetch(url, {
          ...init,
          signal: controller.signal
        })
        clearTimeout(timeoutId)
        if (response.status >= 500 && attempt < retries) {
          await this.delay(baseDelayMs * Math.pow(2, attempt))
          attempt += 1
          continue
        }
        return response
      } catch (error) {
        clearTimeout(timeoutId)
        lastError = error
        if (attempt >= retries) {
          throw error
        }
        await this.delay(baseDelayMs * Math.pow(2, attempt))
        attempt += 1
      }
    }

    throw lastError instanceof Error ? lastError : new Error('request failed')
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
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
