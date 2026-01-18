import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import {
  ensureContactBackendStatus,
  getContactBackendStatus,
  subscribeToContactBackendStatus,
  type ContactBackendStatus
} from '@/interfaces/controllers/contactBackendController'
import type { ContactFormProps } from './contactTypes'
import type { ContactError } from '@/application/types/errors'
import { useContactValidation } from './useContactValidation'

export function useContactForm(props: ContactFormProps) {
  const formRef = ref<HTMLFormElement | null>(null)
  const form = reactive({
    name: '',
    email: '',
    company: '',
    message: ''
  })
  const backendStatus = ref<ContactBackendStatus>(getContactBackendStatus())
  const isBackendAvailable = computed(() => backendStatus.value === 'available')
  const isCheckingBackend = computed(() => backendStatus.value === 'unknown')
  const isChannelEnabled = computed(() => Boolean(props.contactEmail) && isBackendAvailable.value)
  const isSubmitting = ref(false)
  const feedback = reactive<{ message: string; success: boolean }>({ message: '', success: false })
  const feedbackMessageRef = ref<HTMLParagraphElement | null>(null)
  let unsubscribeFromStatus: (() => void) | undefined

  function resetForm(): void {
    form.name = ''
    form.email = ''
    form.company = ''
    form.message = ''
  }

  async function announceFeedback(message: string, success: boolean): Promise<void> {
    feedback.message = message
    feedback.success = success
    await nextTick()
    feedbackMessageRef.value?.focus()
  }

  const { validate } = useContactValidation()

  async function handleSubmit(): Promise<void> {
    const formElement = formRef.value
    feedback.message = ''
    feedback.success = false

    if (!isChannelEnabled.value) {
      return
    }
    if (formElement && !formElement.reportValidity()) {
      return
    }
    isSubmitting.value = true
    try {
      const parsed = validate({
        name: form.name,
        email: form.email,
        company: form.company,
        message: form.message
      })
      if (!parsed.ok) {
        await announceFeedback('Revisá los datos ingresados e intenta nuevamente.', false)
        return
      }
      const result = await props.onSubmit(parsed.data)
      if (import.meta.env.DEV) {
        console.debug('[ContactFormSection] Resultado de onSubmit:', result)
      }
      if (result && result.ok) {
        if (formElement) formElement.reset()
        resetForm()
        await announceFeedback('¡Consulta enviada correctamente! Te responderemos a la brevedad.', true)
      } else {
        await announceFeedback(mapContactError(result?.error), false)
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('[ContactFormSection] Error inesperado en handleSubmit:', error)
      }
      await announceFeedback('Ocurrió un error inesperado. Intenta nuevamente más tarde.', false)
    } finally {
      isSubmitting.value = false
    }
  }

  onMounted(() => {
    unsubscribeFromStatus = subscribeToContactBackendStatus((status) => {
      backendStatus.value = status
    })
    void ensureContactBackendStatus()
  })

  onBeforeUnmount(() => {
    unsubscribeFromStatus?.()
  })

  return {
    formRef,
    form,
    isBackendAvailable,
    isCheckingBackend,
    isChannelEnabled,
    isSubmitting,
    feedback,
    feedbackMessageRef,
    handleSubmit
  }
}

function mapContactError(error: ContactError | undefined): string {
  if (!error) {
    return 'No se pudo enviar la consulta. Intenta nuevamente más tarde.'
  }
  switch (error.type) {
    case 'Unavailable':
      return 'El canal de correo electrónico no se encuentra disponible en este momento.'
    case 'NetworkError':
      return 'No se pudo enviar la consulta. Intenta nuevamente más tarde.'
    case 'BackendError':
      if (error.status === 429) {
        return 'Demasiadas solicitudes. Intenta nuevamente en unos minutos.'
      }
      return 'No se pudo enviar la consulta. Verifica los datos e intenta nuevamente.'
    case 'ValidationError':
      return 'Revisá los datos ingresados e intenta nuevamente.'
    default:
      return 'No se pudo enviar la consulta. Intenta nuevamente más tarde.'
  }
}
