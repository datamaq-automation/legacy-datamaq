import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'
import { fireEvent, render, screen, waitFor } from '@testing-library/vue'
import { RouterView, createMemoryHistory, createRouter } from 'vue-router'
import ContactFormSection from '@/ui/features/contact/ContactFormSection.vue'

const backendMocks = vi.hoisted(() => ({
  subscribeToContactBackendStatus: vi.fn(() => () => {}),
  ensureContactBackendStatus: vi.fn(async () => 'available')
}))

vi.mock('@/di/container', () => ({
  useContainer: () => ({
    config: {
      inquiryApiUrl: undefined
    },
    contactBackend: {
      getStatus: () => 'available',
      subscribe: backendMocks.subscribeToContactBackendStatus,
      ensureStatus: backendMocks.ensureContactBackendStatus
    },
    content: {
      getBrandContent: () => ({
        contactEmail: 'info@datamaq.com.ar',
        contactFormActive: true,
        technician: {
          name: 'Agustin Bustos',
          role: 'Técnico a cargo',
          photo: {
            src: '/media/tecnico-a-cargo.webp',
            alt: 'Foto del técnico a cargo',
            width: 100,
            height: 100
          },
          whatsappLabel: 'Coordinar por WhatsApp',
          unavailableLabel: 'Técnico no disponible'
        }
      }),
      getHeroContent: () => ({
        primaryCta: {
          href: 'https://wa.me/5491156297160'
        }
      }),
      getContactContent: () => ({
        title: 'Contacto',
        subtitle: 'Dejanos tu consulta y te vamos a contactar.',
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

describe('Contact submit and thanks flow', () => {
  let reportValiditySpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    vi.clearAllMocks()
    window.localStorage.clear()
    reportValiditySpy = vi.spyOn(HTMLFormElement.prototype, 'reportValidity').mockReturnValue(true)
  })

  afterEach(() => {
    reportValiditySpy.mockRestore()
  })

  it('navigates to thanks route after successful submit', async () => {
    const onSubmit = vi.fn(async () => ({ ok: true as const, data: {} }))

    const HomeRoute = defineComponent({
      components: { ContactFormSection },
      setup() {
        return {
          onSubmit
        }
      },
      template: `
        <ContactFormSection
          :on-submit="onSubmit"
        />
      `
    })

    const ThanksRoute = defineComponent({
      template: '<h1>¡Gracias por escribirnos!</h1>'
    })

    const AppHost = defineComponent({
      components: { RouterView },
      template: '<RouterView />'
    })

    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', name: 'home', component: HomeRoute },
        { path: '/gracias', name: 'thanks', component: ThanksRoute }
      ]
    })

    await router.push('/')
    await router.isReady()

    render(AppHost, {
      global: {
        plugins: [router]
      }
    })

    await fireEvent.update(screen.getByLabelText('Nombre'), 'Maria')
    await fireEvent.update(screen.getByLabelText('Apellido'), 'Perez')
    await fireEvent.click(screen.getByRole('button', { name: 'Continuá' }))
    await fireEvent.update(
      screen.getByLabelText('Descripción del proyecto'),
      'Necesito una propuesta para una planta.'
    )
    await fireEvent.click(screen.getByRole('button', { name: 'Continuá' }))
    await fireEvent.update(screen.getByLabelText('WhatsApp', { selector: 'input[type="tel"]' }), '+54 11 5555 4444')
    await fireEvent.click(screen.getByRole('button', { name: 'Enviá tu solicitud' }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1)
      expect(router.currentRoute.value.name).toBe('thanks')
    })
    expect(screen.getByRole('heading', { name: '¡Gracias por escribirnos!' })).toBeInTheDocument()
  })
})
