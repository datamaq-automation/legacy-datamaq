import { useContainer } from '@/di/container'
import type { EmailContactPayload } from '@/application/use-cases/submitEmailContact'

export function getChatEnabled(): boolean {
  return Boolean(useContainer().config.whatsappNumber)
}

export function getContactEmail(): string | undefined {
  const value = useContainer().config.contactEmail
  return value?.trim() ? value : undefined
}

export function openWhatsApp(section: string = 'fab'): void {
  void useContainer().useCases.openWhatsapp.execute(section)
}

export function submitEmailContact(section: string, payload: EmailContactPayload) {
  return useContainer().useCases.submitEmailContact.execute(section, payload)
}
