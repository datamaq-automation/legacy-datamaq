import { describe, expect, it, vi } from 'vitest'
import { OpenWhatsappUseCase } from '@/application/use-cases/openWhatsapp'
import type { ContactBackendMonitor } from '@/application/contact/contactBackendStatus'
import type { ConfigPort } from '@/application/ports/Config'
import type {
  LocationProvider,
  NavigatorProvider,
  WindowOpener
} from '@/application/ports/Environment'
import type { HttpClient } from '@/application/ports/HttpClient'
import type { LoggerPort } from '@/application/ports/Logger'
import type { EngagementTracker } from '@/application/analytics/engagementTracker'
import type { AttributionProvider } from '@/application/ports/Attribution'

describe('OpenWhatsappUseCase', () => {
  it('opens whatsapp and tracks engagement', async () => {
    const config: ConfigPort = {
      contactApiUrl: 'https://api.example.com',
      contactEmail: undefined,
      whatsappNumber: '5491112345678',
      whatsappPresetMessage: 'Hola',
      originVerifySecret: undefined
    }
    const location: LocationProvider = {
      href: () => 'https://example.com',
      referrer: () => '',
      search: () => ''
    }
    const navigator: NavigatorProvider = {
      userAgent: () => 'test-agent'
    }
    const opener: WindowOpener = {
      open: vi.fn()
    }
    const http: HttpClient = {
      postJson: vi.fn().mockResolvedValue({ ok: true, status: 200 }),
      options: vi.fn().mockResolvedValue({ ok: true, status: 200 })
    }
    const contactBackend: ContactBackendMonitor = {
      ensureStatus: vi.fn().mockResolvedValue('available'),
      markAvailable: vi.fn(),
      markUnavailable: vi.fn(),
      getStatus: vi.fn(),
      subscribe: vi.fn()
    }
    const engagementTracker: EngagementTracker = {
      trackWhatsapp: vi.fn(),
      trackEmail: vi.fn()
    }
    const attribution: AttributionProvider = {
      getAttribution: vi.fn().mockReturnValue(null)
    }
    const logger: LoggerPort = {
      debug: vi.fn(),
      warn: vi.fn(),
      error: vi.fn()
    }

    const useCase = new OpenWhatsappUseCase(
      config,
      location,
      navigator,
      opener,
      http,
      contactBackend,
      engagementTracker,
      attribution,
      logger
    )

    await useCase.execute('fab')

    expect(opener.open).toHaveBeenCalledWith(
      'https://wa.me/5491112345678?text=Hola'
    )
    expect(engagementTracker.trackWhatsapp).toHaveBeenCalledWith('fab', 'direct')
  })

  it('does not open whatsapp when the channel is disabled', async () => {
    const config: ConfigPort = {
      contactApiUrl: 'https://api.example.com',
      contactEmail: undefined,
      whatsappNumber: undefined,
      whatsappPresetMessage: 'Hola',
      originVerifySecret: undefined
    }
    const location: LocationProvider = {
      href: () => 'https://example.com',
      referrer: () => '',
      search: () => ''
    }
    const navigator: NavigatorProvider = {
      userAgent: () => 'test-agent'
    }
    const opener: WindowOpener = {
      open: vi.fn()
    }
    const http: HttpClient = {
      postJson: vi.fn().mockResolvedValue({ ok: true, status: 200 }),
      options: vi.fn().mockResolvedValue({ ok: true, status: 200 })
    }
    const contactBackend: ContactBackendMonitor = {
      ensureStatus: vi.fn().mockResolvedValue('available'),
      markAvailable: vi.fn(),
      markUnavailable: vi.fn(),
      getStatus: vi.fn(),
      subscribe: vi.fn()
    }
    const engagementTracker: EngagementTracker = {
      trackWhatsapp: vi.fn(),
      trackEmail: vi.fn()
    }
    const attribution: AttributionProvider = {
      getAttribution: vi.fn().mockReturnValue(null)
    }
    const logger: LoggerPort = {
      debug: vi.fn(),
      warn: vi.fn(),
      error: vi.fn()
    }

    const useCase = new OpenWhatsappUseCase(
      config,
      location,
      navigator,
      opener,
      http,
      contactBackend,
      engagementTracker,
      attribution,
      logger
    )

    await useCase.execute('fab')

    expect(opener.open).not.toHaveBeenCalled()
    expect(engagementTracker.trackWhatsapp).not.toHaveBeenCalled()
    expect(logger.warn).toHaveBeenCalled()
  })

  it('marks backend unavailable when contact api url is missing', async () => {
    const config: ConfigPort = {
      contactApiUrl: undefined,
      contactEmail: undefined,
      whatsappNumber: '5491112345678',
      whatsappPresetMessage: 'Hola',
      originVerifySecret: undefined
    }
    const location: LocationProvider = {
      href: () => 'https://example.com',
      referrer: () => '',
      search: () => ''
    }
    const navigator: NavigatorProvider = {
      userAgent: () => 'test-agent'
    }
    const opener: WindowOpener = {
      open: vi.fn()
    }
    const http: HttpClient = {
      postJson: vi.fn(),
      options: vi.fn()
    }
    const contactBackend: ContactBackendMonitor = {
      ensureStatus: vi.fn(),
      markAvailable: vi.fn(),
      markUnavailable: vi.fn(),
      getStatus: vi.fn(),
      subscribe: vi.fn()
    }
    const engagementTracker: EngagementTracker = {
      trackWhatsapp: vi.fn(),
      trackEmail: vi.fn()
    }
    const attribution: AttributionProvider = {
      getAttribution: vi.fn().mockReturnValue(null)
    }
    const logger: LoggerPort = {
      debug: vi.fn(),
      warn: vi.fn(),
      error: vi.fn()
    }

    const useCase = new OpenWhatsappUseCase(
      config,
      location,
      navigator,
      opener,
      http,
      contactBackend,
      engagementTracker,
      attribution,
      logger
    )

    await (useCase as any).sendWhatsappContactEvent('fab')

    expect(contactBackend.markUnavailable).toHaveBeenCalled()
    expect(logger.error).toHaveBeenCalled()
  })

  it('skips backend call when backend status is not available', async () => {
    const config: ConfigPort = {
      contactApiUrl: 'https://api.example.com',
      contactEmail: undefined,
      whatsappNumber: '5491112345678',
      whatsappPresetMessage: 'Hola',
      originVerifySecret: undefined
    }
    const location: LocationProvider = {
      href: () => 'https://example.com',
      referrer: () => '',
      search: () => ''
    }
    const navigator: NavigatorProvider = {
      userAgent: () => 'test-agent'
    }
    const opener: WindowOpener = {
      open: vi.fn()
    }
    const http: HttpClient = {
      postJson: vi.fn(),
      options: vi.fn()
    }
    const contactBackend: ContactBackendMonitor = {
      ensureStatus: vi.fn().mockResolvedValue('unavailable'),
      markAvailable: vi.fn(),
      markUnavailable: vi.fn(),
      getStatus: vi.fn(),
      subscribe: vi.fn()
    }
    const engagementTracker: EngagementTracker = {
      trackWhatsapp: vi.fn(),
      trackEmail: vi.fn()
    }
    const attribution: AttributionProvider = {
      getAttribution: vi.fn().mockReturnValue(null)
    }
    const logger: LoggerPort = {
      debug: vi.fn(),
      warn: vi.fn(),
      error: vi.fn()
    }

    const useCase = new OpenWhatsappUseCase(
      config,
      location,
      navigator,
      opener,
      http,
      contactBackend,
      engagementTracker,
      attribution,
      logger
    )

    await (useCase as any).sendWhatsappContactEvent('fab')

    expect(http.postJson).not.toHaveBeenCalled()
    expect(logger.warn).toHaveBeenCalled()
  })

  it('marks backend unavailable when response is not ok and status >= 500', async () => {
    const config: ConfigPort = {
      contactApiUrl: 'https://api.example.com',
      contactEmail: undefined,
      whatsappNumber: '5491112345678',
      whatsappPresetMessage: 'Hola',
      originVerifySecret: undefined
    }
    const location: LocationProvider = {
      href: () => 'https://example.com',
      referrer: () => '',
      search: () => ''
    }
    const navigator: NavigatorProvider = {
      userAgent: () => 'test-agent'
    }
    const opener: WindowOpener = {
      open: vi.fn()
    }
    const http: HttpClient = {
      postJson: vi.fn().mockResolvedValue({ ok: false, status: 500 }),
      options: vi.fn()
    }
    const contactBackend: ContactBackendMonitor = {
      ensureStatus: vi.fn().mockResolvedValue('available'),
      markAvailable: vi.fn(),
      markUnavailable: vi.fn(),
      getStatus: vi.fn(),
      subscribe: vi.fn()
    }
    const engagementTracker: EngagementTracker = {
      trackWhatsapp: vi.fn(),
      trackEmail: vi.fn()
    }
    const attribution: AttributionProvider = {
      getAttribution: vi.fn().mockReturnValue(null)
    }
    const logger: LoggerPort = {
      debug: vi.fn(),
      warn: vi.fn(),
      error: vi.fn()
    }

    const useCase = new OpenWhatsappUseCase(
      config,
      location,
      navigator,
      opener,
      http,
      contactBackend,
      engagementTracker,
      attribution,
      logger
    )

    await (useCase as any).sendWhatsappContactEvent('fab')

    expect(contactBackend.markUnavailable).toHaveBeenCalled()
    expect(logger.warn).toHaveBeenCalled()
  })

  it('marks backend available when response is ok', async () => {
    const config: ConfigPort = {
      contactApiUrl: 'https://api.example.com',
      contactEmail: undefined,
      whatsappNumber: '5491112345678',
      whatsappPresetMessage: 'Hola',
      originVerifySecret: undefined
    }
    const location: LocationProvider = {
      href: () => 'https://example.com',
      referrer: () => '',
      search: () => ''
    }
    const navigator: NavigatorProvider = {
      userAgent: () => 'test-agent'
    }
    const opener: WindowOpener = {
      open: vi.fn()
    }
    const http: HttpClient = {
      postJson: vi.fn().mockResolvedValue({ ok: true, status: 200 }),
      options: vi.fn()
    }
    const contactBackend: ContactBackendMonitor = {
      ensureStatus: vi.fn().mockResolvedValue('available'),
      markAvailable: vi.fn(),
      markUnavailable: vi.fn(),
      getStatus: vi.fn(),
      subscribe: vi.fn()
    }
    const engagementTracker: EngagementTracker = {
      trackWhatsapp: vi.fn(),
      trackEmail: vi.fn()
    }
    const attribution: AttributionProvider = {
      getAttribution: vi.fn().mockReturnValue(null)
    }
    const logger: LoggerPort = {
      debug: vi.fn(),
      warn: vi.fn(),
      error: vi.fn()
    }

    const useCase = new OpenWhatsappUseCase(
      config,
      location,
      navigator,
      opener,
      http,
      contactBackend,
      engagementTracker,
      attribution,
      logger
    )

    await (useCase as any).sendWhatsappContactEvent('fab')

    expect(contactBackend.markAvailable).toHaveBeenCalled()
  })

  it('marks backend unavailable when request throws', async () => {
    const config: ConfigPort = {
      contactApiUrl: 'https://api.example.com',
      contactEmail: undefined,
      whatsappNumber: '5491112345678',
      whatsappPresetMessage: 'Hola',
      originVerifySecret: undefined
    }
    const location: LocationProvider = {
      href: () => 'https://example.com',
      referrer: () => '',
      search: () => ''
    }
    const navigator: NavigatorProvider = {
      userAgent: () => 'test-agent'
    }
    const opener: WindowOpener = {
      open: vi.fn()
    }
    const http: HttpClient = {
      postJson: vi.fn().mockRejectedValue(new Error('boom')),
      options: vi.fn()
    }
    const contactBackend: ContactBackendMonitor = {
      ensureStatus: vi.fn().mockResolvedValue('available'),
      markAvailable: vi.fn(),
      markUnavailable: vi.fn(),
      getStatus: vi.fn(),
      subscribe: vi.fn()
    }
    const engagementTracker: EngagementTracker = {
      trackWhatsapp: vi.fn(),
      trackEmail: vi.fn()
    }
    const attribution: AttributionProvider = {
      getAttribution: vi.fn().mockReturnValue(null)
    }
    const logger: LoggerPort = {
      debug: vi.fn(),
      warn: vi.fn(),
      error: vi.fn()
    }

    const useCase = new OpenWhatsappUseCase(
      config,
      location,
      navigator,
      opener,
      http,
      contactBackend,
      engagementTracker,
      attribution,
      logger
    )

    await (useCase as any).sendWhatsappContactEvent('fab')

    expect(contactBackend.markUnavailable).toHaveBeenCalled()
    expect(logger.error).toHaveBeenCalled()
  })
})
