import { useContainer } from '@/di/container'
import type { ContactBackendStatus } from '@/application/contact/contactBackendStatus'

export type { ContactBackendStatus }
export type ContactBackendChannel = 'contact' | 'mail'

function resolveMonitor(channel: ContactBackendChannel = 'contact') {
  const container = useContainer()
  return channel === 'mail' ? container.mailBackend : container.contactBackend
}

export function getContactBackendStatus(channel: ContactBackendChannel = 'contact'): ContactBackendStatus {
  return resolveMonitor(channel).getStatus()
}

export function subscribeToContactBackendStatus(
  listener: (status: ContactBackendStatus) => void,
  channel: ContactBackendChannel = 'contact'
): () => void {
  return resolveMonitor(channel).subscribe(listener)
}

export async function ensureContactBackendStatus(
  channel: ContactBackendChannel = 'contact'
): Promise<ContactBackendStatus> {
  return resolveMonitor(channel).ensureStatus()
}
