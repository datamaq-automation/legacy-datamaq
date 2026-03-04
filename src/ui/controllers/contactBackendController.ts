import { useContainer } from '@/di/container'
import type { ContactBackendStatus } from '@/application/contact/contactBackendStatus'

export type { ContactBackendStatus }

function resolveMonitor() {
  return useContainer().contactBackend
}

export function getContactBackendStatus(): ContactBackendStatus {
  return resolveMonitor().getStatus()
}

export function subscribeToContactBackendStatus(
  listener: (status: ContactBackendStatus) => void
): () => void {
  return resolveMonitor().subscribe(listener)
}

export async function ensureContactBackendStatus(): Promise<ContactBackendStatus> {
  return resolveMonitor().ensureStatus()
}
