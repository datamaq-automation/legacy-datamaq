<!--
Path: src/components/ContactFormSection.vue
-->
<template>
  <section id="contacto" class="section-mobile py-5 bg-dark text-white" aria-labelledby="contacto-title">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div class="card border-0 shadow-lg bg-body text-body">
            <div class="card-body p-4 p-md-5">
              <h2 id="contacto-title" class="h3 correo-title mb-3">
                Preferís coordinar por correo electrónico
              </h2>
              <p class="text-body mb-4">
                Completá el formulario y recibirás una respuesta a tu correo electrónico
              </p>
              <form
                ref="formRef"
                class="row g-3"
                novalidate
                @submit.prevent="handleSubmit"
              >
                <div class="col-12">
                  <label class="form-label" for="contacto-nombre">Nombre y apellido</label>
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
                  <label class="form-label" for="contacto-email">Correo electrónico</label>
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
                  <label class="form-label" for="contacto-empresa">Empresa (opcional)</label>
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
                  <label class="form-label" for="contacto-mensaje">Mensaje (opcional)</label>
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
                      {{ CTA_COPY.EMAIL_SUBMIT }}
                    </span>
                  </button>
                </div>
                <div class="col-12" aria-live="polite" aria-atomic="true">
                  <p
                    v-if="isCheckingBackend"
                    class="text-info-emphasis bg-info-subtle border border-info-subtle rounded-3 px-3 py-2 small"
                  >
                    Verificando la disponibilidad del servicio de correo electrónico…
                  </p>
                  <p
                    v-else-if="!isBackendAvailable"
                    class="text-warning-emphasis bg-warning-subtle border border-warning-subtle rounded-3 px-3 py-2 small contact-alert"
                  >
                    El canal de correo electrónico está en mantenimiento. Nuestro canal principal es WhatsApp: agendá tu
                    diagnóstico allí y retomá este formulario más tarde si necesitás documentación.
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
import { CTA_COPY } from '@/application/constants/ctaCopy'
import { useContactForm } from './contactHooks'
import type { ContactFormProps } from './contactTypes'

const props = defineProps<ContactFormProps>()

const {
  formRef,
  form,
  isBackendAvailable,
  isCheckingBackend,
  isChannelEnabled,
  isSubmitting,
  feedback,
  feedbackMessageRef,
  handleSubmit
} = useContactForm(props)
</script>

<style scoped>
.email-submit-cta {
  min-height: 3.25rem;
  letter-spacing: 0.01em;
}

.disabled-channel {
  color: rgba(248, 249, 250, 0.7);
  border-color: rgba(248, 249, 250, 0.35);
  background-color: rgba(255, 255, 255, 0.02);
}

.contact-alert {
  line-height: 1.6;
}

@media (max-width: 767.98px) {
  .email-submit-cta {
    padding-block: 0.85rem;
    font-size: 1.02rem;
  }

  .contact-alert {
    margin-top: 0.5rem;
  }
}
</style>
