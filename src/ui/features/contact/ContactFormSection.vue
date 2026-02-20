<!--
Path: src/ui/features/contact/ContactFormSection.vue
-->
<template>
  <section
    :id="sectionId"
    class="section-mobile py-5 bg-dark text-white c-contact"
    :aria-labelledby="titleId"
  >
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div class="card c-ui-card c-ui-card--elevated border-0 shadow-lg bg-body text-body c-contact__card">
            <div class="card-body p-4 p-md-5">
              <h2 :id="titleId" class="h3 c-contact__title mb-3">
                {{ contact.title }}
              </h2>
              <p class="text-body mb-4 c-contact__subtitle">
                {{ contact.subtitle }}
              </p>
              <TecnicoACargo variant="embedded" :heading-id="tecnicoHeadingId" />
              <form
                ref="formRef"
                class="row g-3"
                novalidate
                @submit.prevent="handleSubmit"
              >
                <div class="col-12">
                  <label class="form-label" :for="emailId">{{ contact.labels.email }}</label>
                  <input
                    :id="emailId"
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
                <div class="col-12">
                  <label class="form-label" :for="messageId">{{ contact.labels.message }}</label>
                  <textarea
                    :id="messageId"
                    v-model="form.message"
                    class="form-control"
                    name="message"
                    rows="5"
                    required
                    minlength="10"
                    maxlength="2000"
                    :disabled="!isChannelEnabled"
                  />
                </div>
                <div class="col-12 mt-2">
                  <button
                    type="submit"
                    class="btn c-ui-btn w-100 c-contact__submit"
                    :class="isChannelEnabled ? 'c-ui-btn--primary' : 'c-ui-btn--outline disabled-channel'"
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
import TecnicoACargo from '@/components/TecnicoACargo.vue'
import type { ContactFormProps } from './contactTypes'
import { useContactFormSection } from './ContactFormSection'

const props = defineProps<ContactFormProps>()

const {
  contact,
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
} = useContactFormSection(props)
</script>
