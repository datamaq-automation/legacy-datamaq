<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import TecnicoACargo from '@/components/TecnicoACargo.vue'
import ContactStepper from './ContactStepper.vue'
import {
  clampContactLeadStep,
  CONTACT_LEAD_STEP_LABELS,
  CONTACT_LEAD_TOTAL_STEPS,
  type ContactPersistedDraft,
  hasContactLeadStepErrors,
  normalizePreferredContact,
  readContactDraft,
  removeContactDraft,
  validateContactLeadStep,
  writeContactDraft
} from '@/features/contact'
import { getContactEmail } from '@/ui/controllers/contactController'
import type { ContactFormProps } from './contactTypes'
import { useContactFormSection } from './ContactFormSection'

// ARCH-ROADMAP: migracion pendiente de ubicacion. Seguimiento en docs/feature-migration-roadmap.md (ITEM-2).

const props = withDefaults(defineProps<ContactFormProps>(), {
  showTechnicianCard: true
})

const {
  contact,
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
} = useContactFormSection(props)

const currentStep = ref(1)
const totalSteps = CONTACT_LEAD_TOTAL_STEPS
const preferredContact = ref<'whatsapp' | 'email'>('whatsapp')
const contactEmail = computed(() => getContactEmail())

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

function validateCurrentStep(): boolean {
  const stepErrors = validateContactLeadStep(currentStep.value, {
    firstName: form.firstName,
    lastName: form.lastName,
    company: form.company,
    email: form.email,
    comment: form.comment,
    phone: form.phone,
    preferredContact: preferredContact.value
  })

  fieldErrors.firstName = stepErrors.firstName ?? ''
  fieldErrors.lastName = stepErrors.lastName ?? ''
  fieldErrors.company = stepErrors.company ?? ''
  fieldErrors.email = stepErrors.email ?? ''
  fieldErrors.comment = stepErrors.comment ?? ''
  fieldErrors.phone = stepErrors.phone ?? ''

  return !hasContactLeadStepErrors(stepErrors)
}

async function onFinalSubmit() {
  if (!validateCurrentStep()) {
    return
  }
  await handleSubmit()
  if (feedback.success) {
    removeContactDraft(draftStorageKey)
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
  () => [
    form.firstName,
    form.lastName,
    form.company,
    form.email,
    form.comment,
    form.phone,
    preferredContact.value,
    currentStep.value
  ],
  () => {
    const draft: ContactPersistedDraft = {
      company: form.company,
      comment: form.comment,
      preferredContact: preferredContact.value,
      currentStep: currentStep.value
    }
    writeContactDraft(draftStorageKey, draft)
  }
)
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
                  <div :key="currentStep" class="c-contact__step-panel">
                <template v-if="currentStep === 1">
                  <h3 class="c-contact__step-title">1. Identidad</h3>
                  <div>
                    <label class="c-contact__label" :for="fieldMeta.firstName.inputId">Nombre</label>
                    <input
                      :id="fieldMeta.firstName.inputId"
                      v-model="form.firstName"
                      type="text"
                      class="c-contact__input"
                      autocomplete="given-name"
                      maxlength="80"
                      :disabled="!isChannelEnabled"
                      :aria-invalid="Boolean(fieldErrors.firstName)"
                    />
                    <small class="c-contact__helper">Opcional</small>
                    <small v-if="fieldErrors.firstName" class="c-contact__error">{{ fieldErrors.firstName }}</small>
                  </div>
                  <div>
                    <label class="c-contact__label" :for="fieldMeta.lastName.inputId">Apellido</label>
                    <input
                      :id="fieldMeta.lastName.inputId"
                      v-model="form.lastName"
                      type="text"
                      class="c-contact__input"
                      autocomplete="family-name"
                      maxlength="80"
                      :disabled="!isChannelEnabled"
                      :aria-invalid="Boolean(fieldErrors.lastName)"
                    />
                    <small class="c-contact__helper">Opcional</small>
                    <small v-if="fieldErrors.lastName" class="c-contact__error">{{ fieldErrors.lastName }}</small>
                  </div>
                </template>

                <template v-else-if="currentStep === 2">
                  <h3 class="c-contact__step-title">2. Proyecto</h3>
                  <div>
                    <label class="c-contact__label" :for="fieldMeta.company.inputId">Empresa</label>
                    <input
                      :id="fieldMeta.company.inputId"
                      v-model="form.company"
                      type="text"
                      class="c-contact__input"
                      autocomplete="organization"
                      maxlength="120"
                      :disabled="!isChannelEnabled"
                      :aria-invalid="Boolean(fieldErrors.company)"
                    />
                    <small class="c-contact__helper">Opcional</small>
                    <small v-if="fieldErrors.company" class="c-contact__error">{{ fieldErrors.company }}</small>
                  </div>
                  <div>
                    <label class="c-contact__label" :for="fieldMeta.comment.inputId">Descripci&oacute;n del proyecto</label>
                    <textarea
                      :id="fieldMeta.comment.inputId"
                      v-model="form.comment"
                      class="c-contact__input c-contact__input--textarea"
                      rows="6"
                      maxlength="2000"
                      :disabled="!isChannelEnabled"
                      :aria-invalid="Boolean(fieldErrors.comment)"
                    />
                    <small class="c-contact__helper">Opcional</small>
                    <small v-if="fieldErrors.comment" class="c-contact__error">{{ fieldErrors.comment }}</small>
                  </div>
                </template>

                <template v-else>
                  <h3 class="c-contact__step-title">3. Medio de contacto preferido</h3>
                  <fieldset class="c-contact__choice-group">
                    <legend class="c-contact__label">Eleg&iacute; c&oacute;mo quer&eacute;s que te contactemos</legend>
                    <label class="c-contact__choice" :class="{ 'is-active': preferredContact === 'whatsapp' }">
                      <input v-model="preferredContact" type="radio" value="whatsapp" name="preferredContact" />
                      WhatsApp
                    </label>
                    <label class="c-contact__choice" :class="{ 'is-active': preferredContact === 'email' }">
                      <input v-model="preferredContact" type="radio" value="email" name="preferredContact" />
                      E-mail
                    </label>
                  </fieldset>

                  <div>
                    <label class="c-contact__label" :for="fieldMeta.phone.inputId">WhatsApp</label>
                    <input
                      :id="fieldMeta.phone.inputId"
                      v-model="form.phone"
                      type="tel"
                      class="c-contact__input"
                      autocomplete="tel"
                      maxlength="40"
                      inputmode="tel"
                      :disabled="!isChannelEnabled"
                      :aria-required="preferredContact === 'whatsapp'"
                      :aria-invalid="Boolean(fieldErrors.phone)"
                    />
                    <small class="c-contact__helper">
                      {{ preferredContact === 'whatsapp' ? 'Obligatorio en esta opcion.' : 'Opcional.' }}
                    </small>
                    <small v-if="fieldErrors.phone" class="c-contact__error">{{ fieldErrors.phone }}</small>
                  </div>
                  <div>
                    <label class="c-contact__label" :for="fieldMeta.email.inputId">E-mail</label>
                    <input
                      :id="fieldMeta.email.inputId"
                      v-model="form.email"
                      type="email"
                      class="c-contact__input"
                      autocomplete="email"
                      maxlength="160"
                      inputmode="email"
                      :disabled="!isChannelEnabled"
                      :aria-required="preferredContact === 'email'"
                      :aria-invalid="Boolean(fieldErrors.email)"
                    />
                    <small class="c-contact__helper">
                      {{ preferredContact === 'email' ? 'Obligatorio en esta opcion.' : 'Opcional.' }}
                    </small>
                    <small v-if="fieldErrors.email" class="c-contact__error">{{ fieldErrors.email }}</small>
                  </div>
                </template>
                  </div>
                </Transition>

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
                    :disabled="!isChannelEnabled || isSubmitting"
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
  background: rgba(255, 255, 255, 0.14);
  overflow: hidden;
}

