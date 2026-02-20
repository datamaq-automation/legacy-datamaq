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
import { contactClientLogger } from '@/ui/logging/contactClientLogger'

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

    contactClientLogger.debug('submit:start', {
      sectionId,
      backendChannel,
      isChannelEnabled: isChannelEnabled.value,
      backendStatus: backendStatus.value
    })

    if (!isChannelEnabled.value) {
      contactClientLogger.warnOnce(`${backendChannel}:${sectionId}:channel-disabled`, 'submit:blocked-channel-disabled', {
        backendStatus: backendStatus.value,
        backendChannel,
        sectionId,
        hasContactEmail: Boolean(props.contactEmail)
      })
      return
    }
    if (formElement && !formElement.reportValidity()) {
      contactClientLogger.warn('submit:blocked-invalid-form', { sectionId, backendChannel })
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
        contactClientLogger.warn('submit:validation-failed', { sectionId, backendChannel })
        await announceFeedback(contact.errorMessage, false)
        return
      }
      const result = await props.onSubmit(parsed.data)
      if (result?.ok === true) {
        contactClientLogger.info('submit:success-redirecting', {
          sectionId,
          backendChannel,
          route: 'thanks'
        })
        void router.push({ name: 'thanks' })
        return
      } else {
        contactClientLogger.warn('submit:failed-no-redirect', {
          sectionId,
          backendChannel,
          errorType: result?.error?.type
        })
        await announceFeedback(
          mapContactError(result?.error, {
            unavailable: contact.unavailableMessage,
            error: contact.errorMessage
          }),
          false
        )
      }
    } catch (error) {
      contactClientLogger.error('submit:exception', {
        sectionId,
        backendChannel,
        error: error instanceof Error ? error.message : String(error)
      })
      await announceFeedback(contact.unexpectedErrorMessage, false)
    } finally {
      isSubmitting.value = false
      contactClientLogger.debug('submit:end', { sectionId, backendChannel })
    }
  }

  onMounted(() => {
    unsubscribeFromStatus = subscribeToContactBackendStatus((status) => {
      contactClientLogger.debug('backend-status:update', {
        sectionId,
        backendChannel,
        from: backendStatus.value,
        to: status
      })
      backendStatus.value = status
    }, backendChannel)
    void ensureContactBackendStatus(backendChannel)
      .then((status) => {
        contactClientLogger.debug('backend-status:ensure', {
          sectionId,
          backendChannel,
          status
        })
        if (status === 'unavailable') {
          const unavailableReason = resolveUnavailableReason({
            inquiryApiUrl: config.inquiryApiUrl,
            mailApiUrl: config.mailApiUrl,
            backendChannel
          })
          contactClientLogger.warnOnce(`backend-unavailable:${unavailableReason}`, 'backend-status:unavailable', {
            inquiryApiUrl: config.inquiryApiUrl ?? null,
            mailApiUrl: config.mailApiUrl ?? null,
            backendChannel,
            sectionId,
            reason: unavailableReason,
            hasContactEmail: Boolean(props.contactEmail),
            hint:
              'Verifica VITE_INQUIRY_API_URL/VITE_MAIL_API_URL y que el endpoint responda POST en produccion.'
          })
        }
      })
      .catch((error) => {
        contactClientLogger.errorOnce(`${backendChannel}:backend-status-error`, 'backend-status:error', {
          sectionId,
          backendChannel,
          error: error instanceof Error ? error.message : String(error)
        })
      })
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

function resolveUnavailableReason(input: {
  inquiryApiUrl: string | undefined
  mailApiUrl: string | undefined
  backendChannel: 'contact' | 'mail'
}): string {
  if (!input.inquiryApiUrl && !input.mailApiUrl) {
    return 'missing-both-api-urls'
  }

  if (input.backendChannel === 'mail' && !input.mailApiUrl) {
    return 'missing-mail-api-url'
  }

  if (input.backendChannel === 'contact' && !input.inquiryApiUrl) {
    return 'missing-contact-api-url'
  }

  return `channel-${input.backendChannel}-unavailable`
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
