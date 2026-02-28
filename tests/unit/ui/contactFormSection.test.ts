import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import ContactFormSection from '@/ui/features/contact/ContactFormSection.vue'

const backendMocks = vi.hoisted(() => ({
  subscribeToContactBackendStatus: vi.fn(() => () => {}),
  ensureContactBackendStatus: vi.fn(async () => 'available')
}))

vi.mock('@/ui/controllers/contactBackendController', () => ({
  getContactBackendStatus: () => 'available',
  subscribeToContactBackendStatus: backendMocks.subscribeToContactBackendStatus,
  ensureContactBackendStatus: backendMocks.ensureContactBackendStatus
}))

vi.mock('@/di/container', () => ({
  useContainer: () => ({
    config: {
      inquiryApiUrl: undefined,
      mailApiUrl: undefined
    },
    content: {
      getHeroContent: () => ({
        primaryCta: {
          href: 'https://wa.me/5491156297160'
        }
      }),
      getContactContent: () => ({
        title: 'Contacto',
        subtitle: 'Dejanos tu consulta y te contactamos.',
        labels: {
          firstName: 'Nombre',
          lastName: 'Apellido',
          company: 'Empresa',
          email: 'E-mail',
          phone: 'Nro telefono',
          geographicLocation: 'Ubicacion geografica',
          comment: 'Comentario',
          message: 'Comentario'
        },
        submitLabel: 'Registrar contacto',
        checkingMessage: 'Verificando disponibilidad...',
        unavailableMessage: 'Canal no disponible',
        successMessage: 'Consulta enviada',
        errorMessage: 'No se pudo enviar',
        unexpectedErrorMessage: 'Error inesperado'
      })
    }
  })
}))

function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'home', component: { template: '<div>Home</div>' } },
      { path: '/gracias', name: 'thanks', component: { template: '<div>Thanks</div>' } }
    ]
  })
}

describe('ContactFormSection', () => {
  let reportValiditySpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    vi.clearAllMocks()
    reportValiditySpy = vi.spyOn(HTMLFormElement.prototype, 'reportValidity').mockReturnValue(true)
  })

  afterEach(() => {
    reportValiditySpy.mockRestore()
  })

  it('submits a valid contact payload when channel is enabled', async () => {
    const onSubmit = vi.fn(async () => ({ ok: true as const, data: {} }))
    const router = createTestRouter()
    await router.push('/')
    await router.isReady()

    render(ContactFormSection, {
      props: {
        contactEmail: 'contacto@example.com',
        onSubmit
      },
      global: {
        plugins: [router]
      }
    })

    await fireEvent.update(screen.getByLabelText('Nombre'), 'Ana')
    await fireEvent.update(screen.getByLabelText('Apellido'), 'Perez')
    await fireEvent.update(screen.getByLabelText('Empresa'), 'Acme')
    await fireEvent.update(screen.getByLabelText('E-mail'), 'ana@example.com')
    await fireEvent.update(screen.getByLabelText('Nro telefono'), '+54 11 5555 4444')
    await fireEvent.update(screen.getByLabelText('Ubicacion geografica'), 'Escobar')
    await fireEvent.update(screen.getByLabelText('Comentario'), 'Necesito una propuesta para mi planta')
    await fireEvent.click(screen.getByRole('button', { name: 'Registrar contacto' }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1)
    })
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        firstName: 'Ana',
        lastName: 'Perez',
        company: 'Acme',
        email: 'ana@example.com',
        phone: '+54 11 5555 4444',
        geographicLocation: 'Escobar',
        comment: 'Necesito una propuesta para mi planta'
      })
    )
    expect(backendMocks.ensureContactBackendStatus).toHaveBeenCalledTimes(1)
    expect(backendMocks.subscribeToContactBackendStatus).toHaveBeenCalledTimes(1)
  })

  it('renders mail mode with email and comment only', async () => {
    const onSubmit = vi.fn(async () => ({ ok: true as const, data: {} }))
    const router = createTestRouter()
    await router.push('/')
    await router.isReady()

    render(ContactFormSection, {
      props: {
        contactEmail: 'contacto@example.com',
        backendChannel: 'mail',
        submitLabel: 'Enviar consulta por correo',
        onSubmit
      },
      global: {
        plugins: [router]
      }
    })

    expect(screen.queryByLabelText('Nombre')).not.toBeInTheDocument()
    expect(screen.getByLabelText('E-mail')).toBeInTheDocument()
    expect(screen.getByLabelText('Comentario')).toBeInTheDocument()
  })

  it('keeps submit disabled when contact email is not configured', async () => {
    const onSubmit = vi.fn(async () => ({ ok: true as const, data: {} }))
    const router = createTestRouter()
    await router.push('/')
    await router.isReady()

    render(ContactFormSection, {
      props: {
        onSubmit
      },
      global: {
        plugins: [router]
      }
    })

    const submitButton = screen.getByRole('button', { name: 'Registrar contacto' })
    expect(submitButton).toBeDisabled()

    await fireEvent.click(submitButton)
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('shows backend validation detail when Laravel returns 422', async () => {
    const onSubmit = vi.fn(async () => ({
      ok: false as const,
      error: {
        type: 'BackendError' as const,
        status: 422,
        backendMessage: 'Ingresa e-mail o telefono.',
        requestId: 'req_422'
      }
    }))
    const router = createTestRouter()
    await router.push('/')
    await router.isReady()

    render(ContactFormSection, {
      props: {
        contactEmail: 'contacto@example.com',
        onSubmit
      },
      global: {
        plugins: [router]
      }
    })

    await fireEvent.update(screen.getByLabelText('Nombre'), 'Ana')
    await fireEvent.update(screen.getByLabelText('E-mail'), 'ana@example.com')
    await fireEvent.click(screen.getByRole('button', { name: 'Registrar contacto' }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Ingresa e-mail o telefono. Codigo de seguimiento: req_422.'
      )
    })
  })
})
