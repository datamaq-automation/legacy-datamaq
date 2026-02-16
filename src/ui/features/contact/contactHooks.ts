import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import {
  ensureContactBackendStatus,
  getContactBackendStatus,
  subscribeToContactBackendStatus,
  type ContactBackendStatus
} from '@/ui/controllers/contactBackendController'
import type { ContactFormProps } from './contactTypes'
import type { ContactError } from '@/application/types/errors'
import type { EmailContactPayload } from '@/application/dto/contact'
import { useContainer } from '@/di/container'
import { useContactValidation } from './useContactValidation'
import { useRouter } from 'vue-router'

export function useContactForm(props: ContactFormProps) {
  const formRef = ref<HTMLFormElement | null>(null)
  const form = reactive({
    email: '',
    message: ''
  })
  const backendStatus = ref<ContactBackendStatus>(getContactBackendStatus())
  const isBackendAvailable = computed(() => backendStatus.value === 'available')
  const isCheckingBackend = computed(() => backendStatus.value === 'unknown')
  const isChannelEnabled = computed(() => Boolean(props.contactEmail) && isBackendAvailable.value)
  const isSubmitting = ref(false)
  const feedback = reactive<{ message: string; success: boolean }>({ message: '', success: false })
  const feedbackMessageRef = ref<HTMLParagraphElement | null>(null)
  const { content, config } = useContainer()
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

    console.log('[contact:debug] submit:start', {
      isChannelEnabled: isChannelEnabled.value,
      backendStatus: backendStatus.value
    })

    if (!isChannelEnabled.value) {
      console.warn('[contact:debug] submit:blocked-channel-disabled', {
        backendStatus: backendStatus.value,
        hasContactEmail: Boolean(props.contactEmail)
      })
      return
    }
    if (formElement && !formElement.reportValidity()) {
      console.warn('[contact:debug] submit:blocked-invalid-form')
      return
    }
    isSubmitting.value = true
    try {
      const payload: EmailContactPayload = {
        email: form.email,
        message: form.message
      }
      console.log('[contact:debug] submit:payload-collected', {
        email: payload.email,
        messageLength: payload.message.length
      })

      const parsed = validate(payload)
      if (!parsed.ok) {
        console.warn('[contact:debug] submit:validation-failed')
        await announceFeedback(contact.errorMessage, false)
        return
      }
      console.log('[contact:debug] submit:validation-ok')
      const result = await props.onSubmit(parsed.data)
      console.log('[contact:debug] submit:result', result)
      if (result?.ok === true) {
        console.log('[contact:debug] submit:success-redirecting', { route: 'thanks' })
        void router.push({ name: 'thanks' })
        return
      } else {
        console.warn('[contact:debug] submit:failed-no-redirect', result)
        await announceFeedback(
          mapContactError(result?.error, {
            unavailable: contact.unavailableMessage,
            error: contact.errorMessage
          }),
          false
        )
      }
    } catch (error) {
      console.error('[contact:debug] submit:exception', error)
      await announceFeedback(contact.unexpectedErrorMessage, false)
    } finally {
      isSubmitting.value = false
      console.log('[contact:debug] submit:end')
    }
  }

  onMounted(() => {
    unsubscribeFromStatus = subscribeToContactBackendStatus((status) => {
      console.log('[contact:debug] backend-status:update', { from: backendStatus.value, to: status })
      backendStatus.value = status
    })
    void ensureContactBackendStatus()
      .then((status) => {
        console.log('[contact:debug] backend-status:ensure', { status })
        if (status === 'unavailable') {
          console.error('[contact:debug] backend-status:unavailable', {
            inquiryApiUrl: config.inquiryApiUrl ?? null,
            hasContactEmail: Boolean(props.contactEmail),
            hint:
              'Verifica VITE_INQUIRY_API_URL en build y que el endpoint responda POST en produccion.'
          })
        }
      })
      .catch((error) => {
        console.error('[contact:debug] backend-status:error', error)
      })
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
