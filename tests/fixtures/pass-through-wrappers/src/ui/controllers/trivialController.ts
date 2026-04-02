import { useContainer } from '@/di/container'

export function getStatus(): string {
  return useContainer().contactBackend.getStatus()
}

export async function ensureStatus(): Promise<string> {
  return useContainer().contactBackend.ensureStatus()
}
