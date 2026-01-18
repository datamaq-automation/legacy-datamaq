import { container } from '@/di/container'
import type { EmailContactPayload } from '@/application/use-cases/submitEmailContact'

export function getChatEnabled(): boolean {
  return Boolean(container.config.whatsappNumber)
}

export function getContactEmail(): string | undefined {
  const value = container.config.contactEmail
  return value?.trim() ? value : undefined
}

export function openWhatsApp(section: string = 'fab'): void {
  void container.useCases.openWhatsapp.execute(section)
}

export function submitEmailContact(section: string, payload: EmailContactPayload) {
  return container.useCases.submitEmailContact.execute(section, payload)
}
