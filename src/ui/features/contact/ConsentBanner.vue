<!--
Path: src/ui/features/contact/ConsentBanner.vue
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
          <h2 id="consent-banner-title" class="h6 fw-semibold mb-1 text-body">{{ consent.title }}</h2>
          <p class="mb-0 small text-body-secondary">
            {{ consent.description }}
          </p>
        </div>
        <div class="col-12 col-lg-auto d-flex gap-2 justify-content-lg-end consent-banner__actions">
          <button
            type="button"
            class="btn btn-outline-secondary consent-banner__button"
            @click="reject"
            data-testid="consent-reject"
          >
            {{ consent.rejectLabel }}
          </button>
          <button
            type="button"
            class="btn btn-primary consent-banner__button"
            @click="accept"
            data-testid="consent-accept"
          >
            {{ consent.acceptLabel }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { consentManagerKey, type ConsentStatus } from '@/application/services/consentManager'
import { useContent } from '@/ui/composables/useContent'

const manager = inject(consentManagerKey)

if (!manager) {
  throw new Error('ConsentManager no está disponible en el árbol de la aplicación.')
}

const status = ref<ConsentStatus>(manager.getStatus())
let unsubscribe: (() => void) | undefined
const { consent } = useContent()

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

watch(
  visible,
  (isVisible) => {
    document.body.classList.toggle('has-consent-banner', isVisible)
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  document.body.classList.remove('has-consent-banner')
  unsubscribe?.()
})
</script>

<style scoped>
.consent-banner {
  background-color: rgba(248, 249, 250, 0.95);
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  z-index: 1080;
}

.consent-banner__actions {
  flex-wrap: wrap;
}

.consent-banner__button {
  min-height: 2.75rem;
  padding-inline: 1.5rem;
  flex: 1 1 45%;
}

@media (min-width: 992px) {
  .consent-banner {
    width: auto;
    min-width: 60rem;
    border-radius: 0.75rem 0.75rem 0 0;
  }
}

@media (max-width: 991.98px) {
  .consent-banner {
    padding-bottom: max(env(safe-area-inset-bottom, 0px), 0);
  }

  .consent-banner__button {
    flex: 1 1 100%;
  }
}
</style>
