import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import {
  ensureContactBackendStatus,
  getContactBackendStatus,
  subscribeToContactBackendStatus,
  type ContactBackendStatus
} from '@/ui/controllers/contactBackendController'
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

type ContactFormFieldMeta = {
  inputId: string
  errorId: string
  helperId?: string
}

type ContactFormFieldMetaMap = Record<ContactFormField, ContactFormFieldMeta>

type ContactSubmitFeedbackState = {
  message: string
  success: boolean
}

export function useContactForm(props: ContactFormProps, contact: ResolvedContactFormContent) {
  const backendChannel = 'contact'
  const sectionId = props.sectionId?.trim() || 'contacto'
  const titleId = `${sectionId}-title`
  const fieldMeta = createFieldMeta(sectionId)
  const tecnicoHeadingId = `tecnico-a-cargo-${sectionId}-title`
  const formRef = ref<HTMLFormElement | null>(null)
  const form = reactive(createEmptyForm())
  const fieldErrors = reactive(createEmptyFieldErrors())
  const backendStatus = ref<ContactBackendStatus>(getContactBackendStatus())
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

  async function handleSubmit(): Promise<void> {
    const formElement = formRef.value
    const payload: ContactFormPayload = {
      firstName: form.firstName,
      lastName: form.lastName,
      company: form.company,
      email: form.email,
      phone: form.phone,
      ...(form.preferredContactChannel ? { preferredContactChannel: form.preferredContactChannel } : {}),
      geographicLocation: form.geographicLocation,
      comment: form.comment,
      ...(form.captchaToken ? { captchaToken: form.captchaToken } : {})
    }
    feedback.message = ''
    feedback.success = false
    clearFieldErrors()

    emitRuntimeDebug('[contact:ui] submit iniciado', {
      channel: backendChannel,
      sectionId,
      backendStatus: backendStatus.value,
      payload: summarizeContactDraft(payload)
    })

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
        applyFieldErrors(parsed.fieldErrors)
        emitRuntimeWarn('[contact:ui] validacion local fallo', {
          channel: backendChannel,
          sectionId,
          invalidFields: collectInvalidContactFields(parsed.fieldErrors)
        })
        await announceFeedback(contact.errorMessage, false)
        return
      }

      emitRuntimeDebug('[contact:ui] validacion local OK', {
        channel: backendChannel,
        sectionId
      })

      emitRuntimeDebug('[contact:ui] enviando solicitud al caso de uso', {
        channel: backendChannel,
        sectionId
      })

      const result = await props.onSubmit(parsed.data)
      if (result?.ok === true) {
        emitRuntimeInfo('[contact:ui] submit OK', {
          channel: backendChannel,
          sectionId,
          requestId: result.data.requestId ?? null,
          submissionId: result.data.submissionId ?? null,
          submitStatus: result.data.submitStatus ?? null,
          processingStatus: result.data.processingStatus ?? null
        })
        await router.push({ name: 'thanks' })
        emitRuntimeDebug('[contact:ui] navegacion a thanks completada', {
          channel: backendChannel,
          sectionId
        })
        return
      } else {
        const normalizedError = summarizeContactError(result?.error) ?? { type: 'UnknownError' }
        emitRuntimeWarn('[contact:ui] submit fallo', {
          channel: backendChannel,
          sectionId,
          error: normalizedError
        })
        await announceFeedback(
          mapContactError(result?.error, {
            unavailable: contact.unavailableMessage,
            error: contact.errorMessage
          }),
          false
        )
        emitRuntimeDebug('[contact:ui] feedback de error mostrado', {
          channel: backendChannel,
          sectionId
        })
      }
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
    unsubscribeFromStatus = subscribeToContactBackendStatus((status) => {
      backendStatus.value = status
    })
    void ensureContactBackendStatus()
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
