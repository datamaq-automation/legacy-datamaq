<!--
Path: src/ui/sections/SobreProfeBustos.vue
-->

<template>
  <section class="sobre-section section-mobile py-5 border border-white rounded" aria-labelledby="sobre-title">
    <div class="container">
      <div class="row align-items-center">
        <div class="col-md-4 text-center mb-4 mb-md-0">
          <img
            :src="about.image.src"
            :alt="about.image.alt"
            class="img-fluid rounded shadow"
            :width="about.image.width"
            :height="about.image.height"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div class="col-md-8">
          <h2 id="sobre-title" class="mb-3 accent-title">{{ about.title }}</h2>
          <p class="sobre-text">
            {{ about.paragraphs[0] }}
          </p>
          <p class="sobre-text">
            {{ about.paragraphs[1] }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useContent } from '@/ui/composables/useContent'

const { about } = useContent()

defineOptions({
  name: 'SobreProfeBustos'
})
</script>

<style scoped>
.sobre-section {
  background: rgba(12, 18, 30, 0.92);
}

.sobre-text {
  color: var(--bs-secondary-color);
  line-height: 1.7;
  max-width: 60ch;
}

@media (max-width: 767.98px) {
  .sobre-section {
    border-radius: 1.25rem;
    padding-inline: 1.25rem;
  }

  .sobre-text {
    font-size: 1.05rem;
    line-height: 1.75;
  }
}
</style>
