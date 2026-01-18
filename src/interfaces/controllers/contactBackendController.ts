import { useContainer } from '@/di/container'
import type { ContactBackendStatus } from '@/application/services/contactBackendStatus'

export type { ContactBackendStatus }

export function getContactBackendStatus(): ContactBackendStatus {
  return useContainer().contactBackend.getStatus()
}

export function subscribeToContactBackendStatus(
  listener: (status: ContactBackendStatus) => void
): () => void {
  return useContainer().contactBackend.subscribe(listener)
}

export async function ensureContactBackendStatus(): Promise<ContactBackendStatus> {
  return useContainer().contactBackend.ensureStatus()
}
