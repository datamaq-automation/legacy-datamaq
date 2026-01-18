import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import {
  ensureContactBackendStatus,
  getContactBackendStatus,
  subscribeToContactBackendStatus,
  type ContactBackendStatus
} from '@/interfaces/controllers/contactBackendController'
import type { ContactFormProps } from './contactTypes'

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
      const result = await props.onSubmit({
        name: form.name,
        email: form.email,
        company: form.company,
        message: form.message
      })
      if (import.meta.env.DEV) {
        console.debug('[ContactFormSection] Resultado de onSubmit:', result)
      }
      if (result && result.ok) {
        if (formElement) formElement.reset()
        resetForm()
        await announceFeedback('¡Consulta enviada correctamente! Te responderemos a la brevedad.', true)
      } else {
        await announceFeedback(
          result?.error || 'No se pudo enviar la consulta. Intenta nuevamente más tarde.',
          false
        )
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
