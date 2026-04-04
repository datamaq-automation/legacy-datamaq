<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useContainer } from '@/di/container'
import TecnicoACargo from '@/components/TecnicoACargo.vue'
import ContactChannelStep from './ContactChannelStep.vue'
import ContactIdentityStep from './ContactIdentityStep.vue'
import ContactProjectStep from './ContactProjectStep.vue'
import ContactStepper from './ContactStepper.vue'
import { getContactEmail } from '@/ui/controllers/contactController'
import type { ContactFormProps, ResolvedContactFormContent } from './contactTypes'
import { useContactForm } from './useContactForm'
import { useTurnstile } from './useTurnstile'
import {
  clampContactLeadStep,
  CONTACT_LEAD_STEP_LABELS,
  CONTACT_LEAD_TOTAL_STEPS,
  hasContactLeadStepErrors,
  normalizePreferredContact,
  validateContactLeadStep
} from './contactLeadWizard'
import { readContactDraft, removeContactDraft, writeContactDraft } from './contactDraftStorage'

// ARCH-ROADMAP: migracion pendiente de ubicacion. Seguimiento en docs/feature-migration-roadmap.md (ITEM-2).

const props = withDefaults(defineProps<ContactFormProps>(), {
  showTechnicianCard: true
})

const { content } = useContainer()
const contactContent = content.getContactContent()
const contact: ResolvedContactFormContent = {
  ...contactContent,
  labels: {
    firstName: 'Nombre',
    lastName: 'Apellido',
    company: 'Empresa',
    email: 'E-mail',
    phone: 'Nro. teléfono',
    geographicLocation: 'Ubicación geográfica',
    comment: 'Comentario',
    message: 'Comentario',
    ...contactContent.labels
  },
  title: props.title ?? contactContent.title,
  subtitle: props.subtitle ?? contactContent.subtitle,
  submitLabel: props.submitLabel ?? contactContent.submitLabel
}

const {
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
} = useContactForm(props, contact)

const contactEmail = computed(() => getContactEmail())
const {
  enabled: turnstileEnabled,
  token: turnstileToken,
  errorMessage: turnstileErrorMessage,
  containerRef: turnstileContainerRef,
  reset: resetTurnstile
} = useTurnstile()

const currentStep = ref(1)
const totalSteps = CONTACT_LEAD_TOTAL_STEPS
const preferredContact = ref<'whatsapp' | 'email'>('whatsapp')
const progressPercent = computed(() => Math.round((currentStep.value / totalSteps) * 100))
const isLastStep = computed(() => currentStep.value === totalSteps)
const stepLabels = CONTACT_LEAD_STEP_LABELS
const draftStorageKey = `dm-contact-draft-${sectionId}`
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
  if (turnstileEnabled.value && !turnstileToken.value) {
    feedback.success = false
    feedback.message =
      turnstileErrorMessage.value || 'Completa la verificacion anti-bot para enviar el formulario.'
    return
  }
  form.captchaToken = turnstileToken.value
  form.preferredContactChannel = preferredContact.value
  await handleSubmit()
  if (feedback.success) {
    removeContactDraft(draftStorageKey)
    resetTurnstile()
  }
}

onMounted(() => {
  const draft = readContactDraft(draftStorageKey)
  if (!draft) {
    return
  }
  form.company = draft.company ?? form.company
  form.comment = draft.comment ?? form.comment
  preferredContact.value = normalizePreferredContact(draft.preferredContact)
  currentStep.value = clampContactLeadStep(draft.currentStep)
})

watch(
  () => [form.company, form.comment, preferredContact.value, currentStep.value],
  () => {
    writeContactDraft(draftStorageKey, {
      company: form.company,
      comment: form.comment,
      preferredContact: preferredContact.value,
      currentStep: currentStep.value
    })
  }
)

