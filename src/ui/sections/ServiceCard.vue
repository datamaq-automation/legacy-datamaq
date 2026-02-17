<!--
Path: src/ui/sections/ServiceCard.vue
-->

<template>
  <div class="card h-100 bg-transparent border-0 c-services__card">
    <div class="card-body p-0">
      <article class="c-ui-card c-ui-card--interactive h-100 c-services__panel">
        <div class="p-4 d-flex flex-column h-100 c-services__panel-body">
          <div class="text-center">
            <img
              :src="card.media.src"
              :alt="card.media.alt"
              class="img-fluid mb-3 c-services__media c-services__media-image"
              :width="card.media.width"
              :height="card.media.height"
              loading="lazy"
              decoding="async"
            />
          </div>
          <h3 class="h5 fw-semibold text-body-emphasis mb-2 c-services__card-title">{{ card.title }}</h3>
          <p class="text-secondary mb-3 c-services__card-text">
            {{ card.description }}
          </p>
          <h4 class="h6 text-uppercase text-secondary fw-semibold mb-2 c-services__subtitle">{{ card.subtitle }}</h4>
          <ul class="small mb-3 ps-3 c-services__list">
            <li v-for="(item, index) in card.items" :key="`${card.id}-item-${index}`" class="mb-2 c-services__list-item">
              <span class="text-body-secondary c-services__list-text">{{ item }}</span>
            </li>
          </ul>
          <p v-if="card.note" class="small text-secondary mb-3 c-services__note">
            {{ card.note }}
          </p>
          <div class="mt-auto c-cta-stack c-services__cta">
            <div class="c-cta-stack__item">
              <a
                class="btn c-ui-btn c-ui-btn--outline w-100 c-services__cta-button"
                :href="card.cta.href"
                target="_blank"
                rel="noopener noreferrer"
                @click.prevent="emit('contact', { section: card.cta.section, href: card.cta.href })"
              >
                {{ card.cta.label }}
              </a>
            </div>
          </div>
          <ul
            v-if="showChips"
            class="list-unstyled d-flex flex-wrap gap-2 mt-3 mb-0 c-services__chips"
            aria-label="Condiciones operativas"
          >
            <li v-for="chip in installationChips" :key="chip">
              <span class="c-ui-chip">
                {{ chip }}
              </span>
            </li>
          </ul>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ServiceCardContent } from '@/domain/types/content'

const props = defineProps<{
  card: ServiceCardContent
}>()

const emit = defineEmits<{
  (event: 'contact', payload: { section: string; href?: string }): void
}>()

const installationChips = [
  'Industria',
  'GBA Norte prioritario',
  'Equipo provisto por el cliente',
  'Instalacion tipica ~4h'
]
const showChips = computed(() => props.card.id === 'instalacion')
</script>

