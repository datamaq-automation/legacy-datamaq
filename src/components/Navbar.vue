<!--
Path: src/components/Navbar.vue
-->

<template>
  <header class="navbar navbar-expand-lg navbar-dark bg-dark sticky-top border-bottom" role="banner">
    <div class="container-fluid px-3">
      <a class="navbar-brand fw-bold" href="#" aria-label="profebustos, inicio">profebustos</a>
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
