import { describe, expect, it, vi } from 'vitest'
import { SubmitContactUseCase } from '@/application/use-cases/submitContact'
import type { ContactGateway } from '@/application/contact/ports/ContactGateway'
import type { ContactBackendMonitor } from '@/application/contact/contactBackendStatus'
import type { LocationProvider, NavigatorProvider } from '@/application/ports/Environment'
import type { EventBus } from '@/application/ports/EventBus'
import type { LoggerPort } from '@/application/ports/Logger'
import type { LeadTracking } from '@/application/analytics/leadTracking'
import { ContactService } from '@/domain/contact/services/ContactService'

describe('SubmitContactUseCase', () => {
  it('submits, registers lead, and publishes event on success', async () => {
    const contactService = new ContactService()
    const contactGateway: ContactGateway = {
      submit: vi.fn().mockResolvedValue({ ok: true, data: undefined })
    }
    const contactBackend: ContactBackendMonitor = {
      ensureStatus: vi.fn().mockResolvedValue('available'),
      markAvailable: vi.fn(),
      markUnavailable: vi.fn(),
      getStatus: vi.fn(),
      subscribe: vi.fn()
    }
    const location: LocationProvider = {
      href: () => 'https://example.com',
      referrer: () => 'https://referrer.com',
      search: () => '?utm_source=test'
    }
    const navigator: NavigatorProvider = {
      userAgent: () => 'test-agent'
    }
    const eventBus: EventBus = {
      publish: vi.fn(),
      subscribe: vi.fn()
    }
    const leadTracking: LeadTracking = {
      registerLeadForThanksPage: vi.fn().mockReturnValue('lead_1'),
      trackGenerateLeadOnce: vi.fn()
    }
    const logger: LoggerPort = {
      debug: vi.fn(),
      warn: vi.fn(),
      error: vi.fn()
    }

    const useCase = new SubmitContactUseCase(
      contactService,
      contactGateway,
      contactBackend,
      location,
      navigator,
      eventBus,
      leadTracking,
      logger
    )

    const result = await useCase.execute('hero', {
      name: 'Test',
      email: 'test@example.com',
      company: 'Acme',
      message: 'Hola'
    })

    expect(result.ok).toBe(true)
    expect(contactGateway.submit).toHaveBeenCalledTimes(1)
    expect(leadTracking.registerLeadForThanksPage).toHaveBeenCalledTimes(1)
    expect(eventBus.publish).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'contact.submitted' })
    )
    expect(contactBackend.markAvailable).toHaveBeenCalledTimes(1)
  })
})