.c-contact__progress-fill {
  height: 100%;
  border-radius: inherit;
  background: #ff8c00;
  transition: width 220ms ease;
}

.c-contact__progress-text {
  margin: 0.5rem 0 1rem;
  font-size: 0.82rem;
  color: #d1d9e2;
}

.c-contact__privacy-note {
  margin: 0 0 1rem;
  font-size: 0.78rem;
  color: #b8c6d8;
}

.c-contact__step-title {
  margin: 0 0 0.35rem;
  color: #f6f8fb;
  font-size: 1rem;
  font-weight: 700;
}

.c-contact__step-panel {
  display: grid;
  gap: 1rem;
}

.c-contact__label {
  display: block;
  margin-bottom: 0.35rem;
  color: #e9eef5;
  font-size: 0.9rem;
  font-weight: 600;
}

.c-contact__helper {
  display: block;
  margin-top: 0.4rem;
  color: #cfd8e3;
  font-size: 0.78rem;
}

.c-contact__input {
  width: 100%;
  min-height: 2.9rem;
  padding: 0.7rem 0.9rem;
  border-radius: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.28);
  background: #0a192f;
  color: #ffffff;
  outline: none;
  transition: border-color 180ms ease, box-shadow 180ms ease;
}

.c-contact__input:focus-visible {
  border-color: #ff8c00;
  box-shadow: 0 0 0 3px rgba(255, 140, 0, 0.25);
}

.c-contact__input::placeholder {
  color: #b8c6d8;
}

.c-contact__input[aria-invalid='true'] {
  border-color: #ff6b6b;
}

.c-contact__input--textarea {
  min-height: 7.5rem;
  resize: vertical;
}

.c-contact__choice-group {
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.9rem;
  padding: 0.8rem;
  margin: 0;
}

.c-contact__choice {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.6rem;
  border-radius: 0.65rem;
  color: #d6dfeb;
}

.c-contact__choice.is-active {
  background: rgba(255, 140, 0, 0.2);
  color: #ffffff;
}

.c-contact__actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.8rem;
  margin-top: 0.35rem;
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
  background: #ff8c00;
  color: #0a192f;
}

.c-contact__btn--ghost {
  background: transparent;
  border-color: rgba(255, 255, 255, 0.26);
  color: #f4f8fc;
}

.c-contact__error {
  display: block;
  margin-top: 0.4rem;
  color: #ff9b9b;
  font-size: 0.8rem;
}

.c-contact__email-card {
  margin-top: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 1rem;
  padding: 1rem 1.2rem;
  background: rgba(10, 25, 47, 0.72);
}

.c-contact__email-label {
  margin: 0;
  color: #c9d4e3;
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.c-contact__email-title {
  margin: 0.35rem 0;
  color: #f4f8fc;
  font-weight: 700;
}

.c-contact__email-link {
  color: #ffb357;
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


