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
          email: 'Correo electronico',
          message: 'Mensaje'
        },
        submitLabel: 'Enviar consulta por correo',
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
    reportValiditySpy = vi
      .spyOn(HTMLFormElement.prototype, 'reportValidity')
      .mockReturnValue(true)
  })

  afterEach(() => {
    reportValiditySpy.mockRestore()
  })

  it('submits a valid payload when channel is enabled', async () => {
    const onSubmit = vi.fn(async () => ({ ok: true as const, data: undefined }))
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

    await fireEvent.update(screen.getByLabelText('Correo electronico'), 'ana@example.com')
    await fireEvent.update(screen.getByLabelText('Mensaje'), 'Necesito una propuesta para mi planta')
    await fireEvent.click(screen.getByRole('button', { name: 'Enviar consulta por correo' }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1)
    })
      expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'ana@example.com',
        message: 'Necesito una propuesta para mi planta'
      })
    )
    expect(backendMocks.ensureContactBackendStatus).toHaveBeenCalledTimes(1)
    expect(backendMocks.subscribeToContactBackendStatus).toHaveBeenCalledTimes(1)
  })

  it('keeps submit disabled when contact email is not configured', async () => {
    const onSubmit = vi.fn(async () => ({ ok: true as const, data: undefined }))
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

    const submitButton = screen.getByRole('button', { name: 'Enviar consulta por correo' })
    expect(submitButton).toBeDisabled()

    await fireEvent.click(submitButton)
    expect(onSubmit).not.toHaveBeenCalled()
  })
})
