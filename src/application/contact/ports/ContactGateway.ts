import type { ContactSubmitPayload } from '../dto/contact'
import type { Result } from '@/domain/shared/result'

import type { ContactError } from '../types/errors'

export interface ContactGateway {
  submit(payload: ContactSubmitPayload): Promise<Result<void, ContactError>>
}

