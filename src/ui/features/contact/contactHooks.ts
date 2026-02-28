import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import {
  ensureContactBackendStatus,
  getContactBackendStatus,
  subscribeToContactBackendStatus,
  type ContactBackendStatus
} from '@/ui/controllers/contactBackendController'
import type { ContactFormProps } from './contactTypes'
import type { ContactError } from '@/application/types/errors'
import type { ContactFormPayload } from '@/application/dto/contact'
import { useContainer } from '@/di/container'
import { useContactValidation } from './useContactValidation'
import { useRouter } from 'vue-router'

type ContactFieldErrorState = Record<keyof ContactFormPayload, string>

function createEmptyForm(): ContactFormPayload {
  return {
    firstName: '',
    lastName: '',
    company: '',
    email: '',
    phone: '',
    geographicLocation: '',
    comment: ''
  }
}

function createEmptyFieldErrors(): ContactFieldErrorState {
  return {
    firstName: '',
    lastName: '',
    company: '',
    email: '',
    phone: '',
    geographicLocation: '',
    comment: ''
  }
}

export function useContactForm(props: ContactFormProps) {
  const backendChannel = props.backendChannel ?? 'contact'
  const isLeadChannel = backendChannel === 'contact'
  const sectionId = props.sectionId?.trim() || 'contacto'
  const titleId = `${sectionId}-title`
  const firstNameId = `${sectionId}-nombre`
  const lastNameId = `${sectionId}-apellido`
  const companyId = `${sectionId}-empresa`
  const emailId = `${sectionId}-email`
  const phoneId = `${sectionId}-telefono`
  const geographicLocationId = `${sectionId}-ubicacion`
  const commentId = `${sectionId}-comentario`
  const tecnicoHeadingId = `tecnico-a-cargo-${sectionId}-title`
  const formRef = ref<HTMLFormElement | null>(null)
  const form = reactive(createEmptyForm())
  const fieldErrors = reactive(createEmptyFieldErrors())
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
    clearFieldErrors()

    if (!isChannelEnabled.value) {
      return
    }
    if (formElement && !formElement.reportValidity()) {
      return
    }
    isSubmitting.value = true
    try {
      const payload: ContactFormPayload = {
        firstName: form.firstName,
        lastName: form.lastName,
        company: form.company,
        email: form.email,
        phone: form.phone,
        geographicLocation: form.geographicLocation,
        comment: form.comment
      }
      const parsed = validate(payload, backendChannel)
      if (!parsed.ok) {
        applyFieldErrors(parsed.fieldErrors)
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
    } catch {
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
    fieldErrors,
    sectionId,
    titleId,
    firstNameId,
    lastNameId,
    companyId,
    emailId,
    phoneId,
    geographicLocationId,
    commentId,
    tecnicoHeadingId,
    isLeadChannel,
    isBackendAvailable,
    isCheckingBackend,
    isChannelEnabled,
    isSubmitting,
    feedback,
    feedbackMessageRef,
    handleSubmit
  }

  function clearFieldErrors(): void {
    for (const key of Object.keys(fieldErrors) as Array<keyof ContactFormPayload>) {
      fieldErrors[key] = ''
    }
  }

  function applyFieldErrors(nextErrors: Partial<Record<keyof ContactFormPayload, string>>): void {
    for (const key of Object.keys(fieldErrors) as Array<keyof ContactFormPayload>) {
      fieldErrors[key] = nextErrors[key] ?? ''
    }
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
      if (error.backendMessage && error.status >= 400 && error.status < 500) {
        return appendTrackingId(error.backendMessage, error.requestId)
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
