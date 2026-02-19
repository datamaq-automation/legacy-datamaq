import type { EmailContactPayload } from '@/application/dto/contact'
import type { Result } from '@/domain/shared/result'
import type { ContactError } from '@/application/types/errors'
import { useContainer } from '@/di/container'

export function useContactFacade() {
  const container = useContainer()

  function submitContact(section: string, payload: EmailContactPayload): Promise<Result<void, ContactError>> {
    return container.useCases.submitContact.execute(section, payload)
  }

  function submitMail(section: string, payload: EmailContactPayload): Promise<Result<void, ContactError>> {
    return container.useCases.submitMail.execute(section, payload)
  }

  return {
    submitContact,
    submitMail,
    contactBackend: container.contactBackend
  }
}
