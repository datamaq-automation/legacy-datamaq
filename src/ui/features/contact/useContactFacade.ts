import type { ContactFormPayload } from '@/application/dto/contact'
import type { Result } from '@/domain/shared/result'
import type { ContactError } from '@/application/types/errors'
import type { ContactSubmitSuccess } from '@/application/dto/contact'
import { useContainer } from '@/di/container'

export function useContactFacade() {
  const container = useContainer()

  function submitContact(
    payload: ContactFormPayload
  ): Promise<Result<ContactSubmitSuccess, ContactError>> {
    return container.useCases.submitContact.execute(payload)
  }

  return {
    submitContact
  }
}
