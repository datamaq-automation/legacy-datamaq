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
              <TecnicoACargo
                v-if="props.showTechnicianCard"
                variant="embedded"
                :heading-id="tecnicoHeadingId"
              />
              <form
                ref="formRef"
                class="row g-3"
                novalidate
                :aria-busy="isSubmitting"
                @submit.prevent="handleSubmit"
              >
                <template v-if="isLeadChannel">
                  <div class="col-md-6">
                    <label class="form-label" :for="fieldMeta.firstName.inputId">{{ contact.labels.firstName }}</label>
                    <input
                      :id="fieldMeta.firstName.inputId"
                      v-model="form.firstName"
                      type="text"
                      class="form-control"
                      name="firstName"
                      autocomplete="given-name"
                      maxlength="80"
                      :disabled="!isChannelEnabled"
                      :aria-invalid="Boolean(fieldErrors.firstName)"
                      :aria-describedby="fieldErrors.firstName ? fieldMeta.firstName.errorId : undefined"
                    />
                    <small
                      v-if="fieldErrors.firstName"
                      :id="fieldMeta.firstName.errorId"
                      class="text-danger"
                    >{{ fieldErrors.firstName }}</small>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label" :for="fieldMeta.lastName.inputId">{{ contact.labels.lastName }}</label>
                    <input
                      :id="fieldMeta.lastName.inputId"
                      v-model="form.lastName"
                      type="text"
                      class="form-control"
                      name="lastName"
                      autocomplete="family-name"
                      maxlength="80"
                      :disabled="!isChannelEnabled"
                      :aria-invalid="Boolean(fieldErrors.lastName)"
                      :aria-describedby="fieldErrors.lastName ? fieldMeta.lastName.errorId : undefined"
                    />
                    <small
                      v-if="fieldErrors.lastName"
                      :id="fieldMeta.lastName.errorId"
                      class="text-danger"
                    >{{ fieldErrors.lastName }}</small>
                  </div>
                  <div class="col-12">
                    <label class="form-label" :for="fieldMeta.company.inputId">{{ contact.labels.company }}</label>
                    <input
                      :id="fieldMeta.company.inputId"
                      v-model="form.company"
                      type="text"
                      class="form-control"
                      name="company"
                      autocomplete="organization"
                      maxlength="120"
                      :disabled="!isChannelEnabled"
                      :aria-invalid="Boolean(fieldErrors.company)"
                      :aria-describedby="fieldErrors.company ? fieldMeta.company.errorId : undefined"
                    />
                    <small
                      v-if="fieldErrors.company"
                      :id="fieldMeta.company.errorId"
                      class="text-danger"
                    >{{ fieldErrors.company }}</small>
                  </div>
                </template>
                <div :class="isLeadChannel ? 'col-md-6' : 'col-12'">
                  <label class="form-label" :for="fieldMeta.email.inputId">{{ contact.labels.email }}</label>
                  <input
                    :id="fieldMeta.email.inputId"
                    v-model="form.email"
                    type="email"
                    class="form-control"
                    name="email"
                    autocomplete="email"
                    maxlength="160"
                    inputmode="email"
                    :disabled="!isChannelEnabled"
                    :required="!isLeadChannel"
                    :aria-invalid="Boolean(fieldErrors.email)"
                    :aria-describedby="fieldErrors.email ? fieldMeta.email.errorId : undefined"
                  />
                  <small
                    v-if="fieldErrors.email"
                    :id="fieldMeta.email.errorId"
                    class="text-danger"
                  >{{ fieldErrors.email }}</small>
                </div>
                <div v-if="isLeadChannel" class="col-md-6">
                  <label class="form-label" :for="fieldMeta.phone.inputId">{{ contact.labels.phone }}</label>
                  <input
                    :id="fieldMeta.phone.inputId"
                    v-model="form.phone"
                    type="tel"
                    class="form-control"
                    name="phone"
                    autocomplete="tel"
                    maxlength="40"
                    inputmode="tel"
                    :disabled="!isChannelEnabled"
                    :aria-invalid="Boolean(fieldErrors.phone)"
                    :aria-describedby="[
                      fieldMeta.phone.helperId,
                      fieldErrors.phone ? fieldMeta.phone.errorId : undefined
                    ].filter(Boolean).join(' ') || undefined"
                  />
                  <small
                    :id="fieldMeta.phone.helperId"
                    class="text-body-secondary d-block mt-1"
                  >Completá e-mail o teléfono.</small>
                  <small
                    v-if="fieldErrors.phone"
                    :id="fieldMeta.phone.errorId"
                    class="text-danger d-block"
                  >{{ fieldErrors.phone }}</small>
                </div>
                <div v-if="isLeadChannel" class="col-12">
                  <label class="form-label" :for="fieldMeta.geographicLocation.inputId">{{
                    contact.labels.geographicLocation
                  }}</label>
                  <input
                    :id="fieldMeta.geographicLocation.inputId"
                    v-model="form.geographicLocation"
                    type="text"
                    class="form-control"
                    name="geographicLocation"
                    autocomplete="address-level2"
                    maxlength="160"
                    :disabled="!isChannelEnabled"
                    :aria-invalid="Boolean(fieldErrors.geographicLocation)"
                    :aria-describedby="
                      fieldErrors.geographicLocation ? fieldMeta.geographicLocation.errorId : undefined
                    "
                  />
                  <small
                    v-if="fieldErrors.geographicLocation"
                    :id="fieldMeta.geographicLocation.errorId"
                    class="text-danger"
                  >{{ fieldErrors.geographicLocation }}</small>
                </div>
                <div class="col-12">
                  <label class="form-label" :for="fieldMeta.comment.inputId">{{
                    contact.labels.comment ?? contact.labels.message
                  }}</label>
                  <textarea
                    :id="fieldMeta.comment.inputId"
                    v-model="form.comment"
                    class="form-control"
                    name="comment"
                    rows="5"
                    maxlength="2000"
                    :disabled="!isChannelEnabled"
                    :required="!isLeadChannel"
                    :minlength="isLeadChannel ? undefined : 10"
                    :aria-invalid="Boolean(fieldErrors.comment)"
                    :aria-describedby="fieldErrors.comment ? fieldMeta.comment.errorId : undefined"
                  />
                  <small
                    v-if="fieldErrors.comment"
                    :id="fieldMeta.comment.errorId"
                    class="text-danger"
                  >{{ fieldErrors.comment }}</small>
                </div>
                <div class="col-12 mt-2">
                  <button
                    type="submit"
                    class="btn c-ui-btn w-100 c-contact__submit"
                    :class="isChannelEnabled ? 'c-ui-btn--primary' : 'c-ui-btn--outline disabled-channel'"
                    :disabled="!isChannelEnabled || isSubmitting"
                    :aria-disabled="!isChannelEnabled || isSubmitting"
                    :aria-busy="isSubmitting"
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
                    role="status"
                  >
                    {{ contact.checkingMessage }}
                  </p>
                  <p
                    v-else-if="!isBackendAvailable"
                    class="text-warning-emphasis bg-warning-subtle border border-warning-subtle rounded-3 px-3 py-2 small c-contact__alert"
                    role="status"
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
  isLeadChannel,
  isBackendAvailable,
  isCheckingBackend,
  isChannelEnabled,
  isSubmitting,
  feedback,
  feedbackMessageRef,
  handleSubmit
} = useContactFormSection(props)
</script>
