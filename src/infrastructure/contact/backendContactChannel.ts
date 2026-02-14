import type { HttpClient, HttpResponse } from '@/application/ports/HttpClient'
import type { ContactPayloadBundle } from './contactPayloadBuilder'

export async function submitBackendContact(
  http: HttpClient,
  apiUrl: string,
  payloads: ContactPayloadBundle,
  headers?: Record<string, string>
): Promise<HttpResponse> {
  return http.postJson(apiUrl, payloads.backendPayload, headers)
}