function validateCurrentStep(): boolean {
  if (currentStep.value < totalSteps) {
    fieldErrors.email = ''
    fieldErrors.phone = ''
    return true
  }

  const stepErrors = validateContactLeadStep({
    email: form.email,
    phone: form.phone,
    preferredContact: preferredContact.value
  })

  fieldErrors.email = stepErrors.email ?? ''
  fieldErrors.phone = stepErrors.phone ?? ''

  return !hasContactLeadStepErrors(stepErrors)
}
</script>

<template>
  <section
    :id="sectionId"
    class="tw:py-10 tw:bg-dm-bg tw:text-dm-text-0 c-contact"
    :aria-labelledby="titleId"
  >
    <div class="tw:container tw:mx-auto tw:px-4">
      <div class="tw:flex tw:justify-center">
        <div class="tw:w-full tw:max-w-3xl">
          <div class="tw:bg-dm-surface tw:border tw:border-dm-border tw:rounded-2xl tw:shadow-2xl c-contact__card">
            <div class="tw:p-5 tw:lg:p-8">
              <h2 :id="titleId" class="tw:text-2xl tw:lg:text-3xl tw:font-bold c-contact__title tw:mb-2">
                {{ contact.title }}
              </h2>
              <p class="tw:text-dm-text-muted tw:mb-5 c-contact__subtitle">
                {{ contact.subtitle }}
              </p>

              <ContactStepper
                :current-step="currentStep"
                :step-labels="stepLabels"
                @go-to-step="goToStep"
              />

              <div class="c-contact__progress" role="progressbar" aria-label="Progreso del formulario" :aria-valuemin="1" :aria-valuemax="totalSteps" :aria-valuenow="currentStep">
                <div class="c-contact__progress-track">
                  <div class="c-contact__progress-fill" :style="{ width: `${progressPercent}%` }"></div>
                </div>
                <p class="c-contact__progress-text">Paso {{ currentStep }} de {{ totalSteps }}</p>
                <p class="c-contact__privacy-note">{{ draftNotice }}</p>
              </div>

              <TecnicoACargo
                v-if="props.showTechnicianCard"
                variant="embedded"
                :heading-id="tecnicoHeadingId"
              />

              <form
                ref="formRef"
                class="tw:grid tw:grid-cols-1 tw:gap-4"
                novalidate
                :aria-busy="isSubmitting"
                @submit.prevent="onFinalSubmit"
              >
                <Transition name="step-fade" mode="out-in">
                  <div :key="currentStep">
                    <ContactIdentityStep
                      v-if="currentStep === 1"
                      :form="form"
                      :field-errors="fieldErrors"
                      :field-meta="fieldMeta"
                      :is-channel-enabled="isChannelEnabled"
                    />
                    <ContactProjectStep
                      v-else-if="currentStep === 2"
                      :form="form"
                      :field-errors="fieldErrors"
                      :field-meta="fieldMeta"
                      :is-channel-enabled="isChannelEnabled"
                    />
                    <ContactChannelStep
                      v-else
                      :form="form"
                      :field-errors="fieldErrors"
                      :field-meta="fieldMeta"
                      :is-channel-enabled="isChannelEnabled"
                      :preferred-contact="preferredContact"
                      @update:preferred-contact="preferredContact = $event"
                    />
                  </div>
                </Transition>

                <div v-if="turnstileEnabled" class="c-contact__turnstile">
                  <p class="c-contact__helper c-contact__helper--turnstile">
                    Verificacion anti-bot requerida para enviar.
                  </p>
                  <div ref="turnstileContainerRef" class="c-contact__turnstile-widget"></div>
                  <small v-if="turnstileErrorMessage" class="c-contact__error">{{ turnstileErrorMessage }}</small>
                </div>

                <div class="c-contact__actions">
                  <button
                    v-if="currentStep > 1"
                    type="button"
                    class="c-contact__btn c-contact__btn--ghost"
                    :disabled="isSubmitting"
                    @click="goPrevStep"
                  >
                    Volver
                  </button>

                  <button
                    v-if="!isLastStep"
                    type="button"
                    class="c-contact__btn c-contact__btn--primary"
                    :disabled="!isChannelEnabled || isSubmitting"
                    @click="goNextStep"
                  >
                    Continuar
                  </button>

                  <button
                    v-else
                    type="submit"
                    class="c-contact__btn c-contact__btn--primary"
                    :disabled="!isChannelEnabled || isSubmitting || (turnstileEnabled && !turnstileToken)"
                    :aria-busy="isSubmitting"
                  >
                    <span v-if="isSubmitting" class="tw:flex tw:items-center tw:justify-center tw:gap-2">
                      Enviando solicitud...
                      <span class="tw:animate-spin tw:h-4 tw:w-4 tw:border-2 tw:border-white tw:border-t-transparent tw:rounded-full"></span>
                    </span>
                    <span v-else>Enviar solicitud</span>
                  </button>
                </div>

                <div aria-live="polite" aria-atomic="true">
                  <p
                    v-if="isCheckingBackend"
                    class="tw:text-blue-200 tw:bg-blue-900/40 tw:border tw:border-blue-700 tw:rounded-xl tw:px-4 tw:py-3 tw:text-sm"
                    role="status"
                  >
                    {{ contact.checkingMessage }}
                  </p>
                  <p
                    v-else-if="!isBackendAvailable"
                    class="tw:text-orange-200 tw:bg-orange-900/35 tw:border tw:border-orange-600 tw:rounded-xl tw:px-4 tw:py-3 tw:text-sm"
                    role="status"
                  >
                    {{ contact.unavailableMessage }}
                  </p>
                  <p
                    v-if="feedback.message"
                    ref="feedbackMessageRef"
                    :class="['tw:mt-3', 'tw:px-4', 'tw:py-3', 'tw:rounded-xl', 'tw:border', feedback.success ? 'tw:text-green-200 tw:bg-green-900/35 tw:border-green-700' : 'tw:text-red-200 tw:bg-red-900/35 tw:border-red-700']"
                    role="alert"
                    tabindex="-1"
                  >
                    {{ feedback.message }}
                  </p>
                </div>
              </form>
            </div>
          </div>

          <article v-if="contactEmail" class="c-contact__email-card" aria-label="Contacto alternativo por email">
            <p class="c-contact__email-label">Contacto alternativo</p>
            <p class="c-contact__email-title">Cont&aacute;ctanos v&iacute;a e-mail</p>
            <a class="c-contact__email-link" :href="`mailto:${contactEmail}`">{{ contactEmail }}</a>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.c-contact__progress-track {
  height: 0.5rem;
  border-radius: 999px;
  background: rgba(var(--dm-text-0-rgb), 0.14);
  overflow: hidden;
}

