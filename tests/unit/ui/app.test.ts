import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/vue'

import App from '@/ui/App.vue'

describe('App', () => {
  it('renders the router view directly', () => {
    render(App, {
      global: {
        stubs: {
          RouterView: {
            template: '<div data-testid="router-view">router</div>'
          }
        }
      }
    })

    expect(screen.getByTestId('router-view')).toBeInTheDocument()
  })
})
