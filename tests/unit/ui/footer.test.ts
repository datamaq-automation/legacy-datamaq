import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/vue'
import Footer from '@/ui/layout/Footer.vue'

vi.mock('@/di/container', () => ({
  useContainer: () => ({
    content: {
      getFooterContent: () => ({
        note: 'Base: Garin - Industria'
      }),
      getNavbarContent: () => ({
        contactLabel: 'Pedi coordinacion'
      })
    }
  })
}))

describe('Footer', () => {
  it('shows the primary contact CTA and emits contact event', async () => {
    const { emitted } = render(Footer, {
      props: {
        contactCtaEnabled: true
      }
    })

    const button = screen.getByRole('button', { name: 'Pedi coordinacion' })
    await fireEvent.click(button)

    expect(emitted().contact).toHaveLength(1)
  })

  it('hides contact CTA when whatsapp channel is disabled', () => {
    render(Footer, {
      props: {
        contactCtaEnabled: false
      }
    })

    expect(screen.queryByRole('button', { name: 'Pedi coordinacion' })).not.toBeInTheDocument()
  })
})
