<script setup lang="ts">
import type { ContactFieldErrors, ContactFormFieldMetaMap } from './contactTypes'
import type { ContactFormPayload } from '@/application/dto/contact'

defineProps<{
  form: ContactFormPayload
  fieldErrors: ContactFieldErrors
  fieldMeta: ContactFormFieldMetaMap
  isChannelEnabled: boolean
}>()
</script>

<template>
  <div class="c-contact__step-panel">
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
  </div>
</template>
