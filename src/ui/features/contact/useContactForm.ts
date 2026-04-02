import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useContainer } from '@/di/container'
import type { ContactBackendStatus } from '@/application/contact/contactBackendStatus'
import type { ContactError } from '@/application/types/errors'
import type { ContactFormProps } from './contactTypes'
import type { ContactFormPayload } from '@/application/dto/contact'
import {
  collectInvalidContactFields,
  summarizeContactDraft,
  summarizeContactError
} from '@/application/contact/contactSubmitDiagnostics'
import {
  emitRuntimeDebug,
  emitRuntimeError,
  emitRuntimeInfo,
  emitRuntimeWarn
} from '@/application/utils/runtimeConsole'
import {
  CONTACT_FORM_FIELDS,
  type ContactFieldErrors,
  type ContactFormField,
  type ContactFormFieldMeta,
  type ContactFormFieldMetaMap,
  type ResolvedContactFormContent
} from './contactTypes'
import { useContactValidation } from './useContactValidation'
import { mapContactError } from './contactErrorMapper'
import { useRouter } from 'vue-router'

function createEmptyForm(): ContactFormPayload {
  return {
    firstName: '',
    lastName: '',
    company: '',
    email: '',
    phone: '',
    preferredContactChannel: 'whatsapp',
    geographicLocation: '',
    comment: '',
    captchaToken: ''
  }
}

