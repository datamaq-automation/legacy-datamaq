<!--
Path: src/components/ContactFormSection.vue
-->
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
                Completá el formulario y recibirás una respuesta a tu correo electrónico
                <span v-if="contactEmail" class="fw-semibold">{{ contactEmail }}</span>.
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
                <div class="col-12">
                  <button
                    type="submit"
                    class="btn btn-primary w-100"
                    :disabled="!isChannelEnabled || isSubmitting"
                    :aria-disabled="!isChannelEnabled || isSubmitting"
                  >
                    <span v-if="isSubmitting">
                      Enviando...
                      <span class="spinner-border spinner-border-sm ms-2" role="status" aria-hidden="true"></span>
                    </span>
                    <span v-else>
                      Enviar consulta por correo
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
                    class="text-warning-emphasis bg-warning-subtle border border-warning-subtle rounded-3 px-3 py-2 small"
                  >
                    El canal de correo electrónico no se encuentra disponible en este momento. Por favor, intentá nuevamente
                    más tarde.
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
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import type { EmailContactPayload } from '@/application/services/emailChannelService'
import {
  ensureContactBackendStatus,
  getContactBackendStatus,
  subscribeToContactBackendStatus,
  type ContactBackendStatus
} from '@/application/services/contactBackendStatus'

const props = defineProps<{
  contactEmail?: string,
  onSubmit: (payload: EmailContactPayload) => Promise<{ ok: boolean; error?: string }>
}>()

const formRef = ref<HTMLFormElement | null>(null)
const form = reactive({
  name: '',
  email: '',
  company: '',
  message: ''
})
const backendStatus = ref<ContactBackendStatus>(getContactBackendStatus())
const isBackendAvailable = computed(() => backendStatus.value === 'available')
const isCheckingBackend = computed(() => backendStatus.value === 'unknown')
const isChannelEnabled = computed(() => Boolean(props.contactEmail) && isBackendAvailable.value)
const isSubmitting = ref(false)
const feedback = reactive<{ message: string; success: boolean }>({ message: '', success: false })
const feedbackMessageRef = ref<HTMLParagraphElement | null>(null)
let unsubscribeFromStatus: (() => void) | undefined

function resetForm(): void {
  form.name = ''
  form.email = ''
  form.company = ''
  form.message = ''
}

async function handleSubmit(): Promise<void> {
  const formElement = formRef.value
  feedback.message = ''
  feedback.success = false

  if (!isChannelEnabled.value) {
    return
  }
  if (formElement && !formElement.reportValidity()) {
    return
  }
  isSubmitting.value = true
  try {
    const result = await props.onSubmit({
      name: form.name,
      email: form.email,
      company: form.company,
      message: form.message
    })
    if (import.meta.env.DEV) {
      console.debug('[ContactFormSection] Resultado de onSubmit:', result)
    }
    if (result && result.ok) {
      if (formElement) formElement.reset()
      resetForm()
      await announceFeedback('¡Consulta enviada correctamente! Te responderemos a la brevedad.', true)
    } else {
      await announceFeedback(
        result?.error || 'No se pudo enviar la consulta. Intenta nuevamente más tarde.',
        false
      )
    }
  } catch (e) {
    if (import.meta.env.DEV) {
      console.error('[ContactFormSection] Error inesperado en handleSubmit:', e)
    }
    await announceFeedback('Ocurrió un error inesperado. Intenta nuevamente más tarde.', false)
  } finally {
    isSubmitting.value = false
  }
}

const contactEmail = computed(() => props.contactEmail)

async function announceFeedback(message: string, success: boolean): Promise<void> {
  feedback.message = message
  feedback.success = success
  await nextTick()
  feedbackMessageRef.value?.focus()
}

onMounted(() => {
  unsubscribeFromStatus = subscribeToContactBackendStatus((status) => {
    backendStatus.value = status
  })
  void ensureContactBackendStatus()
})

onBeforeUnmount(() => {
  unsubscribeFromStatus?.()
})
</script>
