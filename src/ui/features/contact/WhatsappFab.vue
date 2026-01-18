<!--
Path: src/components/WhatsappFab.vue
-->

<template>
  <div class="position-fixed bottom-0 end-0 p-3 z-3 whatsapp-fab">
    <button
      class="btn btn-success rounded-circle shadow-lg whatsapp-track d-flex align-items-center justify-content-center"
      style="width:60px;height:60px;"
      type="button"
      @click="emit('whatsapp')"
      :aria-label="CTA_COPY.FAB_ARIA_LABEL"
    >
      <i class="bi bi-whatsapp fs-2" aria-hidden="true"></i>
      <span class="visually-hidden">{{ CTA_COPY.FAB_ARIA_LABEL }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { CTA_COPY } from '@/application/constants/ctaCopy'

const emit = defineEmits<{ (e: 'whatsapp'): void }>()

defineOptions({
  name: 'WhatsappFab'
})
</script>
