import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import { QuoteApiError } from '@/application/quote/quoteApiError'
import QuotePage from '@/ui/pages/QuotePage.vue'

const mocks = vi.hoisted(() => ({
  createDiagnosticQuote: vi.fn(),
  fetchQuotePdf: vi.fn(),
  saveQuoteWebSnapshot: vi.fn(),
  getWhatsAppEnabled: vi.fn(() => true),
  getWhatsAppHref: vi.fn(() => 'https://wa.me/5491111111111'),
  reportGtagConversion: vi.fn(() => true)
}))

vi.mock('@/ui/controllers/quoteController', () => ({
  createDiagnosticQuote: mocks.createDiagnosticQuote,
  fetchQuotePdf: mocks.fetchQuotePdf
}))

vi.mock('@/ui/controllers/contactController', () => ({
  getWhatsAppEnabled: mocks.getWhatsAppEnabled,
  getWhatsAppHref: mocks.getWhatsAppHref
}))

vi.mock('@/ui/pages/quoteWebState', () => ({
  saveQuoteWebSnapshot: mocks.saveQuoteWebSnapshot
}))

vi.mock('@/ui/utils/gtagConversion', () => ({
  isWhatsAppUrl: (url: string) => url.startsWith('https://wa.me/'),
  reportGtagConversion: mocks.reportGtagConversion
}))

vi.mock('@/ui/layout/Navbar.vue', () => ({
  default: { template: '<div data-testid="navbar-stub"></div>' }
}))

vi.mock('@/ui/layout/Footer.vue', () => ({
  default: { template: '<div data-testid="footer-stub"></div>' }
}))

vi.mock('@/ui/features/contact/ConsentBanner.vue', () => ({
  default: { template: '<div data-testid="consent-stub"></div>' }
}))

vi.mock('@/ui/features/contact/WhatsAppFab.vue', () => ({
  default: { template: '<div data-testid="whatsapp-stub"></div>' }
}))

function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/cotizador', name: 'cotizador', component: QuotePage },
      { path: '/cotizador/:quoteId/web', name: 'cotizador-web', component: { template: '<div>web</div>' } }
    ]
  })
}

async function renderPage() {
  const router = createTestRouter()
  await router.push('/cotizador')
  await router.isReady()

  render(QuotePage, {
    global: {
      plugins: [router]
    }
  })

  return { router }
}

async function fillRequiredFields() {
  await fireEvent.update(screen.getByLabelText('Empresa *'), 'ACME')
  await fireEvent.update(screen.getByLabelText('Nombre de contacto *'), 'Ada Lovelace')
  await fireEvent.update(screen.getByLabelText('Localidad *'), 'Escobar')

  const yesButtons = screen.getAllByRole('button', { name: 'Sí' })
  await fireEvent.click(yesButtons[0])
  await fireEvent.click(yesButtons[1])
  await fireEvent.click(yesButtons[2])
}

describe('QuotePage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.getWhatsAppEnabled.mockReturnValue(true)
    mocks.getWhatsAppHref.mockReturnValue('https://wa.me/5491111111111')
    mocks.reportGtagConversion.mockReturnValue(true)

    vi.spyOn(window.URL, 'createObjectURL').mockReturnValue('blob:quote')
    vi.spyOn(window.URL, 'revokeObjectURL').mockImplementation(() => undefined)
  })

  it('shows local validation errors before calling the controller', async () => {
    await renderPage()

    await fireEvent.click(screen.getByRole('button', { name: 'Generar propuesta' }))

    expect(mocks.createDiagnosticQuote).not.toHaveBeenCalled()
    expect(screen.getByText('Ingresa la empresa.')).toBeInTheDocument()
    expect(screen.getByText('Ingresa el nombre de contacto.')).toBeInTheDocument()
    expect(screen.getByText('Ingresa la localidad.')).toBeInTheDocument()
    expect(screen.getAllByText('Selecciona Sí o No.')).toHaveLength(3)
  })

  it('maps backend 422 issues to field errors and user-visible alert', async () => {
    mocks.createDiagnosticQuote.mockRejectedValue(
      new QuoteApiError({
        message: 'validation failed',
        status: 422,
        validationIssues: [{ field: 'company', loc: ['body', 'company'], message: 'Field required' }]
      })
    )

    await renderPage()
    await fillRequiredFields()
    await fireEvent.click(screen.getByRole('button', { name: 'Generar propuesta' }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Revisa los campos marcados e intenta nuevamente.')
    })

    expect(screen.getByText('Field required')).toBeInTheDocument()
  })

  it('renders generated quote summary, downloads the PDF and navigates to web view', async () => {
    const quote = {
      quote_id: 'Q-20260309-000001',
      list_price_ars: 280000,
      discounts: [{ code: 'DISC10', label: 'Turno', amount_ars: 28000 }],
      discount_pct: 10,
      discount_total_ars: 28000,
      final_price_ars: 252000,
      deposit_pct: 50,
      deposit_ars: 126000,
      valid_until: '2026-03-15T12:00:00Z',
      whatsapp_message: 'Hola Ada, confirmemos la visita',
      whatsapp_url: 'https://wa.me/5491111111111?text=Hola'
    }
    mocks.createDiagnosticQuote.mockResolvedValue(quote)
    mocks.fetchQuotePdf.mockResolvedValue({
      blob: new Blob(['pdf'], { type: 'application/pdf' }),
      filename: 'quote-Q-20260309-000001.pdf'
    })

    const { router } = await renderPage()
    await fillRequiredFields()
    await fireEvent.click(screen.getByRole('button', { name: 'Generar propuesta' }))

    await waitFor(() => {
      expect(screen.getByText(/Q-20260309-000001/)).toBeInTheDocument()
    })

    expect(mocks.saveQuoteWebSnapshot).toHaveBeenCalledWith(quote)
    expect(screen.getByText(/Descuentos aplicados/)).toBeInTheDocument()

    await fireEvent.click(screen.getByRole('button', { name: 'Descargar PDF' }))
    expect(mocks.fetchQuotePdf).toHaveBeenCalledWith('Q-20260309-000001')

    await fireEvent.click(screen.getByRole('button', { name: 'Ver versión web' }))
    await waitFor(() => {
      expect(router.currentRoute.value.name).toBe('cotizador-web')
    })

    expect(router.currentRoute.value.params.quoteId).toBe('Q-20260309-000001')
  })
})
