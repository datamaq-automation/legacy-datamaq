import { computed, onMounted, ref, watch, type ComputedRef, type Ref } from 'vue'
import {
  clampContactLeadStep,
  CONTACT_LEAD_STEP_LABELS,
  CONTACT_LEAD_TOTAL_STEPS,
  hasContactLeadStepErrors,
  normalizePreferredContact,
  type ContactPersistedDraft,
  validateContactLeadStep
} from '@/features/contact/application/leadWizard'
import { readContactDraft, removeContactDraft, writeContactDraft } from '@/features/contact/infrastructure/contactDraftStorage'
import type { ContactFieldErrors } from './contactTypes'
import type { ContactFormPayload } from '@/application/dto/contact'

type FeedbackState = {
  message: string
  success: boolean
}

type UseContactLeadWizardOptions = {
  form: ContactFormPayload
  fieldErrors: ContactFieldErrors
  sectionId: string
  feedback: FeedbackState
  handleSubmit: () => Promise<void>
  turnstileEnabled: ComputedRef<boolean>
  turnstileToken: Ref<string>
  turnstileErrorMessage: Ref<string>
  resetTurnstile: () => void
}

export function useContactLeadWizard(options: UseContactLeadWizardOptions) {
  const currentStep = ref(1)
  const totalSteps = CONTACT_LEAD_TOTAL_STEPS
  const preferredContact = ref<'whatsapp' | 'email'>('whatsapp')
  const progressPercent = computed(() => Math.round((currentStep.value / totalSteps) * 100))
  const isLastStep = computed(() => currentStep.value === totalSteps)
  const stepLabels = CONTACT_LEAD_STEP_LABELS
  const draftStorageKey = `dm-contact-draft-${options.sectionId}`
  const draftNotice = 'Guardamos un borrador temporal de este formulario por hasta 12 horas en este dispositivo.'

  function goPrevStep() {
    if (currentStep.value > 1) {
      currentStep.value -= 1
    }
  }

  function goToStep(targetStep: number) {
    if (targetStep === currentStep.value || targetStep < 1 || targetStep > totalSteps) {
      return
    }
    if (targetStep < currentStep.value) {
      currentStep.value = targetStep
      return
    }
    if (validateCurrentStep()) {
      currentStep.value = targetStep
    }
  }

  function goNextStep() {
    if (!validateCurrentStep()) {
      return
    }
    if (currentStep.value < totalSteps) {
      currentStep.value += 1
    }
  }

  async function onFinalSubmit() {
    if (!validateCurrentStep()) {
      return
    }
    if (options.turnstileEnabled.value && !options.turnstileToken.value) {
      options.feedback.success = false
      options.feedback.message =
        options.turnstileErrorMessage.value || 'Completa la verificacion anti-bot para enviar el formulario.'
      return
    }
    options.form.captchaToken = options.turnstileToken.value
    options.form.preferredContactChannel = preferredContact.value
    await options.handleSubmit()
    if (options.feedback.success) {
      removeContactDraft(draftStorageKey)
      options.resetTurnstile()
    }
  }

  onMounted(() => {
    const draft = readContactDraft(draftStorageKey)
    if (!draft) {
      return
    }
    options.form.company = draft.company ?? options.form.company
    options.form.comment = draft.comment ?? options.form.comment
    preferredContact.value = normalizePreferredContact(draft.preferredContact)
    currentStep.value = clampContactLeadStep(draft.currentStep)
  })

  watch(
    () => [
      options.form.firstName,
      options.form.lastName,
      options.form.company,
      options.form.email,
      options.form.comment,
      options.form.phone,
      preferredContact.value,
      currentStep.value
    ],
    () => {
      const draft: ContactPersistedDraft = {
        company: options.form.company,
        comment: options.form.comment,
        preferredContact: preferredContact.value,
        currentStep: currentStep.value
      }
      writeContactDraft(draftStorageKey, draft)
    }
  )

  watch(options.turnstileToken, (value) => {
    options.form.captchaToken = value
  })

  watch(preferredContact, (value) => {
    options.form.preferredContactChannel = value
  })

  return {
    currentStep,
    totalSteps,
    preferredContact,
    progressPercent,
    isLastStep,
    stepLabels,
    draftNotice,
    goPrevStep,
    goToStep,
    goNextStep,
    onFinalSubmit
  }

  function validateCurrentStep(): boolean {
    const stepErrors = validateContactLeadStep(currentStep.value, {
      firstName: options.form.firstName,
      lastName: options.form.lastName,
      company: options.form.company,
      email: options.form.email,
      comment: options.form.comment,
      phone: options.form.phone,
      preferredContact: preferredContact.value
    })

    options.fieldErrors.firstName = stepErrors.firstName ?? ''
    options.fieldErrors.lastName = stepErrors.lastName ?? ''
    options.fieldErrors.company = stepErrors.company ?? ''
    options.fieldErrors.email = stepErrors.email ?? ''
    options.fieldErrors.comment = stepErrors.comment ?? ''
    options.fieldErrors.phone = stepErrors.phone ?? ''

    return !hasContactLeadStepErrors(stepErrors)
  }
}
