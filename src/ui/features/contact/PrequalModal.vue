<!--
Path: src/ui/features/contact/PrequalModal.vue
-->

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="c-prequal-modal position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="prequal-title"
      @click.self="emit('close')"
    >
      <div class="c-prequal-modal__backdrop position-absolute top-0 start-0 w-100 h-100"></div>
      <div
        ref="dialogRef"
        class="c-prequal-modal__dialog position-relative bg-body text-body shadow-lg p-4"
        tabindex="-1"
        @keydown="handleKeydown"
      >
        <div class="d-flex justify-content-between align-items-start gap-3 mb-3">
          <div>
            <h2 id="prequal-title" class="h5 fw-semibold mb-1">Precalificacion rapida</h2>
            <p class="small text-secondary mb-0">
              Completa estos datos para armar el mensaje de WhatsApp.
            </p>
          </div>
          <button
            type="button"
            class="btn btn-sm btn-outline-secondary"
            aria-label="Cerrar precalificacion"
            @click="emit('close')"
          >
            Cerrar
          </button>
        </div>
        <form class="d-grid gap-3" @submit.prevent="handleSubmit">
          <div>
            <label class="form-label" for="prequal-location">Ubicacion</label>
            <input
              id="prequal-location"
              ref="locationInputRef"
              v-model.trim="form.location"
              type="text"
              class="form-control"
              required
              autocomplete="address-level2"
              aria-label="Ubicacion"
            />
          </div>
          <div>
            <label class="form-label" for="prequal-network">Tipo de red</label>
            <select
              id="prequal-network"
              v-model="form.networkType"
              class="form-select"
              required
              aria-label="Tipo de red"
            >
              <option value="" disabled>Selecciona una opcion</option>
              <option value="Monofasica">Monofasica</option>
              <option value="Trifasica">Trifasica</option>
            </select>
          </div>
          <div>
            <label class="form-label" for="prequal-points">Cantidad de puntos de medicion</label>
            <select
              id="prequal-points"
              v-model="form.measurementPoints"
              class="form-select"
              required
              aria-label="Cantidad de puntos de medicion"
            >
              <option value="" disabled>Selecciona una opcion</option>
              <option value="1">1</option>
              <option value="2-3">2-3</option>
              <option value="4+">4+</option>
            </select>
          </div>
          <div>
            <label class="form-label" for="prequal-cut">Se puede cortar energia para intervenir</label>
            <select
              id="prequal-cut"
              v-model="form.canCutPower"
              class="form-select"
              required
              aria-label="Se puede cortar energia para intervenir"
            >
              <option value="" disabled>Selecciona una opcion</option>
              <option value="Si">Si</option>
              <option value="No">No</option>
            </select>
          </div>
          <div>
            <label class="form-label" for="prequal-urgency">Urgencia</label>
            <select
              id="prequal-urgency"
              v-model="form.urgency"
              class="form-select"
              required
              aria-label="Urgencia"
            >
              <option value="" disabled>Selecciona una opcion</option>
              <option value="Hoy">Hoy</option>
              <option value="Esta semana">Esta semana</option>
              <option value="Planificado">Planificado</option>
            </select>
          </div>
          <div class="d-flex flex-column flex-sm-row gap-2 pt-2">
            <button type="submit" class="btn btn-primary w-100">
              Enviar por WhatsApp
            </button>
            <button type="button" class="btn btn-outline-secondary w-100" @click="emit('close')">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, reactive, ref, watch } from 'vue'
import type { PrequalificationPayload } from './prequalification'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  (event: 'close'): void
  (event: 'submit', payload: PrequalificationPayload): void
}>()

type FormState = {
  location: string
  networkType: PrequalificationPayload['networkType'] | ''
  measurementPoints: PrequalificationPayload['measurementPoints'] | ''
  canCutPower: PrequalificationPayload['canCutPower'] | ''
  urgency: PrequalificationPayload['urgency'] | ''
}

const dialogRef = ref<HTMLElement | null>(null)
const locationInputRef = ref<HTMLInputElement | null>(null)
const form = reactive<FormState>({
  location: '',
  networkType: '',
  measurementPoints: '',
  canCutPower: '',
  urgency: ''
})

const focusableSelector =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

const lockScroll = (locked: boolean) => {
  document.body.style.overflow = locked ? 'hidden' : ''
}

watch(
  () => props.open,
  async (open) => {
    if (!open) {
      lockScroll(false)
      return
    }
    form.location = ''
    form.networkType = ''
    form.measurementPoints = ''
    form.canCutPower = ''
    form.urgency = ''
    lockScroll(true)
    await nextTick()
    locationInputRef.value?.focus()
  }
)

onBeforeUnmount(() => {
  lockScroll(false)
})

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    emit('close')
    return
  }

  if (event.key !== 'Tab') {
    return
  }

  const dialog = dialogRef.value
  if (!dialog) {
    return
  }

  const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(focusableSelector)).filter(
    (element) => !element.hasAttribute('disabled')
  )
  if (focusable.length === 0) {
    return
  }

  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

const handleSubmit = () => {
  if (
    !form.location ||
    !form.networkType ||
    !form.measurementPoints ||
    !form.canCutPower ||
    !form.urgency
  ) {
    return
  }

  emit('submit', {
    location: form.location,
    networkType: form.networkType,
    measurementPoints: form.measurementPoints,
    canCutPower: form.canCutPower,
    urgency: form.urgency
  })
}
</script>
