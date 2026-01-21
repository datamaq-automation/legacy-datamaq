<!--
Path: src/ui/features/contact/ContactFormSection.vue
-->
<template>
  <section id="contacto" class="section-mobile py-5 bg-dark text-white contact-form-section" aria-labelledby="contacto-title">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div class="card border-0 shadow-lg bg-body text-body">
            <div class="card-body p-4 p-md-5">
              <h2 id="contacto-title" class="h3 ContactForm-title mb-3">
                {{ contact.title }}
              </h2>
              <p class="text-body mb-4">
                {{ contact.subtitle }}
              </p>
              <form
                ref="formRef"
                class="row g-3"
                novalidate
                @submit.prevent="handleSubmit"
              >
                <div class="col-12">
                  <label class="form-label" for="contacto-nombre">{{ contact.labels.name }}</label>
                  <input
                    id="contacto-nombre"
                    v-model="form.name"
                    type="text"
                    class="form-control"
                    name="name"
                    required
                    autocomplete="name"
                    maxlength="120"
                    :disabled="!isChannelEnabled"
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label" for="contacto-email">{{ contact.labels.email }}</label>
                  <input
                    id="contacto-email"
                    v-model="form.email"
                    type="email"
                    class="form-control"
                    name="email"
                    required
                    autocomplete="email"
                    maxlength="160"
                    inputmode="email"
                    :disabled="!isChannelEnabled"
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label" for="contacto-empresa">{{ contact.labels.company }}</label>
                  <input
                    id="contacto-empresa"
                    v-model="form.company"
                    type="text"
                    class="form-control"
                    name="company"
                    autocomplete="organization"
                    maxlength="160"
                    :disabled="!isChannelEnabled"
                  />
                </div>
                <div class="col-12">
                  <label class="form-label" for="contacto-mensaje">{{ contact.labels.message }}</label>
                  <textarea
                    id="contacto-mensaje"
                    v-model="form.message"
                    class="form-control"
                    name="message"
                    rows="4"
                    maxlength="1200"
                    :disabled="!isChannelEnabled"
                  ></textarea>
                </div>
                <div class="col-12 mt-2">
                  <button
                    type="submit"
                    class="btn w-100 email-submit-cta"
                    :class="isChannelEnabled ? 'btn-primary' : 'btn-outline-secondary disabled-channel'"
                    :disabled="!isChannelEnabled || isSubmitting"
                    :aria-disabled="!isChannelEnabled || isSubmitting"
                  >
                    <span v-if="isSubmitting">
                      Enviando...
                      <span class="spinner-border spinner-border-sm ms-2" role="status" aria-hidden="true"></span>
                    </span>
                    <span v-else>
                      {{ contact.submitLabel }}
                    </span>
                  </button>
                </div>
                <div class="col-12" aria-live="polite" aria-atomic="true">
                  <p
                    v-if="isCheckingBackend"
                    class="text-info-emphasis bg-info-subtle border border-info-subtle rounded-3 px-3 py-2 small"
                  >
                    {{ contact.checkingMessage }}
                  </p>
                  <p
                    v-else-if="!isBackendAvailable"
                    class="text-warning-emphasis bg-warning-subtle border border-warning-subtle rounded-3 px-3 py-2 small contact-alert"
                  >
                    {{ contact.unavailableMessage }}
                  </p>
                  <p
                    v-if="feedback.message"
                    ref="feedbackMessageRef"
                    :class="['mt-2', 'alert', feedback.success ? 'alert-success' : 'alert-danger']"
                    role="alert"
                    tabindex="-1"
                  >
                    {{ feedback.message }}
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { ContactFormProps } from './contactTypes'
import { useContactFormSection } from './ContactFormSection'

const props = defineProps<ContactFormProps>()

const {
  contact,
  formRef,
  form,
  isBackendAvailable,
  isCheckingBackend,
  isChannelEnabled,
  isSubmitting,
  feedback,
  feedbackMessageRef,
  handleSubmit
} = useContactFormSection(props)
</script>
