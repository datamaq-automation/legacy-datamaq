import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/vue'
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
        contactLabel: 'Escribinos por WhatsApp'
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

  it('locks body scroll on mobile menu open and unlocks on Escape', async () => {
    render(Navbar, {
      props: {
        contactCtaEnabled: true
      }
    })

    const toggleButton = screen.getByRole('button', { name: 'Abrir navegacion' })
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false')

    await fireEvent.click(toggleButton)

    await waitFor(() => {
      expect(toggleButton).toHaveAttribute('aria-expanded', 'true')
    })
    expect(document.body).toHaveClass('has-open-menu')

    await fireEvent.keyDown(document, { key: 'Escape' })

    await waitFor(() => {
      expect(toggleButton).toHaveAttribute('aria-expanded', 'false')
    })
    expect(document.body).not.toHaveClass('has-open-menu')
    expect(toggleButton).toHaveFocus()
  })

  it('focuses the first navigation link when the mobile menu opens', async () => {
    render(Navbar, {
      props: {
        contactCtaEnabled: false
      }
    })

    const toggleButton = screen.getByRole('button', { name: 'Abrir navegacion' })
    await fireEvent.click(toggleButton)

    const firstLink = await screen.findByRole('link', { name: 'Servicios' })
    await waitFor(() => {
      expect(firstLink).toHaveFocus()
    })
  })
})
