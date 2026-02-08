<!--
Path: src/ui/layout/Footer.vue
-->

<template>
  <footer class="section-mobile bg-dark text-light py-3 mt-5" role="contentinfo">
    <div class="container">
      <small>
        © {{ year }} datamaq — {{ footer.note }}
      </small>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { useFooter } from './Footer'

const { footer, year } = useFooter()
</script>
