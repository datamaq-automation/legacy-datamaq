import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/vue'
import DecisionFlowSection from '@/ui/sections/DecisionFlowSection.vue'

describe('DecisionFlowSection', () => {
  it('renders anchored sections with semantic h2 headings', () => {
    const { container } = render(DecisionFlowSection)

    expect(container.querySelector('section#proceso')).not.toBeNull()
    expect(container.querySelector('section#tarifas')).not.toBeNull()
    expect(container.querySelector('section#cobertura')).not.toBeNull()
    expect(container.querySelector('section#faq')).not.toBeNull()

    expect(screen.getByRole('heading', { level: 2, name: 'Como trabajamos' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Tarifa base y alcance' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Cobertura y tiempos' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Preguntas frecuentes' })).toBeInTheDocument()
  })

  it('offers direct anchors to contacto and WhatsApp from decision sections', () => {
    render(DecisionFlowSection)

    expect(screen.getByRole('link', { name: 'Ir al formulario de contacto' })).toHaveAttribute(
      'href',
      '#contacto'
    )
    expect(screen.getByRole('link', { name: 'Pedir coordinacion por WhatsApp' })).toHaveAttribute(
      'href',
      expect.stringContaining('wa.me')
    )
  })
})
