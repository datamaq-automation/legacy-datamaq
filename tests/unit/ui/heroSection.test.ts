import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/vue'
import HeroSection from '@/ui/sections/HeroSection.vue'

vi.mock('@/di/container', () => ({
  useContainer: () => ({
    content: {
      getHeroContent: () => ({
        badge: 'Tarifa base publicada - Respuesta en menos de 24 horas',
        title: 'Servicios industriales',
        subtitle: 'Checklist, verificacion final y documentacion.',
        responseNote: 'Respuesta rapida por WhatsApp.',
        primaryCta: {
          label: 'Pedi coordinacion',
          href: 'https://wa.me/5491135162685'
        },
        secondaryCta: {
          label: 'Ver servicios',
          href: '#servicios'
        },
        benefits: [
          { title: 'A', text: 'B', variant: 'success' },
          { title: 'C', text: 'D', variant: 'primary' },
          { title: 'E', text: 'F', variant: 'warning' }
        ],
        image: {
          src: '/hero.svg',
          alt: 'Hero',
          width: 420,
          height: 320
        }
      })
    }
  })
}))

describe('HeroSection', () => {
  it('shows trust chips in first screen without exceeding four signals', () => {
    const { container } = render(HeroSection, {
      props: {
        contactCtaEnabled: true
      }
    })

    expect(screen.getByText('Checklist + verificacion final')).toBeInTheDocument()
    expect(screen.getByText('Documentacion tecnica de cierre')).toBeInTheDocument()
    expect(screen.getByText('Respuesta en menos de 24 horas')).toBeInTheDocument()
    expect(screen.getByText('Cobertura GBA Norte / AMBA')).toBeInTheDocument()
    expect(container.querySelectorAll('.c-hero__chips li')).toHaveLength(4)
    expect(screen.getByRole('link', { name: 'Pedi coordinacion' })).toBeInTheDocument()

    const heroImage = screen.getByRole('img', { name: 'Hero' })
    expect(heroImage).toHaveAttribute('loading', 'eager')
    expect(heroImage).toHaveAttribute('fetchpriority', 'high')
  })
})
