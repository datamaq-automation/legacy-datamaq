import type { EmailContactPayload } from '@/application/dto/contact'
import { useContainer } from '@/di/container'
import { useContactFacade } from '@/ui/features/contact/useContactFacade'

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

export function submitContact(section: string, payload: EmailContactPayload) {
  return useContactFacade().submitContact(section, payload)
}
