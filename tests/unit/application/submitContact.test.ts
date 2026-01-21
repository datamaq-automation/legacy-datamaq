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

  it('returns validation error when domain validation fails', async () => {
    const contactService = new ContactService()
    const contactGateway: ContactGateway = {
      submit: vi.fn()
    }
    const contactBackend: ContactBackendMonitor = {
      ensureStatus: vi.fn(),
      markAvailable: vi.fn(),
      markUnavailable: vi.fn(),
      getStatus: vi.fn(),
      subscribe: vi.fn()
    }
    const location: LocationProvider = {
      href: () => 'https://example.com',
      referrer: () => '',
      search: () => ''
    }
    const navigator: NavigatorProvider = {
      userAgent: () => 'test-agent'
    }
    const eventBus: EventBus = {
      publish: vi.fn(),
      subscribe: vi.fn()
    }
    const leadTracking: LeadTracking = {
      registerLeadForThanksPage: vi.fn(),
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
      name: 'A',
      email: 'invalid',
      company: 'Acme',
      message: 'Hola'
    })

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.type).toBe('ValidationError')
    }
    expect(contactGateway.submit).not.toHaveBeenCalled()
  })

  it('returns unavailable when backend is not available', async () => {
    const contactService = new ContactService()
    const contactGateway: ContactGateway = {
      submit: vi.fn()
    }
    const contactBackend: ContactBackendMonitor = {
      ensureStatus: vi.fn().mockResolvedValue('unavailable'),
      markAvailable: vi.fn(),
      markUnavailable: vi.fn(),
      getStatus: vi.fn(),
      subscribe: vi.fn()
    }
    const location: LocationProvider = {
      href: () => 'https://example.com',
      referrer: () => '',
      search: () => ''
    }
    const navigator: NavigatorProvider = {
      userAgent: () => 'test-agent'
    }
    const eventBus: EventBus = {
      publish: vi.fn(),
      subscribe: vi.fn()
    }
    const leadTracking: LeadTracking = {
      registerLeadForThanksPage: vi.fn(),
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

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.type).toBe('Unavailable')
    }
    expect(contactGateway.submit).not.toHaveBeenCalled()
  })

  it('marks backend unavailable on 5xx errors', async () => {
    const contactService = new ContactService()
    const contactGateway: ContactGateway = {
      submit: vi.fn().mockResolvedValue({
        ok: false,
        error: { type: 'BackendError', status: 503 }
      })
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
      referrer: () => '',
      search: () => ''
    }
    const navigator: NavigatorProvider = {
      userAgent: () => 'test-agent'
    }
    const eventBus: EventBus = {
      publish: vi.fn(),
      subscribe: vi.fn()
    }
    const leadTracking: LeadTracking = {
      registerLeadForThanksPage: vi.fn(),
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

    expect(result.ok).toBe(false)
    expect(contactBackend.markUnavailable).toHaveBeenCalled()
  })

  it('marks backend available on non-network non-5xx errors', async () => {
    const contactService = new ContactService()
    const contactGateway: ContactGateway = {
      submit: vi.fn().mockResolvedValue({
        ok: false,
        error: { type: 'BackendError', status: 400 }
      })
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
      referrer: () => '',
      search: () => ''
    }
    const navigator: NavigatorProvider = {
      userAgent: () => 'test-agent'
    }
    const eventBus: EventBus = {
      publish: vi.fn(),
      subscribe: vi.fn()
    }
    const leadTracking: LeadTracking = {
      registerLeadForThanksPage: vi.fn(),
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

    expect(result.ok).toBe(false)
    expect(contactBackend.markAvailable).toHaveBeenCalled()
  })

  it('does not update backend state on network errors', async () => {
    const contactService = new ContactService()
    const contactGateway: ContactGateway = {
      submit: vi.fn().mockResolvedValue({
        ok: false,
        error: { type: 'NetworkError' }
      })
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
      referrer: () => '',
      search: () => ''
    }
    const navigator: NavigatorProvider = {
      userAgent: () => 'test-agent'
    }
    const eventBus: EventBus = {
      publish: vi.fn(),
      subscribe: vi.fn()
    }
    const leadTracking: LeadTracking = {
      registerLeadForThanksPage: vi.fn(),
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

    expect(result.ok).toBe(false)
    expect(contactBackend.markAvailable).not.toHaveBeenCalled()
    expect(contactBackend.markUnavailable).not.toHaveBeenCalled()
  })
})
