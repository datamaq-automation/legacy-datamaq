<!--
Path: src/ui/features/contact/ContactFormSection.vue
-->
<template>
  <section
    :id="sectionId"
    class="tw:py-16 tw:bg-dm-bg tw:text-dm-text-0 c-contact"
    :aria-labelledby="titleId"
  >
    <div class="tw:container tw:mx-auto tw:px-4">
      <div class="tw:flex tw:justify-center">
        <div class="tw:w-full tw:max-w-4xl">
          <div class="tw:bg-dm-surface tw:border tw:border-dm-border tw:rounded-2xl tw:shadow-2xl c-contact__card">
            <div class="tw:p-6 tw:lg:p-12">
              <h2 :id="titleId" class="tw:text-2xl tw:lg:text-3xl tw:font-bold c-contact__title tw:mb-4">
                {{ contact.title }}
              </h2>
              <p class="tw:text-dm-text-muted tw:mb-8 c-contact__subtitle">
                {{ contact.subtitle }}
              </p>
              <TecnicoACargo
                v-if="props.showTechnicianCard"
                variant="embedded"
                :heading-id="tecnicoHeadingId"
              />
              <form
                ref="formRef"
                class="tw:grid tw:grid-cols-1 tw:md:grid-cols-2 tw:gap-6"
                novalidate
                :aria-busy="isSubmitting"
                @submit.prevent="handleSubmit"
              >
                <template v-if="isLeadChannel">
                  <div class="tw:col-span-1">
                    <label class="tw:form-label" :for="fieldMeta.firstName.inputId">{{ contact.labels.firstName }}</label>
                    <input
                      :id="fieldMeta.firstName.inputId"
                      v-model="form.firstName"
                      type="text"
                      class="tw:form-control"
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
                      class="tw:text-red-500 tw:mt-1 tw:block"
                    >{{ fieldErrors.firstName }}</small>
                  </div>
                  <div class="tw:col-span-1">
                    <label class="tw:form-label" :for="fieldMeta.lastName.inputId">{{ contact.labels.lastName }}</label>
                    <input
                      :id="fieldMeta.lastName.inputId"
                      v-model="form.lastName"
                      type="text"
                      class="tw:form-control"
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
                      class="tw:text-red-500 tw:mt-1 tw:block"
                    >{{ fieldErrors.lastName }}</small>
                  </div>
                  <div class="tw:col-span-1 tw:md:col-span-2">
                    <label class="tw:form-label" :for="fieldMeta.company.inputId">{{ contact.labels.company }}</label>
                    <input
                      :id="fieldMeta.company.inputId"
                      v-model="form.company"
                      type="text"
                      class="tw:form-control"
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
                      class="tw:text-red-500 tw:mt-1 tw:block"
                    >{{ fieldErrors.company }}</small>
                  </div>
                </template>
                <div :class="isLeadChannel ? 'tw:col-span-1' : 'tw:col-span-1 tw:md:col-span-2'">
                  <label class="tw:form-label" :for="fieldMeta.email.inputId">{{ contact.labels.email }}</label>
                  <input
                    :id="fieldMeta.email.inputId"
                    v-model="form.email"
                    type="email"
                    class="tw:form-control"
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
                    class="tw:text-red-500 tw:mt-1 tw:block"
                  >{{ fieldErrors.email }}</small>
                </div>
                <div v-if="isLeadChannel" class="tw:col-span-1">
                  <label class="tw:form-label" :for="fieldMeta.phone.inputId">{{ contact.labels.phone }}</label>
                  <input
                    :id="fieldMeta.phone.inputId"
                    v-model="form.phone"
                    type="tel"
                    class="tw:form-control"
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
                    class="tw:text-dm-text-muted tw:block tw:mt-1 tw:text-xs"
                  >Completá e-mail o teléfono (al menos uno).</small>
                  <small
                    v-if="fieldErrors.phone"
                    :id="fieldMeta.phone.errorId"
                    class="tw:text-red-500 tw:block tw:mt-1"
                  >{{ fieldErrors.phone }}</small>
                </div>
                <div v-if="isLeadChannel" class="tw:col-span-1 tw:md:col-span-2">
                  <label class="tw:form-label" :for="fieldMeta.geographicLocation.inputId">{{
                    contact.labels.geographicLocation
                  }}</label>
                  <input
                    :id="fieldMeta.geographicLocation.inputId"
                    v-model="form.geographicLocation"
                    type="text"
                    class="tw:form-control"
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
                    class="tw:text-red-500 tw:mt-1 tw:block"
                  >{{ fieldErrors.geographicLocation }}</small>
                </div>
                <div class="tw:col-span-1 tw:md:col-span-2">
                  <label class="tw:form-label" :for="fieldMeta.comment.inputId">{{
                    contact.labels.comment ?? contact.labels.message
                  }}</label>
                  <textarea
                    :id="fieldMeta.comment.inputId"
                    v-model="form.comment"
                    class="tw:form-control"
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
                    class="tw:text-red-500 tw:mt-1 tw:block"
                  >{{ fieldErrors.comment }}</small>
                </div>
                <div class="tw:col-span-1 tw:md:col-span-2 tw:mt-4">
                  <button
                    type="submit"
                    class="tw:btn-primary tw:w-full c-contact__submit"
                    :class="!isChannelEnabled ? 'tw:opacity-50 tw:cursor-not-allowed' : ''"
                    :disabled="!isChannelEnabled || isSubmitting"
                    :aria-disabled="!isChannelEnabled || isSubmitting"
                    :aria-busy="isSubmitting"
                  >
                    <span v-if="isSubmitting" class="tw:flex tw:items-center tw:justify-center tw:gap-2">
                      Enviando...
                      <span class="tw:animate-spin tw:h-4 tw:w-4 tw:border-2 tw:border-white tw:border-t-transparent tw:rounded-full"></span>
                    </span>
                    <span v-else>
                      {{ contact.submitLabel }}
                    </span>
                  </button>
                </div>
                <div class="tw:col-span-1 tw:md:col-span-2" aria-live="polite" aria-atomic="true">
                  <p
                    v-if="isCheckingBackend"
                    class="tw:text-blue-400 tw:bg-blue-900/40 tw:border tw:border-blue-800 tw:rounded-xl tw:px-4 tw:py-3 tw:text-sm"
                    role="status"
                  >
                    {{ contact.checkingMessage }}
                  </p>
                  <p
                    v-else-if="!isBackendAvailable"
                    class="tw:text-orange-400 tw:bg-orange-900/40 tw:border tw:border-orange-800 tw:rounded-xl tw:px-4 tw:py-3 tw:text-sm c-contact__alert"
                    role="status"
                  >
                    {{ contact.unavailableMessage }}
                  </p>
                  <p
                    v-if="feedback.message"
                    ref="feedbackMessageRef"
                    :class="['tw:mt-4', 'tw:px-4', 'tw:py-3', 'tw:rounded-xl', 'tw:border', feedback.success ? 'tw:text-green-400 tw:bg-green-900/40 tw:border-green-800' : 'tw:text-red-400 tw:bg-red-900/40 tw:border-red-800']"
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
