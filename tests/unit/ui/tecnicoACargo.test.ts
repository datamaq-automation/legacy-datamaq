import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/vue'
import TecnicoACargo from '@/components/TecnicoACargo.vue'

const mocks = vi.hoisted(() => ({
  getWhatsAppHref: vi.fn(),
  trackChat: vi.fn(),
  windowOpen: vi.fn()
}))

vi.mock('@/ui/controllers/contactController', () => ({
  getWhatsAppHref: () => mocks.getWhatsAppHref()
}))

vi.mock('@/di/container', () => ({
  useContainer: () => ({
    engagementTracker: {
      trackChat: mocks.trackChat
    },
    environment: {
      search: () => '',
      referrer: () => ''
    }
  })
}))

describe('TecnicoACargo', () => {
  beforeEach(() => {
    mocks.getWhatsAppHref.mockReset()
    mocks.trackChat.mockReset()
    mocks.windowOpen.mockReset()
    vi.spyOn(window, 'open').mockImplementation(mocks.windowOpen)
  })

  it('renders the technician card and opens WhatsApp on click', async () => {
    mocks.getWhatsAppHref.mockReturnValue('https://wa.me/5491156297160')

    render(TecnicoACargo)

    expect(screen.getByText('Técnico a cargo')).toBeInTheDocument()
    expect(screen.getByText('Agustín Bustos')).toBeInTheDocument()

    const button = screen.getByRole('button', { name: 'Coordinar por WhatsApp' })
    await fireEvent.click(button)

    expect(mocks.windowOpen).toHaveBeenCalledWith('https://wa.me/5491156297160', '_blank')
    expect(mocks.trackChat).toHaveBeenCalledWith('tecnico-a-cargo', 'direct')
  })

  it('shows the fallback message when WhatsApp is unavailable', () => {
    mocks.getWhatsAppHref.mockReturnValue(undefined)

    render(TecnicoACargo, {
      props: {
        variant: 'embedded',
        headingId: 'tecnico-a-cargo-contacto-title'
      }
    })

    expect(screen.queryByRole('button', { name: 'Coordinar por WhatsApp' })).toBeNull()
    expect(screen.getByText('Contacto no disponible')).toBeInTheDocument()
  })
})
