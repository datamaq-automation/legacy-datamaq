<!--
Path: src/ui/layout/Footer.vue
-->

<template>
  <footer class="section-mobile bg-dark text-light py-3 mt-5" role="contentinfo">
    <div class="container">
      <div class="d-flex flex-column flex-lg-row gap-3 align-items-lg-center justify-content-between">
        <small>
          © {{ year }} {{ brand }} — {{ footer.note }}
        </small>
        <button
          v-if="contactCtaEnabled"
          type="button"
          class="btn c-ui-btn c-ui-btn--primary"
          @click="emit('contact')"
        >
          {{ contactLabel }}
        </button>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import type { FooterEmits, FooterProps } from '@/ui/types/layout'
import { useFooter } from './Footer'

defineProps<FooterProps>()
const emit = defineEmits<FooterEmits>()
const { footer, contactLabel, brand, year } = useFooter()
</script>
