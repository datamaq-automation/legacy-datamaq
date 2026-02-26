export interface HttpResponse<T = unknown> {
  ok: boolean
  status: number
  text?: string
  data?: T
  headers?: Record<string, string>
}

export interface HttpRequestOptions {
  headers?: Record<string, string>
  timeoutMs?: number
  retries?: number
}

export interface HttpClient {
  get<T = unknown>(url: string, options?: HttpRequestOptions): Promise<HttpResponse<T>>
  postJson<T = unknown>(
    url: string,
    body: unknown,
    headers?: Record<string, string>,
    options?: Omit<HttpRequestOptions, 'headers'>
  ): Promise<HttpResponse<T>>
  patchJson<T = unknown>(
    url: string,
    body: unknown,
    headers?: Record<string, string>,
    options?: Omit<HttpRequestOptions, 'headers'>
  ): Promise<HttpResponse<T>>
  options(url: string, options?: Omit<HttpRequestOptions, 'headers'>): Promise<HttpResponse>
}
