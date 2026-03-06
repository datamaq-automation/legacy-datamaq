import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/vue'
import WhatsAppFab from '@/ui/features/contact/WhatsAppFab.vue'

const trackChatMock = vi.fn()
const gtagConversionMock = vi.fn()

vi.mock('@/ui/controllers/contactController', () => ({
  getWhatsAppHref: () =>
    'https://wa.me/5491135162685?text=Hola%2C%20quiero%20coordinar%20un%20servicio'
}))

vi.mock('@/di/container', () => ({
  useContainer: () => ({
    content: {
      getBrandContent: () => ({
        contactEmail: 'contacto@example.com'
      })
    },
    engagementTracker: {
      trackChat: trackChatMock
    },
    environment: {
      search: () => '',
      referrer: () => ''
    }
  })
}))

describe('WhatsAppFab', () => {
  beforeEach(() => {
    trackChatMock.mockClear()
    gtagConversionMock.mockClear()
    gtagConversionMock.mockReturnValue(false)
    const windowWithGtag = window as unknown as { gtag_report_conversion?: (url?: string) => boolean }
    windowWithGtag.gtag_report_conversion = gtagConversionMock
  })

  it('renders accessible floating WhatsApp CTA with existing href', () => {
    render(WhatsAppFab)

    const link = screen.getByRole('link', {
      name: /Abrir WhatsApp para pedir coordinaci.n/i
    })
    expect(link).toHaveAttribute('href', expect.stringContaining('wa.me/5491135162685'))
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('reports conversion and tracks analytics on click', async () => {
    render(WhatsAppFab)
    const link = screen.getByRole('link', {
      name: /Abrir WhatsApp para pedir coordinaci.n/i
    })

    await fireEvent.click(link)

    expect(gtagConversionMock).toHaveBeenCalledWith(
      expect.stringContaining('wa.me/5491135162685')
    )

    expect(trackChatMock).toHaveBeenCalledWith('whatsapp-fab', 'direct')
  })
})

