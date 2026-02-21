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
  const backendChannel = props.backendChannel ?? 'contact'
  const sectionId = props.sectionId?.trim() || 'contacto'
  const titleId = `${sectionId}-title`
  const emailId = `${sectionId}-email`
  const messageId = `${sectionId}-mensaje`
  const tecnicoHeadingId = `tecnico-a-cargo-${sectionId}-title`
  const formRef = ref<HTMLFormElement | null>(null)
  const form = reactive({
    email: '',
    message: ''
  })
  const backendStatus = ref<ContactBackendStatus>(getContactBackendStatus(backendChannel))
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
      const payload: EmailContactPayload = {
        email: form.email,
        message: form.message
      }
      const parsed = validate(payload)
      if (!parsed.ok) {
        await announceFeedback(contact.errorMessage, false)
        return
      }
      const result = await props.onSubmit(parsed.data)
      if (result?.ok === true) {
        void router.push({ name: 'thanks' })
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
    }, backendChannel)
    void ensureContactBackendStatus(backendChannel)
      .then((status) => {
        void status
      })
      .catch(() => undefined)
  })

  onBeforeUnmount(() => {
    unsubscribeFromStatus?.()
  })

  return {
    formRef,
    form,
    sectionId,
    titleId,
    emailId,
    messageId,
    tecnicoHeadingId,
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
      return appendTrackingId(messages.error, error.requestId)
    case 'BackendError':
      if (error.status === 429) {
        return appendTrackingId(
          'Demasiadas solicitudes. Intenta nuevamente en unos minutos.',
          error.requestId
        )
      }
      return appendTrackingId(
        'No se pudo enviar la consulta. Verifica los datos e intenta nuevamente.',
        error.requestId
      )
    case 'ValidationError':
      return messages.error
    default:
      return messages.error
  }
}

function appendTrackingId(message: string, requestId: string | undefined): string {
  if (!requestId) {
    return message
  }
  return `${message} Codigo de seguimiento: ${requestId}.`
}
