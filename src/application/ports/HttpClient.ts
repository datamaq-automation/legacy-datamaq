export interface HttpResponse {
  ok: boolean
  status: number
  text?: string
}

export interface HttpClient {
  postJson(url: string, body: unknown): Promise<HttpResponse>
  options(url: string): Promise<HttpResponse>
}
