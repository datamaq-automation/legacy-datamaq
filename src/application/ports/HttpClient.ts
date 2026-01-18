export interface HttpResponse<T = unknown> {
  ok: boolean
  status: number
  text?: string
  data?: T
}

export interface HttpClient {
  postJson<T = unknown>(url: string, body: unknown): Promise<HttpResponse<T>>
  options(url: string): Promise<HttpResponse>
}
