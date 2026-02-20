import { beforeEach, describe, expect, it, vi } from 'vitest'
import { contactClientLogger } from '@/ui/logging/contactClientLogger'

describe('contactClientLogger', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('logs unavailable errors only once per key', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined)

    contactClientLogger.errorOnce('mail:backend-unavailable', 'backend-status:unavailable', {
      backendChannel: 'mail'
    })
    contactClientLogger.errorOnce('mail:backend-unavailable', 'backend-status:unavailable', {
      backendChannel: 'mail'
    })

    expect(errorSpy).toHaveBeenCalledTimes(1)
  })
})
