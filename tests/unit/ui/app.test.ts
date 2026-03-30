import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/vue'

vi.mock('vue-router', () => ({
  RouterView: {
    template: '<div data-testid="router-view">router</div>'
  },
  useRoute: () => ({
    path: '/'
  })
}))

vi.mock('@vueuse/head', () => ({
  useHead: vi.fn()
}))

vi.mock('@/di/container', () => ({
  useContainer: () => ({
    content: {
      getSeoContent: () => ({
        siteUrl: 'https://datamaq.com.ar',
        siteName: 'DataMaq',
        siteDescription: 'Servicios industriales y eficiencia energetica para empresas.',
        siteOgImage: 'https://datamaq.com.ar/og-default.png',
        gscVerification: undefined,
        siteLocale: 'es_AR',
        business: {
          name: 'DataMaq',
          country: 'AR',
          areaServed: ['GBA Norte', 'Argentina']
        }
      }),
      getContent: () => ({
        services: {
          cards: []
        }
      })
    },
    environment: {
      href: () => 'https://datamaq.com.ar/'
    }
  })
}))

import App from '@/ui/App.vue'

describe('App', () => {
  it('renders the router view directly', () => {
    render(App)

    expect(screen.getByTestId('router-view')).toBeInTheDocument()
  })
})
