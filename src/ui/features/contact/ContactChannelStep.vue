<script setup lang="ts">
import type { ContactFieldErrors, ContactFormFieldMetaMap } from './contactTypes'
import type { ContactFormPayload } from '@/application/dto/contact'

const props = defineProps<{
  form: ContactFormPayload
  fieldErrors: ContactFieldErrors
  fieldMeta: ContactFormFieldMetaMap
  isChannelEnabled: boolean
  preferredContact: 'whatsapp' | 'email'
}>()

const emit = defineEmits<{
  (event: 'update:preferredContact', value: 'whatsapp' | 'email'): void
}>()

function updatePreferredContact(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.value === 'whatsapp' || target.value === 'email') {
    emit('update:preferredContact', target.value)
  }
}
</script>

<template>
  <div class="c-contact__step-panel">
    <h3 class="c-contact__step-title">3. Medio de contacto preferido</h3>
    <fieldset class="c-contact__choice-group">
      <legend class="c-contact__label">Eleg&iacute; c&oacute;mo quer&eacute;s que te contactemos</legend>
      <label class="c-contact__choice" :class="{ 'is-active': props.preferredContact === 'whatsapp' }">
        <input
          :checked="props.preferredContact === 'whatsapp'"
          type="radio"
          value="whatsapp"
          name="preferredContact"
          @change="updatePreferredContact"
        />
        WhatsApp
      </label>
      <label class="c-contact__choice" :class="{ 'is-active': props.preferredContact === 'email' }">
        <input
          :checked="props.preferredContact === 'email'"
          type="radio"
          value="email"
          name="preferredContact"
          @change="updatePreferredContact"
        />
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
        :aria-required="props.preferredContact === 'whatsapp'"
        :aria-invalid="Boolean(fieldErrors.phone)"
      />
      <small class="c-contact__helper">
        {{ props.preferredContact === 'whatsapp' ? 'Obligatorio en esta opcion.' : 'Opcional.' }}
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
        :aria-required="props.preferredContact === 'email'"
        :aria-invalid="Boolean(fieldErrors.email)"
      />
      <small class="c-contact__helper">
        {{ props.preferredContact === 'email' ? 'Obligatorio en esta opcion.' : 'Opcional.' }}
      </small>
      <small v-if="fieldErrors.email" class="c-contact__error">{{ fieldErrors.email }}</small>
    </div>
  </div>
</template>
