import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import ContactFormSection from '@/ui/features/contact/ContactFormSection.vue'

const backendMocks = vi.hoisted(() => {
  let currentStatus: 'available' | 'unknown' | 'unavailable' = 'available'

  return {
    getCurrentStatus: () => currentStatus,
    setCurrentStatus: (nextStatus: 'available' | 'unknown' | 'unavailable') => {
      currentStatus = nextStatus
    },
    subscribeToContactBackendStatus: vi.fn(() => () => {}),
    ensureContactBackendStatus: vi.fn(async () => currentStatus)
  }
})

vi.mock('@/di/container', () => ({
  useContainer: () => ({
    config: {
      inquiryApiUrl: undefined
    },
    contactBackend: {
      getStatus: () => backendMocks.getCurrentStatus(),
      subscribe: backendMocks.subscribeToContactBackendStatus,
      ensureStatus: backendMocks.ensureContactBackendStatus
    },
    content: {
      getBrandContent: () => ({
        contactEmail: 'info@datamaq.com.ar',
        contactFormActive: true,
        technician: {
          name: 'Agustin Bustos',
          role: 'Tecnico a cargo',
          photo: {
            src: '/media/tecnico-a-cargo.webp',
            alt: 'Foto del tecnico a cargo',
            width: 100,
            height: 100
          },
          whatsappLabel: 'Coordinar por WhatsApp',
          unavailableLabel: 'Tecnico no disponible'
        }
      }),
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
          phone: 'Nro. teléfono',
          geographicLocation: 'Ubicación geográfica',
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
    window.localStorage.clear()
    backendMocks.setCurrentStatus('available')
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
        onSubmit
      },
      global: {
        plugins: [router]
      }
    })

    await fireEvent.update(screen.getByLabelText('Nombre'), 'Ana')
    await fireEvent.update(screen.getByLabelText('Apellido'), 'Perez')
    await fireEvent.click(screen.getByRole('button', { name: 'Continuar' }))
    await fireEvent.update(screen.getByLabelText('Empresa'), 'ACME')
    await fireEvent.update(
      screen.getByLabelText(/proyecto/i, { selector: 'textarea' }),
      'Necesito una propuesta para mi planta'
    )
    await fireEvent.click(screen.getByRole('button', { name: 'Continuar' }))
    await fireEvent.update(screen.getByLabelText('WhatsApp', { selector: 'input[type="tel"]' }), '+54 11 5555 4444')
    await fireEvent.click(screen.getByRole('button', { name: 'Enviar solicitud' }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1)
    })
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        firstName: 'Ana',
        lastName: 'Perez',
        company: 'ACME',
        phone: '+54 11 5555 4444',
        comment: 'Necesito una propuesta para mi planta'
      })
    )
    expect(backendMocks.ensureContactBackendStatus).toHaveBeenCalledTimes(1)
    expect(backendMocks.subscribeToContactBackendStatus).toHaveBeenCalledTimes(1)
  })

  it('keeps submit disabled when backend channel is unavailable', async () => {
    const onSubmit = vi.fn(async () => ({ ok: true as const, data: {} }))
    backendMocks.setCurrentStatus('unavailable')
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

    const submitButton = screen.getByRole('button', { name: 'Continuar' })
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
        backendMessage: 'Ingresa e-mail o teléfono (al menos uno).',
        requestId: 'req_422'
      }
    }))
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

    await fireEvent.update(screen.getByLabelText('Nombre'), 'Ana')
    await fireEvent.update(screen.getByLabelText('Apellido'), 'Perez')
    await fireEvent.click(screen.getByRole('button', { name: 'Continuar' }))
    await fireEvent.update(screen.getByLabelText('Empresa'), 'ACME')
    await fireEvent.update(
      screen.getByLabelText(/proyecto/i, { selector: 'textarea' }),
      'Mensaje valido en longitud para forzar error de email.'
    )
    await fireEvent.click(screen.getByRole('button', { name: 'Continuar' }))
    await fireEvent.update(screen.getByLabelText('WhatsApp', { selector: 'input[type="tel"]' }), '+54 11 5555 4444')
    await fireEvent.click(screen.getByRole('button', { name: 'Enviar solicitud' }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Ingresa e-mail o teléfono (al menos uno). Código de seguimiento: req_422.'
      )
    })
  })
})
