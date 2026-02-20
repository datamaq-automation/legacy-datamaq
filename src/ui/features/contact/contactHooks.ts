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
    const startedAtMs = Date.now()
    const formElement = formRef.value
    feedback.message = ''
    feedback.success = false

    contactClientLogger.info('submit_clicked', {
      sectionId,
      backendChannel,
      isChannelEnabled: isChannelEnabled.value,
      backendStatus: backendStatus.value,
      endpointConfigured: hasConfiguredEndpoint(config, backendChannel)
    })

    if (!isChannelEnabled.value) {
      contactClientLogger.warnOnce(
        `${backendChannel}:${sectionId}:channel-disabled`,
        'submit_blocked_channel_disabled',
        {
        backendStatus: backendStatus.value,
        backendChannel,
        sectionId,
        hasContactEmail: Boolean(props.contactEmail),
        endpointConfigured: hasConfiguredEndpoint(config, backendChannel)
      }
      )
      return
    }
    if (formElement && !formElement.reportValidity()) {
      contactClientLogger.warn('submit_blocked_html_validation', {
        sectionId,
        backendChannel
      })
      return
    }
    isSubmitting.value = true
    try {
      const payload: EmailContactPayload = {
        email: form.email,
        message: form.message
      }
      const payloadMeta = extractPayloadMeta(payload)
      const parsed = validate(payload)
      if (!parsed.ok) {
        contactClientLogger.warn('submit_blocked_domain_validation', {
          sectionId,
          backendChannel,
          ...payloadMeta
        })
        await announceFeedback(contact.errorMessage, false)
        return
      }
      contactClientLogger.info('submit_request_started', {
        sectionId,
        backendChannel,
        ...payloadMeta
      })
      const result = await props.onSubmit(parsed.data)
      if (result?.ok === true) {
        contactClientLogger.info('submit_response_ok', {
          sectionId,
          backendChannel,
          requestId: result.data.requestId ?? null,
          route: 'thanks',
          latencyMs: Date.now() - startedAtMs
        })
        void router.push({ name: 'thanks' })
        return
      } else {
        contactClientLogger.warn('submit_response_error', {
          sectionId,
          backendChannel,
          errorType: result?.error?.type,
          statusCode:
            result?.error?.type === 'BackendError' ? result.error.status : undefined,
          requestId:
            result?.error?.type === 'BackendError' || result?.error?.type === 'NetworkError'
              ? result.error.requestId ?? null
              : null,
          errorCode:
            result?.error?.type === 'BackendError' || result?.error?.type === 'NetworkError'
              ? result.error.errorCode ?? null
              : null,
          backendMessage:
            result?.error?.type === 'BackendError' || result?.error?.type === 'NetworkError'
              ? result.error.backendMessage ?? null
              : null,
          latencyMs: Date.now() - startedAtMs
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
      contactClientLogger.error('submit_exception', {
        sectionId,
        backendChannel,
        error: error instanceof Error ? error.message : String(error),
        latencyMs: Date.now() - startedAtMs
      })
      await announceFeedback(contact.unexpectedErrorMessage, false)
    } finally {
      isSubmitting.value = false
      contactClientLogger.debug('submit_end', { sectionId, backendChannel })
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
  inquiryApiUrl: string | null | undefined
  mailApiUrl: string | null | undefined
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

function hasConfiguredEndpoint(
  config: {
    inquiryApiUrl: string | null | undefined
    mailApiUrl: string | null | undefined
  },
  channel: 'contact' | 'mail'
): boolean {
  return channel === 'mail' ? Boolean(config.mailApiUrl) : Boolean(config.inquiryApiUrl)
}

function extractPayloadMeta(payload: EmailContactPayload): {
  hasEmail: boolean
  emailDomain: string | null
  messageLength: number
} {
  const email = payload.email.trim().toLowerCase()
  const emailDomain = email.includes('@') ? email.split('@')[1] ?? null : null
  return {
    hasEmail: email.length > 0,
    emailDomain,
    messageLength: payload.message.trim().length
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
