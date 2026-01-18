import { container } from '@/di/container'
import type { ContactBackendStatus } from '@/application/services/contactBackendStatus'

export type { ContactBackendStatus }

export function getContactBackendStatus(): ContactBackendStatus {
  return container.contactBackend.getStatus()
}

export function subscribeToContactBackendStatus(
  listener: (status: ContactBackendStatus) => void
): () => void {
  return container.contactBackend.subscribe(listener)
}

export async function ensureContactBackendStatus(): Promise<ContactBackendStatus> {
  return container.contactBackend.ensureStatus()
}
