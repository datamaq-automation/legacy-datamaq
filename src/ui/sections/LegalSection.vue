<!--
Path: src/ui/sections/LegalSection.vue
-->

<template>
  <section class="section-mobile bg-dark py-5" aria-label="Nota legal">
    <div class="container">
      <p class="text-light small">
        {{ legal.text }}
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useContent } from '@/ui/composables/useContent'

const { legal } = useContent()
</script>
