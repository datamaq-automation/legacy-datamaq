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
  </div>
</template>
