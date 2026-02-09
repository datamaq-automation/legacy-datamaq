import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import {
  ensureContactBackendStatus,
  getContactBackendStatus,
  subscribeToContactBackendStatus,
  type ContactBackendStatus
} from '@/ui/controllers/contactBackendController'
import type { ContactFormProps } from './contactTypes'
import type { ContactError } from '@/application/types/errors'
import { useContainer } from '@/di/container'
import { useContactValidation } from './useContactValidation'
import { useRouter } from 'vue-router'

export function useContactForm(props: ContactFormProps) {
  const formRef = ref<HTMLFormElement | null>(null)
  const form = reactive({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    city: '',
    country: 'Argentina',
    company: ''
  })
  const backendStatus = ref<ContactBackendStatus>(getContactBackendStatus())
  const isBackendAvailable = computed(() => backendStatus.value === 'available')
  const isCheckingBackend = computed(() => backendStatus.value === 'unknown')
  const isChannelEnabled = computed(() => Boolean(props.contactEmail) && isBackendAvailable.value)
  const isSubmitting = ref(false)
  const feedback = reactive<{ message: string; success: boolean }>({ message: '', success: false })
  const feedbackMessageRef = ref<HTMLParagraphElement | null>(null)
  const { content } = useContainer()
  const contact = content.getContactContent()
  let unsubscribeFromStatus: (() => void) | undefined

  async function announceFeedback(message: string, success: boolean): Promise<void> {
    feedback.message = message
    feedback.success = success
    await nextTick()
    feedbackMessageRef.value?.focus()
  }

  const { validate } = useContactValidation()

  const router = useRouter()

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
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phoneNumber: form.phoneNumber || undefined,
        city: form.city || undefined,
        country: form.country || undefined,
        company: form.company
      })
      if (!parsed.ok) {
        await announceFeedback(contact.errorMessage, false)
        return
      }
      const result = await props.onSubmit(parsed.data)
      if (result && result.ok) {
        void router.push('/gracias')
        return
      } else {
        await announceFeedback(
          mapContactError(result?.error, {
            unavailable: contact.unavailableMessage,
            error: contact.errorMessage
          }),
          false
        )
      }
    } catch (error) {
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
