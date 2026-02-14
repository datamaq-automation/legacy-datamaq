import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'
import { fireEvent, render, screen, waitFor } from '@testing-library/vue'
import { RouterView, createMemoryHistory, createRouter } from 'vue-router'
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
    content: {
      getContactContent: () => ({
        title: 'Contacto',
        subtitle: 'Dejanos tu consulta y te contactamos.',
        labels: {
          firstName: 'Nombre',
          lastName: 'Apellido',
          email: 'Correo electronico',
          phone: 'Telefono (opcional)',
          city: 'Ciudad (opcional)',
          country: 'Pais',
          company: 'Empresa (opcional)'
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

describe('Contact submit and thanks flow', () => {
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

  it('navigates to thanks route after successful submit', async () => {
    const onSubmit = vi.fn(async () => ({ ok: true as const, data: undefined }))

    const HomeRoute = defineComponent({
      components: { ContactFormSection },
      setup() {
        return {
          onSubmit
        }
      },
      template: `
        <ContactFormSection
          contactEmail="contacto@example.com"
          :on-submit="onSubmit"
        />
      `
    })

    const ThanksRoute = defineComponent({
      template: '<h1>Gracias por contactarte</h1>'
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
    await fireEvent.update(screen.getByLabelText('Apellido'), 'Gomez')
    await fireEvent.update(screen.getByLabelText('Correo electronico'), 'maria@example.com')
    await fireEvent.click(screen.getByRole('button', { name: 'Enviar consulta por correo' }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1)
      expect(router.currentRoute.value.name).toBe('thanks')
    })
    expect(screen.getByRole('heading', { name: 'Gracias por contactarte' })).toBeInTheDocument()
  })
})