.c-contact__progress-fill {
  height: 100%;
  border-radius: inherit;
  background: rgb(var(--dm-accent-orange-rgb));
  transition: width 220ms ease;
}

.c-contact__progress-text {
  margin: 0.5rem 0 1rem;
  font-size: 0.82rem;
  color: rgba(var(--dm-text-0-rgb), 0.82);
}

.c-contact__privacy-note {
  margin: 0 0 1rem;
  font-size: 0.78rem;
  color: rgba(var(--dm-text-0-rgb), 0.68);
}

:deep(.c-contact__step-title) {
  margin: 0 0 0.35rem;
  color: var(--dm-text-0);
  font-size: 1rem;
  font-weight: 700;
}

.c-contact__step-panel {
  display: grid;
  gap: 1rem;
}

:deep(.c-contact__label) {
  display: block;
  margin-bottom: 0.35rem;
  color: rgba(var(--dm-text-0-rgb), 0.92);
  font-size: 0.9rem;
  font-weight: 600;
}

:deep(.c-contact__helper) {
  display: block;
  margin-top: 0.4rem;
  color: rgba(var(--dm-text-0-rgb), 0.76);
  font-size: 0.78rem;
}

:deep(.c-contact__helper--turnstile) {
  margin: 0 0 0.55rem;
}

