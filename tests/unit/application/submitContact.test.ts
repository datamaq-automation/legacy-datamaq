import { describe, expect, it, vi } from 'vitest'
import { SubmitContactUseCase } from '@/application/use-cases/submitContact'
import type { ContactGateway } from '@/application/contact/ports/ContactGateway'
import type { ContactBackendMonitor } from '@/application/contact/contactBackendStatus'
import type { Clock, LocationProvider, NavigatorProvider } from '@/application/ports/Environment'
import type { LeadTracking } from '@/application/analytics/leadTracking'

describe('SubmitContactUseCase', () => {
  it('submits and registers lead on success', async () => {
    const contactGateway: ContactGateway = {
      submit: vi.fn().mockResolvedValue({ ok: true, data: {} })
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
    const leadTracking: LeadTracking = {
      registerLeadForThanksPage: vi.fn().mockReturnValue('lead_1'),
      trackGenerateLeadOnce: vi.fn()
    }
    const clock: Clock = { now: () => 1700000000000 }

    const useCase = new SubmitContactUseCase(
      contactGateway,
      contactBackend,
      location,
      navigator,
      leadTracking,
      clock
    )

    const result = await useCase.execute({
      firstName: 'Test',
      lastName: 'User',
      company: 'Acme',
      email: 'test@example.com',
      phone: '',
      geographicLocation: 'Escobar',
      comment: 'Hola'
    })

    expect(result.ok).toBe(true)
    expect(contactGateway.submit).toHaveBeenCalledTimes(1)
    expect(leadTracking.registerLeadForThanksPage).toHaveBeenCalledTimes(1)
    expect(contactBackend.markAvailable).toHaveBeenCalledTimes(1)
  })

  it('returns validation error when domain validation fails', async () => {
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
    const leadTracking: LeadTracking = {
      registerLeadForThanksPage: vi.fn(),
      trackGenerateLeadOnce: vi.fn()
    }
    const clock: Clock = { now: () => 1700000000000 }

    const useCase = new SubmitContactUseCase(
      contactGateway,
      contactBackend,
      location,
      navigator,
      leadTracking,
      clock
    )

    const result = await useCase.execute({
      firstName: '',
      lastName: '',
      company: 'Acme',
      email: 'invalid',
      phone: '',
      geographicLocation: '',
      comment: 'Hola'
    })

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.type).toBe('ValidationError')
    }
    expect(contactGateway.submit).not.toHaveBeenCalled()
  })

  it('returns unavailable when backend is not available', async () => {
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
    const leadTracking: LeadTracking = {
      registerLeadForThanksPage: vi.fn(),
      trackGenerateLeadOnce: vi.fn()
    }
    const clock: Clock = { now: () => 1700000000000 }

    const useCase = new SubmitContactUseCase(
      contactGateway,
      contactBackend,
      location,
      navigator,
      leadTracking,
      clock
    )

    const result = await useCase.execute({
      firstName: '',
      lastName: '',
      company: 'Acme',
      email: 'test@example.com',
      phone: '+54 11 5555 4444',
      geographicLocation: '',
      comment: 'Hola'
    })

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.type).toBe('Unavailable')
    }
    expect(contactGateway.submit).not.toHaveBeenCalled()
  })

  it('marks backend unavailable on 5xx errors', async () => {
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
    const leadTracking: LeadTracking = {
      registerLeadForThanksPage: vi.fn(),
      trackGenerateLeadOnce: vi.fn()
    }
    const clock: Clock = { now: () => 1700000000000 }

    const useCase = new SubmitContactUseCase(
      contactGateway,
      contactBackend,
      location,
      navigator,
      leadTracking,
      clock
    )

    const result = await useCase.execute({
      firstName: '',
      lastName: '',
      company: 'Acme',
      email: 'test@example.com',
      phone: '+54 11 5555 4444',
      geographicLocation: '',
      comment: 'Hola'
    })

    expect(result.ok).toBe(false)
    expect(contactBackend.markUnavailable).toHaveBeenCalled()
  })

  it('marks backend available on non-network non-5xx errors', async () => {
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
    const leadTracking: LeadTracking = {
      registerLeadForThanksPage: vi.fn(),
      trackGenerateLeadOnce: vi.fn()
    }
    const clock: Clock = { now: () => 1700000000000 }

    const useCase = new SubmitContactUseCase(
      contactGateway,
      contactBackend,
      location,
      navigator,
      leadTracking,
      clock
    )

    const result = await useCase.execute({
      firstName: '',
      lastName: '',
      company: 'Acme',
      email: 'test@example.com',
      phone: '+54 11 5555 4444',
      geographicLocation: '',
      comment: 'Hola'
    })

    expect(result.ok).toBe(false)
    expect(contactBackend.markAvailable).toHaveBeenCalled()
  })

  it('does not update backend state on network errors', async () => {
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
    const leadTracking: LeadTracking = {
      registerLeadForThanksPage: vi.fn(),
      trackGenerateLeadOnce: vi.fn()
    }
    const clock: Clock = { now: () => 1700000000000 }

    const useCase = new SubmitContactUseCase(
      contactGateway,
      contactBackend,
      location,
      navigator,
      leadTracking,
      clock
    )

    const result = await useCase.execute({
      firstName: '',
      lastName: '',
      company: 'Acme',
      email: 'test@example.com',
      phone: '+54 11 5555 4444',
      geographicLocation: '',
      comment: 'Hola'
    })

    expect(result.ok).toBe(false)
    expect(contactBackend.markAvailable).not.toHaveBeenCalled()
    expect(contactBackend.markUnavailable).not.toHaveBeenCalled()
  })
})
