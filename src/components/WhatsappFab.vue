<!--
Path: src/components/WhatsappFab.vue
-->

<template>
  <div class="position-fixed bottom-0 end-0 p-3 z-3">
    <button
      class="btn btn-success rounded-circle p-3 shadow-lg w-100 h-100 whatsapp-track"
      style="max-width:60px;max-height:60px;min-width:60px;min-height:60px;"
      @click="$emit('whatsapp')"
      aria-label="Abrir WhatsApp"
    >
      <span aria-hidden="true" class="fs-4">💬</span>
      <span class="visually-hidden">Abrir WhatsApp</span>
    </button>
  </div>
</template>
