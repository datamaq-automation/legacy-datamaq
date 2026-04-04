import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/vue'
import Navbar from '@/ui/layout/Navbar.vue'

vi.mock('@/di/container', () => ({
  useContainer: () => ({
    content: {
      getNavbarContent: () => ({
        brand: 'DataMaq',
        brandAriaLabel: 'DataMaq, inicio',
        links: [
          { label: 'Servicios', href: '#servicios' },
          { label: 'Perfil', href: '#perfil' }
        ],
        contactLabel: 'Escribime por WhatsApp'
      })
    }
  })
}))

function setViewportWidth(width: number) {
  Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    writable: true,
    value: width
  })
  window.dispatchEvent(new Event('resize'))
}

describe('Navbar', () => {
  beforeEach(() => {
    setViewportWidth(375)
    document.body.className = ''
  })

  afterEach(() => {
    document.body.className = ''
    vi.clearAllMocks()
  })

  it('renders mobile offcanvas trigger with accessible attributes', () => {
    render(Navbar, {
      props: {
        contactCtaEnabled: true
      }
    })

    const toggleButton = screen.getByRole('button', { name: 'Abrí la navegación' })
    expect(toggleButton).toHaveAttribute('data-bs-toggle', 'offcanvas')
    expect(toggleButton).toHaveAttribute('data-bs-target', '#mainOffcanvas')
    expect(toggleButton).toHaveAttribute('aria-controls', 'mainOffcanvas')
  })

  it('emits contact when desktop CTA is clicked', async () => {
    setViewportWidth(1366)
    const { emitted } = render(Navbar, { props: { contactCtaEnabled: true } })

    const desktopCta = screen.getAllByRole('link', { name: 'Escribime por WhatsApp' })[0]
    await fireEvent.click(desktopCta)

    expect(emitted().contact).toHaveLength(1)
  })
})
