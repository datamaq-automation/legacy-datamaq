<!--
Path: src/ui/sections/ServiceCard.vue
-->

<template>
  <div class="card c-ui-card c-ui-card--interactive h-100 border-0 shadow-sm c-services__card">
    <div class="card-body p-4 d-flex flex-column gap-4 c-services__body">
      <div class="d-flex flex-column flex-sm-row gap-3 c-services__header">
        <img
          :src="card.media.src"
          :alt="card.media.alt"
          class="rounded-3 shadow-sm align-self-start c-services__media c-services__media-image"
          :width="card.media.width"
          :height="card.media.height"
          loading="lazy"
          decoding="async"
        />
        <div>
          <h3 class="h4 fw-semibold text-body-emphasis mb-2 c-services__card-title">{{ card.title }}</h3>
          <p class="text-secondary mb-0 c-services__card-text">
            {{ card.description }}
          </p>
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
      </div>
      <h4 class="h6 text-uppercase text-secondary fw-semibold mb-1 c-services__subtitle">{{ card.subtitle }}</h4>
      <ul class="list-unstyled mb-0 c-services__list">
        <li v-for="(item, index) in card.items" :key="`${card.id}-item-${index}`" class="d-flex gap-2 mb-2 c-services__list-item">
          <span class="text-success fw-bold c-services__list-bullet" aria-hidden="true">&bull;</span>
          <span class="text-body-secondary c-services__list-text">{{ item }}</span>
        </li>
      </ul>
      <figure v-if="card.figure" class="text-center mb-4 c-services__figure">
        <img
          :src="card.figure.src"
          :alt="card.figure.alt"
          class="img-fluid rounded-3 shadow-sm mx-auto c-services__figure-image"
          :width="card.figure.width"
          :height="card.figure.height"
          loading="lazy"
          decoding="async"
        />
        <figcaption v-if="card.figure.caption" class="small text-secondary mt-2 c-services__caption">
          {{ card.figure.caption }}
        </figcaption>
      </figure>
      <p v-if="card.note" class="small text-secondary mb-0 c-services__note">
        {{ card.note }}
      </p>
      <div class="c-cta-stack c-services__cta">
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

