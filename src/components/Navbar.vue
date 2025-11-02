<!--
Path: src/components/Navbar.vue
-->

<template>
  <div class="bg-warning text-dark text-center py-1 small" role="status" aria-live="polite">
    Aviso: Este sitio corresponde al proyecto <strong>DataMaq</strong>. El dominio <strong>profebustos.com.ar</strong> es temporal hasta la adquisición de <strong>datamaq.com.ar</strong>.
  </div>
  <header class="navbar navbar-expand-lg navbar-dark bg-dark sticky-top border-bottom" role="banner">
    <div class="container-fluid px-3">
      <a class="navbar-brand fw-bold" href="#" aria-label="datamaq, inicio">datamaq</a>
      <ul class="navbar-nav ms-auto">
        <li class="nav-item"><a class="nav-link" href="#servicios">Servicios</a></li>
        <li class="nav-item" v-if="chatEnabled">
          <a class="nav-link" :href="chatUrl" target="_blank" rel="noopener">Conversar con el bot</a>
        </li>
      </ul>
    </div>
  </header>
</template>

<script setup lang="ts">
defineProps<{
  chatEnabled: boolean
  chatUrl: string
}>()
</script>
