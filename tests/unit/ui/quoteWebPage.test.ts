import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import QuoteWebPage from '@/ui/pages/QuoteWebPage.vue'

const mocks = vi.hoisted(() => ({
  readQuoteWebSnapshot: vi.fn(),
  reportGtagConversion: vi.fn(() => true)
}))

vi.mock('@/ui/pages/quoteWebState', () => ({
  readQuoteWebSnapshot: mocks.readQuoteWebSnapshot
}))

vi.mock('@/ui/utils/gtagConversion', () => ({
  isWhatsAppUrl: (url: string) => url.startsWith('https://wa.me/'),
  reportGtagConversion: mocks.reportGtagConversion
}))

function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/cotizador/:quoteId/web', name: 'cotizador-web', component: QuoteWebPage }
    ]
  })
}

async function renderPage(path: string) {
  const router = createTestRouter()
  await router.push(path)
  await router.isReady()

  render(QuoteWebPage, {
    global: {
      plugins: [router]
    }
  })
}

describe('QuoteWebPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders quote details from snapshot and reports WhatsApp conversion', async () => {
    mocks.readQuoteWebSnapshot.mockReturnValue({
      quote_id: 'Q-20260309-000001',
      list_price_ars: 280000,
      discount_total_ars: 28000,
      final_price_ars: 252000,
      deposit_pct: 50,
      deposit_ars: 126000,
      valid_until: '2026-03-15T00:00:00Z',
      whatsapp_message: 'Hola Ada, confirmamos el servicio',
      whatsapp_url: 'https://wa.me/5491111111111?text=Hola'
    })

    await renderPage('/cotizador/Q-20260309-000001/web')

    expect(screen.getByText('Pendiente')).toBeInTheDocument()
    expect(screen.getByText('Contacto: Ada')).toBeInTheDocument()
    expect(screen.getAllByText(/Q-20260309-000001/)).toHaveLength(2)
    expect(screen.getByText(/Vigencia hasta:/)).toBeInTheDocument()

    await fireEvent.click(screen.getByRole('link', { name: 'Confirmar en un clic' }))
    expect(mocks.reportGtagConversion).toHaveBeenCalledWith('https://wa.me/5491111111111?text=Hola')
  })

  it('renders empty state when snapshot is unavailable', async () => {
    mocks.readQuoteWebSnapshot.mockReturnValue(undefined)

    await renderPage('/cotizador/Q-404/web')

    expect(screen.getByText('No disponible')).toBeInTheDocument()
    expect(screen.getByText('Cotizacion no encontrada')).toBeInTheDocument()
    expect(
      screen.getByText('Esta vista depende de una cotizacion generada previamente en el cotizador del frontend.')
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Volver al cotizador' })).toHaveAttribute('href', '/cotizador')
    expect(screen.getByRole('link', { name: 'Ir al cotizador' })).toHaveAttribute('href', '#cotizador')
  })
})
