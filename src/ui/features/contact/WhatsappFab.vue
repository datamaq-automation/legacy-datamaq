<!--
Path: src/ui/features/contact/WhatsappFab.vue
-->

<template>
  <div class="position-fixed bottom-0 end-0 p-3 z-3 whatsapp-fab">
    <button
      class="btn btn-success rounded-circle shadow-lg whatsapp-track d-flex align-items-center justify-content-center"
      style="width:60px;height:60px;"
      type="button"
      @click="emit('whatsapp')"
      :aria-label="whatsappFab.ariaLabel"
    >
      <i class="bi bi-whatsapp fs-2" aria-hidden="true"></i>
      <span class="visually-hidden">{{ whatsappFab.ariaLabel }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import type { WhatsappFabEmits } from '@/ui/types/sections'
import { useWhatsappFab } from './WhatsappFab'

const emit = defineEmits<WhatsappFabEmits>()
const { whatsappFab } = useWhatsappFab()

defineOptions({
  name: 'WhatsappFab'
})
</script>
