import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  getContactEmail,
  getWhatsAppEnabled,
  getWhatsAppHref,
  openWhatsApp,
  submitMail,
  submitContact,
  trackSectionScroll
} from '@/ui/controllers/contactController'

const mocks = vi.hoisted(() => ({
  trackChat: vi.fn(),
  trackSectionScroll: vi.fn(),
  submitContact: vi.fn(),
  submitMail: vi.fn(),
  getHeroContent: vi.fn(),
  environment: {
    search: () => '' as string,
    referrer: () => '' as string
  },
  config: {
    contactEmail: 'contacto@example.com'
  }
}))

vi.mock('@/di/container', () => ({
  useContainer: () => ({
    content: {
      getHeroContent: mocks.getHeroContent
    },
    config: mocks.config,
    engagementTracker: {
      trackChat: mocks.trackChat,
      trackSectionScroll: mocks.trackSectionScroll
    },
    environment: mocks.environment
  })
}))

vi.mock('@/ui/features/contact/useContactFacade', () => ({
  useContactFacade: () => ({
    submitContact: mocks.submitContact,
    submitMail: mocks.submitMail
  })
}))

describe('contactController', () => {
  beforeEach(() => {
    mocks.trackChat.mockReset()
    mocks.trackSectionScroll.mockReset()
    mocks.submitContact.mockReset()
    mocks.submitMail.mockReset()
    mocks.getHeroContent.mockReset()
    mocks.environment.search = () => ''
    mocks.environment.referrer = () => ''
    mocks.config.contactEmail = 'contacto@example.com'
    vi.spyOn(window, 'open').mockImplementation(() => null)
  })

  it('returns WhatsApp href and enabled status when hero CTA is present', () => {
    mocks.getHeroContent.mockReturnValue({
      primaryCta: {
        href: ' https://wa.me/5491156297160 '
      }
    })

    expect(getWhatsAppEnabled()).toBe(true)
    expect(getWhatsAppHref()).toBe('https://wa.me/5491156297160')
  })

  it('returns undefined when WhatsApp CTA is missing', () => {
    mocks.getHeroContent.mockReturnValue({
      primaryCta: {
        href: ' '
      }
    })

    expect(getWhatsAppEnabled()).toBe(false)
    expect(getWhatsAppHref()).toBeUndefined()
  })

  it('returns contact email when configured', () => {
    mocks.config.contactEmail = 'contacto@example.com'

    expect(getContactEmail()).toBe('contacto@example.com')
  })

  it('opens WhatsApp with utm_source traffic and tracks chat', () => {
    mocks.getHeroContent.mockReturnValue({
      primaryCta: {
        href: 'https://wa.me/5491156297160'
      }
    })
    mocks.environment.search = () => '?utm_source=google'

    openWhatsApp('tecnico-a-cargo')

    expect(window.open).toHaveBeenCalledWith('https://wa.me/5491156297160', '_blank', 'noopener,noreferrer')
    expect(mocks.trackChat).toHaveBeenCalledWith('tecnico-a-cargo', 'google')
  })

  it('tracks section scroll using normalized anchor', () => {
    mocks.environment.referrer = () => 'https://example.com'

    trackSectionScroll('#servicios')

    expect(mocks.trackSectionScroll).toHaveBeenCalledWith('servicios', 'https://example.com')
  })

  it('submits contact via facade', async () => {
    mocks.submitContact.mockResolvedValue({ ok: true, data: {} })

    const payload = {
      firstName: 'Ana',
      lastName: 'Perez',
      company: 'Acme',
      email: 'ana@example.com',
      phone: '',
      geographicLocation: 'Escobar',
      comment: 'Hola'
    }
    await submitContact(payload)

    expect(mocks.submitContact).toHaveBeenCalledWith(payload)
  })

  it('submits mail via facade', async () => {
    mocks.submitMail.mockResolvedValue({ ok: true, data: {} })

    const payload = {
      firstName: '',
      lastName: '',
      company: '',
      email: 'ana@example.com',
      phone: '',
      geographicLocation: '',
      comment: 'Hola desde correo'
    }
    await submitMail(payload)

    expect(mocks.submitMail).toHaveBeenCalledWith(payload)
  })
})
