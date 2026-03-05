<script setup lang="ts">
import { computed, ref } from 'vue'
import TecnicoACargo from '@/components/TecnicoACargo.vue'
import { getContactEmail } from '@/ui/controllers/contactController'
import type { ContactFormProps } from './contactTypes'
import { useContactFormSection } from './ContactFormSection'

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
const totalSteps = 3
const preferredContact = ref<'whatsapp' | 'phone'>('whatsapp')
const contactEmail = computed(() => getContactEmail())

const progressPercent = computed(() => Math.round((currentStep.value / totalSteps) * 100))
const isLastStep = computed(() => currentStep.value === totalSteps)
const stepLabels = ['Identidad', 'Proyecto', 'Contacto']

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
  if (currentStep.value === 1) {
    fieldErrors.firstName = form.firstName.trim() ? '' : 'Ingresa tu nombre.'
    const emailValue = form.email.trim()
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)
    fieldErrors.email = validEmail ? '' : 'Ingresa un e-mail valido.'
    return !fieldErrors.firstName && !fieldErrors.email
  }

  if (currentStep.value === 2) {
    const commentValue = form.comment.trim()
    fieldErrors.comment = commentValue.length >= 10 ? '' : 'Describe el proyecto en al menos 10 caracteres.'
    return !fieldErrors.comment
  }

  fieldErrors.phone = form.phone.trim().length >= 8 ? '' : 'Ingresa un numero de contacto valido.'
  return !fieldErrors.phone
}

async function onFinalSubmit() {
  if (!validateCurrentStep()) {
    return
  }
  await handleSubmit()
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

              <ol class="c-contact__stepper" aria-label="Pasos del formulario">
                <li
                  v-for="(label, index) in stepLabels"
                  :key="label"
                  class="c-contact__stepper-item"
                  :class="{
                    'is-active': currentStep === index + 1,
                    'is-completed': currentStep > index + 1
                  }"
                >
                  <button
                    type="button"
                    class="c-contact__stepper-trigger"
                    :aria-current="currentStep === index + 1 ? 'step' : undefined"
                    :aria-label="`Ir al paso ${index + 1}: ${label}`"
                    @click="goToStep(index + 1)"
                  >
                    <span class="c-contact__stepper-dot" aria-hidden="true">
                      <span v-if="currentStep > index + 1">✓</span>
                      <span v-else>{{ index + 1 }}</span>
                    </span>
                    <span class="c-contact__stepper-label">{{ label }}</span>
                  </button>
                </li>
              </ol>

              <div class="c-contact__progress" role="progressbar" aria-label="Progreso del formulario" :aria-valuemin="1" :aria-valuemax="totalSteps" :aria-valuenow="currentStep">
                <div class="c-contact__progress-track">
                  <div class="c-contact__progress-fill" :style="{ width: `${progressPercent}%` }"></div>
                </div>
                <p class="c-contact__progress-text">Paso {{ currentStep }} de {{ totalSteps }}</p>
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
                  <h3 class="c-contact__step-title">1. Datos de contacto</h3>
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
                    <small v-if="fieldErrors.firstName" class="c-contact__error">{{ fieldErrors.firstName }}</small>
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
                      :aria-invalid="Boolean(fieldErrors.email)"
                    />
                    <small v-if="fieldErrors.email" class="c-contact__error">{{ fieldErrors.email }}</small>
                  </div>
                </template>

                <template v-else-if="currentStep === 2">
                  <h3 class="c-contact__step-title">2. Contanos tu proyecto</h3>
                  <div>
                    <label class="c-contact__label" :for="fieldMeta.comment.inputId">Descripcion del proyecto</label>
                    <textarea
                      :id="fieldMeta.comment.inputId"
                      v-model="form.comment"
                      class="c-contact__input c-contact__input--textarea"
                      rows="6"
                      maxlength="2000"
                      :disabled="!isChannelEnabled"
                      :aria-invalid="Boolean(fieldErrors.comment)"
                    />
                    <small class="c-contact__helper">Inclui objetivos, tiempos estimados y alcance.</small>
                    <small v-if="fieldErrors.comment" class="c-contact__error">{{ fieldErrors.comment }}</small>
                  </div>
                </template>

                <template v-else>
                  <h3 class="c-contact__step-title">3. Medio de contacto preferido</h3>
                  <fieldset class="c-contact__choice-group">
                    <legend class="c-contact__label">Elegi como queres que te contactemos</legend>
                    <label class="c-contact__choice" :class="{ 'is-active': preferredContact === 'whatsapp' }">
                      <input v-model="preferredContact" type="radio" value="whatsapp" name="preferredContact" />
                      WhatsApp
                    </label>
                    <label class="c-contact__choice" :class="{ 'is-active': preferredContact === 'phone' }">
                      <input v-model="preferredContact" type="radio" value="phone" name="preferredContact" />
                      Telefono
                    </label>
                  </fieldset>

                  <div>
                    <label class="c-contact__label" :for="fieldMeta.phone.inputId">
                      {{ preferredContact === 'whatsapp' ? 'Numero de WhatsApp' : 'Numero de telefono' }}
                    </label>
                    <input
                      :id="fieldMeta.phone.inputId"
                      v-model="form.phone"
                      type="tel"
                      class="c-contact__input"
                      autocomplete="tel"
                      maxlength="40"
                      inputmode="tel"
                      :disabled="!isChannelEnabled"
                      :aria-invalid="Boolean(fieldErrors.phone)"
                    />
                    <small class="c-contact__helper">Formato sugerido: +54 9 11 1234 5678</small>
                    <small v-if="fieldErrors.phone" class="c-contact__error">{{ fieldErrors.phone }}</small>
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
            <p class="c-contact__email-title">Contactanos via email</p>
            <a class="c-contact__email-link" :href="`mailto:${contactEmail}`">{{ contactEmail }}</a>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.c-contact__stepper {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.6rem;
  margin: 0 0 0.8rem;
  padding: 0;
  list-style: none;
}

.c-contact__stepper-item {
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.03);
  color: #cfd8e3;
  min-width: 0;
}

.c-contact__stepper-trigger {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.45rem 0.55rem;
  background: transparent;
  color: inherit;
  border: 0;
  text-align: left;
  border-radius: 999px;
}

.c-contact__stepper-trigger:focus-visible {
  outline: 2px solid #ff8c00;
  outline-offset: 2px;
}

.c-contact__stepper-dot {
  width: 1.35rem;
  height: 1.35rem;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.25);
  font-size: 0.72rem;
  font-weight: 700;
  flex-shrink: 0;
}

.c-contact__stepper-label {
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.c-contact__stepper-item.is-active {
  border-color: rgba(255, 140, 0, 0.8);
  background: rgba(255, 140, 0, 0.14);
  color: #ffffff;
}

.c-contact__stepper-item.is-active .c-contact__stepper-dot {
  border-color: #ff8c00;
  background: rgba(255, 140, 0, 0.2);
}

.c-contact__stepper-item.is-completed {
  border-color: rgba(255, 140, 0, 0.6);
  color: #ffe4bf;
}

.c-contact__stepper-item.is-completed .c-contact__stepper-dot {
  border-color: #ff8c00;
  background: #ff8c00;
  color: #0a192f;
}

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
  .c-contact__stepper {
    grid-template-columns: 1fr;
  }

  .c-contact__actions {
    flex-direction: column-reverse;
  }

  .c-contact__btn {
    width: 100%;
  }
}
</style>
