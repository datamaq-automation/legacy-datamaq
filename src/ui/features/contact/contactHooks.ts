import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import {
  ensureContactBackendStatus,
  getContactBackendStatus,
  subscribeToContactBackendStatus,
  type ContactBackendStatus
} from '@/ui/controllers/contactBackendController'
import type { ContactFormProps } from './contactTypes'
import type { ContactError } from '@/application/types/errors'
import { useContent } from '@/ui/composables/useContent'
import { useContactValidation } from './useContactValidation'
import { navigateTo } from '@/infrastructure/navigation/spaNavigation'

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
  const { contact } = useContent()
  let unsubscribeFromStatus: (() => void) | undefined

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

    console.log('[ContactFormSection] submit start')
    if (!isChannelEnabled.value) {
      console.log('[ContactFormSection] channel disabled')
      return
    }
    if (formElement && !formElement.reportValidity()) {
      console.log('[ContactFormSection] browser validation failed')
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
        console.log('[ContactFormSection] validation failed', parsed.error)
        await announceFeedback(contact.errorMessage, false)
        return
      }
      const result = await props.onSubmit(parsed.data)
      console.log('[ContactFormSection] Resultado de onSubmit:', result)
      if (result && result.ok) {
        console.log('[ContactFormSection] submit success, redirecting to /gracias')
        navigateTo('/gracias')
        return
      } else {
        console.log('[ContactFormSection] submit failed', result?.error)
        await announceFeedback(
          mapContactError(result?.error, {
            unavailable: contact.unavailableMessage,
            error: contact.errorMessage
          }),
          false
        )
      }
    } catch (error) {
      console.error('[ContactFormSection] Error inesperado en handleSubmit:', error)
      await announceFeedback(contact.unexpectedErrorMessage, false)
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

function mapContactError(
  error: ContactError | undefined,
  messages: { unavailable: string; error: string }
): string {
  if (!error) {
    return messages.error
  }
  switch (error.type) {
    case 'Unavailable':
      return messages.unavailable
    case 'NetworkError':
      return messages.error
    case 'BackendError':
      if (error.status === 429) {
        return 'Demasiadas solicitudes. Intenta nuevamente en unos minutos.'
      }
      return 'No se pudo enviar la consulta. Verifica los datos e intenta nuevamente.'
    case 'ValidationError':
      return messages.error
    default:
      return messages.error
  }
}
