import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/vue'
import WhatsAppFab from '@/ui/features/contact/WhatsAppFab.vue'

const openWhatsAppMock = vi.fn()

vi.mock('@/ui/controllers/contactController', () => ({
  getWhatsAppHref: () =>
    'https://wa.me/5491135162685?text=Hola%2C%20quiero%20coordinar%20un%20servicio',
  openWhatsApp: (...args: unknown[]) => openWhatsAppMock(...args)
}))

describe('WhatsAppFab', () => {
  beforeEach(() => {
    openWhatsAppMock.mockClear()
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

  it('delegates interaction to shared openWhatsApp handler', async () => {
    render(WhatsAppFab)
    const link = screen.getByRole('link', {
      name: 'Abrir WhatsApp para pedir coordinación'
    })

    await fireEvent.click(link)

    expect(openWhatsAppMock).toHaveBeenCalledWith(
      'whatsapp-fab',
      expect.stringContaining('wa.me/5491135162685')
    )
  })
})
