<!--
Path: src/components/WhatsappFab.vue
-->

<template>
  <div class="position-fixed bottom-0 end-0 p-3 z-3">
    <button
      class="btn btn-success rounded-circle shadow-lg whatsapp-track d-flex align-items-center justify-content-center"
      style="width:60px;height:60px;"
      @click="$emit('whatsapp')"
      aria-label="Abrir WhatsApp"
    >
      <i class="bi bi-whatsapp fs-2" aria-hidden="true"></i>
      <span class="visually-hidden">Abrir WhatsApp</span>
    </button>
  </div>
</template>
