import type { ContactSubmitPayload } from '@/application/dto/contact'
import type { Result } from '@/domain/shared/result'
import type { ContactError } from '@/application/types/errors'

export interface ContactGateway {
  submit(payload: ContactSubmitPayload): Promise<Result<void, ContactError>>
}

