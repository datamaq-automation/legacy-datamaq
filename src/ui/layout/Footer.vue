<!--
Path: src/ui/layout/Footer.vue
-->

<template>
  <footer class="section-mobile bg-dark text-light py-3 mt-5" role="contentinfo">
    <div class="container">
      <small>
        © {{ year }} profebustos — {{ footer.note }}
      </small>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useContent } from '@/ui/composables/useContent'

const { footer } = useContent()
const year = computed(() => new Date().getFullYear())
</script>