function createEmptyFieldErrors(): ContactFieldErrors {
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

type ContactSubmitFeedbackState = {
  message: string
  success: boolean
}

export function useContactForm(props: ContactFormProps, contact: ResolvedContactFormContent) {
  const { contactBackend } = useContainer()
  const backendChannel = 'contact'
  const sectionId = props.sectionId?.trim() || 'contacto'
  const titleId = `${sectionId}-title`
  const fieldMeta = createFieldMeta(sectionId)
  const tecnicoHeadingId = `tecnico-a-cargo-${sectionId}-title`
  const formRef = ref<HTMLFormElement | null>(null)
  const form = reactive(createEmptyForm())
  const fieldErrors = reactive(createEmptyFieldErrors())
  const backendStatus = ref<ContactBackendStatus>(contactBackend.getStatus())
  const isBackendAvailable = computed(() => backendStatus.value === 'available')
  const isCheckingBackend = computed(() => backendStatus.value === 'unknown')
  const isChannelEnabled = computed(() => isBackendAvailable.value)
  const isSubmitting = ref(false)
  const feedback = reactive<ContactSubmitFeedbackState>({ message: '', success: false })
  const feedbackMessageRef = ref<HTMLParagraphElement | null>(null)
  let unsubscribeFromStatus: (() => void) | undefined

  async function announceFeedback(message: string, success: boolean): Promise<void> {
    feedback.message = message
    feedback.success = success
    await nextTick()
    feedbackMessageRef.value?.focus()
  }

  const { validate } = useContactValidation()

  const router = useRouter()
  const feedbackMessages = {
    unavailable: contact.unavailableMessage,
    error: contact.errorMessage
  }

  async function handleSubmit(): Promise<void> {
    const formElement = formRef.value
    const payload = buildSubmitPayload(form)
    resetSubmissionState()
    logSubmitStarted(payload)

    if (!isChannelEnabled.value) {
      emitRuntimeWarn('[contact:ui] submit bloqueado', {
        channel: backendChannel,
        sectionId,
        backendStatus: backendStatus.value,
        reason: isCheckingBackend.value ? 'backend-checking' : 'backend-unavailable'
      })
      return
    }
    if (formElement && !formElement.reportValidity()) {
      emitRuntimeDebug('[contact:ui] validacion nativa bloqueo el submit', {
        channel: backendChannel,
        sectionId
      })
      return
    }
    isSubmitting.value = true
    try {
      const parsed = validate(payload)
      if (!parsed.ok) {
        await handleValidationFailure(parsed.fieldErrors)
        return
      }

      logValidSubmission()

      const result = await props.onSubmit(parsed.data)
      if (result?.ok === true) {
        await handleSubmitSuccess(result.data)
        return
      }

      await handleSubmitFailure(result?.error)
    } catch (error) {
      emitRuntimeError('[contact:ui] excepcion inesperada durante submit', {
        channel: backendChannel,
        sectionId,
        message: error instanceof Error ? error.message : String(error)
      })
      await announceFeedback(contact.unexpectedErrorMessage, false)
      emitRuntimeDebug('[contact:ui] feedback de error inesperado mostrado', {
        channel: backendChannel,
        sectionId
      })
    } finally {
      isSubmitting.value = false
    }
  }

  onMounted(() => {
    unsubscribeFromStatus = contactBackend.subscribe((status) => {
      backendStatus.value = status
    })
    void contactBackend.ensureStatus()
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
    fieldMeta,
    tecnicoHeadingId,
    isBackendAvailable,
    isCheckingBackend,
    isChannelEnabled,
    isSubmitting,
    feedback,
    feedbackMessageRef,
    handleSubmit
  }

  function buildSubmitPayload(source: ContactFormPayload): ContactFormPayload {
    return {
      firstName: source.firstName,
      lastName: source.lastName,
      company: source.company,
      email: source.email,
      phone: source.phone,
      ...(source.preferredContactChannel
        ? { preferredContactChannel: source.preferredContactChannel }
        : {}),
      geographicLocation: source.geographicLocation,
      comment: source.comment,
      ...(source.captchaToken ? { captchaToken: source.captchaToken } : {})
    }
  }

  function resetSubmissionState(): void {
    feedback.message = ''
    feedback.success = false
    clearFieldErrors()
  }

  function logSubmitStarted(payload: ContactFormPayload): void {
    emitRuntimeDebug('[contact:ui] submit iniciado', {
      channel: backendChannel,
      sectionId,
      backendStatus: backendStatus.value,
      payload: summarizeContactDraft(payload)
    })
  }

  async function handleValidationFailure(nextErrors: Partial<ContactFieldErrors>): Promise<void> {
    applyFieldErrors(nextErrors)
    emitRuntimeWarn('[contact:ui] validacion local fallo', {
      channel: backendChannel,
      sectionId,
      invalidFields: collectInvalidContactFields(nextErrors)
    })
    await announceFeedback(contact.errorMessage, false)
  }

  function logValidSubmission(): void {
    emitRuntimeDebug('[contact:ui] validacion local OK', {
      channel: backendChannel,
      sectionId
    })

    emitRuntimeDebug('[contact:ui] enviando solicitud al caso de uso', {
      channel: backendChannel,
      sectionId
    })
  }

  async function handleSubmitSuccess(data: {
    requestId?: string
    submissionId?: string
    submitStatus?: string
    processingStatus?: string
  }): Promise<void> {
    emitRuntimeInfo('[contact:ui] submit OK', {
      channel: backendChannel,
      sectionId,
      requestId: data.requestId ?? null,
      submissionId: data.submissionId ?? null,
      submitStatus: data.submitStatus ?? null,
      processingStatus: data.processingStatus ?? null
    })
    await router.push({ name: 'thanks' })
    emitRuntimeDebug('[contact:ui] navegacion a thanks completada', {
      channel: backendChannel,
      sectionId
    })
  }

  async function handleSubmitFailure(error: ContactError | undefined): Promise<void> {
    const normalizedError = summarizeContactError(error) ?? {
      type: 'UnknownError'
    }
    emitRuntimeWarn('[contact:ui] submit fallo', {
      channel: backendChannel,
      sectionId,
      error: normalizedError
    })
    await announceFeedback(mapContactError(error, feedbackMessages), false)
    emitRuntimeDebug('[contact:ui] feedback de error mostrado', {
      channel: backendChannel,
      sectionId
    })
  }

  function clearFieldErrors(): void {
    for (const key of CONTACT_FORM_FIELDS) {
      fieldErrors[key] = ''
    }
  }

  function applyFieldErrors(nextErrors: Partial<ContactFieldErrors>): void {
    for (const key of CONTACT_FORM_FIELDS) {
      fieldErrors[key] = nextErrors[key] ?? ''
    }
  }
}

function createFieldMeta(sectionId: string): ContactFormFieldMetaMap {
  return {
    firstName: createFieldEntry(sectionId, 'nombre'),
    lastName: createFieldEntry(sectionId, 'apellido'),
    company: createFieldEntry(sectionId, 'empresa'),
    email: createFieldEntry(sectionId, 'email'),
    phone: createFieldEntry(sectionId, 'telefono', 'ayuda'),
    geographicLocation: createFieldEntry(sectionId, 'ubicacion'),
    comment: createFieldEntry(sectionId, 'comentario')
  }
}

function createFieldEntry(sectionId: string, suffix: string, helperSuffix?: string): ContactFormFieldMeta {
  const inputId = `${sectionId}-${suffix}`

  return {
    inputId,
    errorId: `${inputId}-error`,
    ...(helperSuffix ? { helperId: `${inputId}-${helperSuffix}` } : {})
  }
}
