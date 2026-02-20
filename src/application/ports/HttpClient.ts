export interface HttpResponse<T = unknown> {
  ok: boolean
  status: number
  text?: string
  data?: T
  headers?: Record<string, string>
}

export interface HttpClient {
  postJson<T = unknown>(
    url: string,
    body: unknown,
    headers?: Record<string, string>
  ): Promise<HttpResponse<T>>
  patchJson<T = unknown>(
    url: string,
    body: unknown,
    headers?: Record<string, string>
  ): Promise<HttpResponse<T>>
  options(url: string): Promise<HttpResponse>
}
