import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  getContactEmail,
  getWhatsAppEnabled,
  getWhatsAppHref,
  openWhatsApp,
  submitContact,
  trackSectionScroll
} from '@/ui/controllers/contactController'

const EXPECTED_WHATSAPP_MESSAGE = 'Hola equipo técnico, necesito asistencia técnica para [Tipo de Maquina].'

const mocks = vi.hoisted(() => ({
  trackChat: vi.fn(),
  trackSectionScroll: vi.fn(),
  submitContact: vi.fn(),
  getHeroContent: vi.fn(),
  getBrandContent: vi.fn(),
  environment: {
    search: () => '' as string,
    referrer: () => '' as string
  }
}))

vi.mock('@/di/container', () => ({
  useContainer: () => ({
    content: {
      getHeroContent: mocks.getHeroContent,
      getBrandContent: mocks.getBrandContent
    },
    useCases: {
      submitContact: {
        execute: mocks.submitContact
      }
    },
    engagementTracker: {
      trackChat: mocks.trackChat,
      trackSectionScroll: mocks.trackSectionScroll
    },
    environment: mocks.environment
  })
}))

describe('contactController', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    mocks.trackChat.mockReset()
    mocks.trackSectionScroll.mockReset()
    mocks.submitContact.mockReset()
    mocks.getHeroContent.mockReset()
    mocks.getBrandContent.mockReset()
    mocks.getBrandContent.mockReturnValue({
      contactEmail: 'contacto@example.com',
      contactFormActive: true
    })
    mocks.environment.search = () => ''
    mocks.environment.referrer = () => ''
    vi.spyOn(window, 'open').mockImplementation(() => null)
  })

  it('returns WhatsApp href and enabled status when hero CTA is present', () => {
    mocks.getHeroContent.mockReturnValue({
      primaryCta: {
        href: ' https://wa.me/5491156297160 '
      }
    })

    expect(getWhatsAppEnabled()).toBe(true)
    const href = getWhatsAppHref()
    expect(href).toBeDefined()

    const parsed = new URL(href as string)
    expect(`${parsed.origin}${parsed.pathname}`).toBe('https://wa.me/5491156297160')
    expect(parsed.searchParams.get('text')).toBe(EXPECTED_WHATSAPP_MESSAGE)
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

  it('returns undefined when hero CTA points to non-whatsapp domain', () => {
    mocks.getHeroContent.mockReturnValue({
      primaryCta: {
        href: 'https://example.com/chat'
      }
    })

    expect(getWhatsAppEnabled()).toBe(false)
    expect(getWhatsAppHref()).toBeUndefined()
  })

  it('returns contact email when configured', () => {
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

    expect(window.open).toHaveBeenCalledWith(
      expect.stringContaining('https://wa.me/5491156297160'),
      '_blank',
      'noopener,noreferrer'
    )
    const openedUrl = (window.open as unknown as { mock: { calls: unknown[][] } }).mock.calls[0]?.[0]
    expect(typeof openedUrl).toBe('string')
    expect(new URL(openedUrl as string).searchParams.get('text')).toBe(EXPECTED_WHATSAPP_MESSAGE)
    expect(mocks.trackChat).toHaveBeenCalledWith('tecnico-a-cargo', 'google')
  })

  it('does not open or track when provided href is untrusted', () => {
    mocks.getHeroContent.mockReturnValue({
      primaryCta: {
        href: 'https://wa.me/5491156297160'
      }
    })

    openWhatsApp('tecnico-a-cargo', 'https://evilwhatsapp.com/phishing')

    expect(window.open).not.toHaveBeenCalled()
    expect(mocks.trackChat).not.toHaveBeenCalled()
  })

  it('tracks section scroll using normalized anchor', () => {
    mocks.environment.referrer = () => 'https://example.com'

    trackSectionScroll('#servicios')

    expect(mocks.trackSectionScroll).toHaveBeenCalledWith('servicios', 'https://example.com')
  })

  it('submits contact via use case', async () => {
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

})
