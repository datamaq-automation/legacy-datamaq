<!--
Path: src/ui/features/contact/ContactFormSection.vue
-->
<template>
  <section id="contacto" class="section-mobile py-5 bg-dark text-white c-contact" aria-labelledby="contacto-title">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div class="card border-0 shadow-lg bg-body text-body c-contact__card">
            <div class="card-body p-4 p-md-5">
              <h2 id="contacto-title" class="h3 c-contact__title mb-3">
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
                <div class="col-12 col-md-6">
                  <label class="form-label" for="contacto-nombre">
                    {{ contact.labels.firstName }}
                  </label>
                  <input
                    id="contacto-nombre"
                    v-model="form.firstName"
                    type="text"
                    class="form-control"
                    name="firstName"
                    required
                    autocomplete="given-name"
                    maxlength="80"
                    :disabled="!isChannelEnabled"
                  />
                </div>
                <div class="col-12 col-md-6">
                  <label class="form-label" for="contacto-apellido">
                    {{ contact.labels.lastName }}
                  </label>
                  <input
                    id="contacto-apellido"
                    v-model="form.lastName"
                    type="text"
                    class="form-control"
                    name="lastName"
                    required
                    autocomplete="family-name"
                    maxlength="80"
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
                  <label class="form-label" for="contacto-telefono">{{ contact.labels.phone }}</label>
                  <input
                    id="contacto-telefono"
                    v-model="form.phoneNumber"
                    type="tel"
                    class="form-control"
                    name="phoneNumber"
                    autocomplete="tel"
                    maxlength="30"
                    inputmode="tel"
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
                <div class="col-md-6">
                  <label class="form-label" for="contacto-ciudad">{{ contact.labels.city }}</label>
                  <input
                    id="contacto-ciudad"
                    v-model="form.city"
                    type="text"
                    class="form-control"
                    name="city"
                    autocomplete="address-level2"
                    maxlength="120"
                    :disabled="!isChannelEnabled"
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label" for="contacto-pais">{{ contact.labels.country }}</label>
                  <input
                    id="contacto-pais"
                    v-model="form.country"
                    type="text"
                    class="form-control"
                    name="country"
                    autocomplete="country-name"
                    maxlength="80"
                    :disabled="!isChannelEnabled"
                  />
                </div>
                <div class="col-12 mt-2">
                  <button
                    type="submit"
                    class="btn w-100 c-contact__submit"
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
                    class="text-warning-emphasis bg-warning-subtle border border-warning-subtle rounded-3 px-3 py-2 small c-contact__alert"
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
