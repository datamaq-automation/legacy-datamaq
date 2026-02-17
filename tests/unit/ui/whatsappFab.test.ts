import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/vue'
import WhatsAppFab from '@/ui/features/contact/WhatsAppFab.vue'

const trackChatMock = vi.fn()
const windowOpenMock = vi.fn()

vi.mock('@/ui/controllers/contactController', () => ({
  getWhatsAppHref: () =>
    'https://wa.me/5491135162685?text=Hola%2C%20quiero%20coordinar%20un%20servicio'
}))

vi.mock('@/di/container', () => ({
  useContainer: () => ({
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
    windowOpenMock.mockClear()
    // Mock window.open usando spyOn
    windowOpenMock.mockReturnValue({} as Window)
    vi.spyOn(window, 'open').mockImplementation(windowOpenMock)
  })

  it('renders accessible floating WhatsApp CTA with existing href', () => {
    render(WhatsAppFab)

    const link = screen.getByRole('link', {
      name: 'Abrir WhatsApp para pedir coordinación'
    })
    expect(link).toHaveAttribute('href', expect.stringContaining('wa.me/5491135162685'))
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('opens WhatsApp in new tab and tracks analytics on click', async () => {
    render(WhatsAppFab)
    const link = screen.getByRole('link', {
      name: 'Abrir WhatsApp para pedir coordinación'
    })

    await fireEvent.click(link)

    // Verifica que window.open se llama con la URL correcta
    expect(windowOpenMock).toHaveBeenCalledWith(
      expect.stringContaining('wa.me/5491135162685'),
      '_blank'
    )

    // Verifica que se trackea el evento
    expect(trackChatMock).toHaveBeenCalledWith('whatsapp-fab', 'direct')
  })
})