:deep(.c-contact__input) {
  width: 100%;
  min-height: 2.9rem;
  padding: 0.7rem 0.9rem;
  border-radius: 0.75rem;
  border: 1px solid rgba(var(--dm-text-0-rgb), 0.28);
  background: rgba(var(--dm-bg-0-rgb), 0.88);
  color: var(--dm-text-0);
  outline: none;
  transition: border-color 180ms ease, box-shadow 180ms ease;
}

:deep(.c-contact__input:focus-visible) {
  border-color: rgb(var(--dm-accent-orange-rgb));
  box-shadow: 0 0 0 3px rgba(var(--dm-accent-orange-rgb), 0.25);
}

:deep(.c-contact__input::placeholder) {
  color: rgba(var(--dm-text-0-rgb), 0.64);
}

:deep(.c-contact__input[aria-invalid='true']) {
  border-color: rgb(var(--dm-accent-orange-rgb));
}

:deep(.c-contact__input--textarea) {
  min-height: 7.5rem;
  resize: vertical;
}

:deep(.c-contact__choice-group) {
  border: 1px solid rgba(var(--dm-text-0-rgb), 0.2);
  border-radius: 0.9rem;
  padding: 0.8rem;
  margin: 0;
}

:deep(.c-contact__choice) {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.6rem;
  border-radius: 0.65rem;
  color: rgba(var(--dm-text-0-rgb), 0.82);
}

:deep(.c-contact__choice.is-active) {
  background: rgba(var(--dm-accent-orange-rgb), 0.2);
  color: var(--dm-text-0);
}

.c-contact__actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.8rem;
  margin-top: 0.35rem;
}

.c-contact__turnstile {
  margin-top: 0.4rem;
}

.c-contact__turnstile-widget {
  min-height: 66px;
}

.c-contact__btn {
  min-height: 2.8rem;
  padding: 0.65rem 1.2rem;
  border-radius: 0.75rem;
  border: 1px solid transparent;
  font-weight: 700;
  transition: opacity 160ms ease, transform 160ms ease;
}

.c-contact__btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.c-contact__btn--primary {
  background: rgb(var(--dm-accent-orange-rgb));
  color: var(--dm-bg-0);
}

.c-contact__btn--ghost {
  background: transparent;
  border-color: rgba(var(--dm-text-0-rgb), 0.26);
  color: rgba(var(--dm-text-0-rgb), 0.95);
}

:deep(.c-contact__error) {
  display: block;
  margin-top: 0.4rem;
  color: rgba(var(--dm-accent-orange-rgb), 0.9);
  font-size: 0.8rem;
}

.c-contact__email-card {
  margin-top: 1rem;
  border: 1px solid rgba(var(--dm-text-0-rgb), 0.16);
  border-radius: 1rem;
  padding: 1rem 1.2rem;
  background: rgba(var(--dm-bg-0-rgb), 0.72);
}

.c-contact__email-label {
  margin: 0;
  color: rgba(var(--dm-text-0-rgb), 0.78);
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.c-contact__email-title {
  margin: 0.35rem 0;
  color: rgba(var(--dm-text-0-rgb), 0.95);
  font-weight: 700;
}

.c-contact__email-link {
  color: rgba(var(--dm-accent-orange-rgb), 0.9);
  text-decoration: none;
  font-weight: 600;
}

.step-fade-enter-active,
.step-fade-leave-active {
  transition: opacity 180ms ease, transform 180ms ease;
}

.step-fade-enter-from,
.step-fade-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

@media (prefers-reduced-motion: reduce) {
  .step-fade-enter-active,
  .step-fade-leave-active {
    transition: none;
  }
}

@media (max-width: 767.98px) {
  .c-contact__actions {
    flex-direction: column-reverse;
  }

  .c-contact__btn {
    width: 100%;
  }
}
</style>


