<!--
Path: src/components/ConsentBanner.vue
-->
<template>
  <div
    v-if="visible"
    class="consent-banner position-fixed bottom-0 start-50 translate-middle-x w-100 shadow-lg"
    role="dialog"
    aria-modal="true"
    aria-labelledby="consent-banner-title"
  >
    <div class="container py-3">
      <div class="row align-items-center g-3">
        <div class="col-12 col-lg">
          <h2 id="consent-banner-title" class="h6 fw-semibold mb-1 text-body">Usamos cookies para analítica</h2>
          <p class="mb-0 small text-body-secondary">
            Aceptá para habilitar Google Analytics 4 y Microsoft Clarity. Podés revisar los detalles en la sección legal del
            sitio.
          </p>
        </div>
        <div class="col-12 col-lg-auto d-flex gap-2 justify-content-lg-end">
          <button type="button" class="btn btn-outline-secondary btn-sm" @click="reject" data-testid="consent-reject">
            Rechazar
          </button>
          <button type="button" class="btn btn-primary btn-sm" @click="accept" data-testid="consent-accept">
            Aceptar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, ref } from 'vue'
import { consentManagerKey, type ConsentStatus } from '@/application/services/consentManager'

const manager = inject(consentManagerKey)

if (!manager) {
  throw new Error('ConsentManager no está disponible en el árbol de la aplicación.')
}

const status = ref<ConsentStatus>(manager.getStatus())
let unsubscribe: (() => void) | undefined

const visible = computed(() => status.value === 'unknown')

function accept(): void {
  manager.grant()
}

function reject(): void {
  manager.deny()
}

onMounted(() => {
  unsubscribe = manager.subscribe((newStatus) => {
    status.value = newStatus
  })
})

onBeforeUnmount(() => {
  unsubscribe?.()
})
</script>

<style scoped>
.consent-banner {
  background-color: rgba(248, 249, 250, 0.95);
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  z-index: 1080;
}

@media (min-width: 992px) {
  .consent-banner {
    width: auto;
    min-width: 60rem;
    border-radius: 0.75rem 0.75rem 0 0;
  }
}
</style>
