import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/vue'

vi.mock('@/ui/App', () => ({
  useApp: vi.fn(() => ({
    isContentReady: false,
    isContentPending: true,
    isContentUnavailable: false
  }))
}))

import App from '@/ui/App.vue'

describe('App', () => {
  it('renders a loading view while remote content is pending', () => {
    render(App, {
      global: {
        stubs: {
          RouterView: {
            template: '<div data-testid="router-view">router</div>'
          }
        }
      }
    })

    expect(screen.getByRole('heading', { name: 'Cargando contenido' })).toBeInTheDocument()
    expect(screen.queryByTestId('router-view')).not.toBeInTheDocument()
  })
})
