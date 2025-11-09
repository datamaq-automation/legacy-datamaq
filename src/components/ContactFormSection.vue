<template>
  <section id="contacto" class="py-5 bg-dark text-white" aria-labelledby="contacto-title">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div class="card border-0 shadow-lg bg-body text-body">
            <div class="card-body p-4 p-md-5">
              <h2 id="contacto-title" class="h3 fw-bold text-body-emphasis mb-3">
                Preferís coordinar por correo electrónico
              </h2>
              <p class="text-secondary mb-4">
                Completá el formulario y se abrirá tu cliente de correo predeterminado para enviar la consulta a
                <a
                  v-if="contactEmail"
                  class="link-secondary fw-semibold"
                  :href="`mailto:${contactEmail}`"
                >{{ contactEmail }}</a>.
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
                  <label class="form-label" for="contacto-mensaje">Mensaje</label>
                  <textarea
                    id="contacto-mensaje"
                    v-model="form.message"
                    class="form-control"
                    name="message"
                    rows="4"
                    required
                    maxlength="1200"
                    :disabled="!isChannelEnabled"
                  ></textarea>
                </div>
                <div class="col-12">
                  <button
                    type="submit"
                    class="btn btn-primary w-100"
                    :disabled="!isChannelEnabled"
                    :aria-disabled="!isChannelEnabled"
                  >
                    Enviar consulta por correo
                  </button>
                </div>
                <p
                  v-if="!isChannelEnabled"
                  class="text-warning-emphasis bg-warning-subtle border border-warning-subtle rounded-3 px-3 py-2 small"
                >
                  El canal de correo electrónico no se encuentra disponible en este momento. Por favor, intentá nuevamente más
                  tarde.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import type { EmailContactPayload } from '@/application/services/emailChannelService'

const props = defineProps<{ contactEmail?: string }>()

const emit = defineEmits<{
  (e: 'submit', payload: EmailContactPayload): void
}>()

const formRef = ref<HTMLFormElement | null>(null)

const form = reactive({
  name: '',
  email: '',
  company: '',
  message: ''
})

const isChannelEnabled = computed(() => Boolean(props.contactEmail))

function resetForm(): void {
  form.name = ''
  form.email = ''
  form.company = ''
  form.message = ''
}

function handleSubmit(): void {
  const formElement = formRef.value

  if (!isChannelEnabled.value) {
    return
  }

  if (formElement && !formElement.reportValidity()) {
    return
  }

  emit('submit', {
    name: form.name,
    email: form.email,
    company: form.company,
    message: form.message
  })

  if (formElement) {
    formElement.reset()
  }

  resetForm()
}

const contactEmail = computed(() => props.contactEmail)
</script>
