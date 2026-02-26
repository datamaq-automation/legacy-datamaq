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
              @error="onServiceImageError"
            />
          </div>
          <h3 class="h5 fw-semibold text-body-emphasis mb-2 c-services__card-title">{{ card.title }}</h3>
          <p class="text-secondary mb-3 c-services__card-text">
            {{ card.description }}
          </p>
          <section
            class="c-services__scope mb-3"
            :id="detailsId"
            :class="{ 'c-services__scope--collapsed': !detailsExpanded }"
            :aria-label="`${card.subtitle}: detalle del alcance`"
          >
            <h4 class="h6 text-uppercase text-secondary fw-semibold mb-2 c-services__subtitle">
              {{ card.subtitle }}
            </h4>
            <ul class="small mb-3 ps-3 c-services__list">
              <li
                v-for="(item, index) in card.items"
                :key="`${card.id}-item-${index}`"
                class="mb-2 c-services__list-item"
              >
                <span class="text-body-secondary c-services__list-text">{{ item }}</span>
              </li>
            </ul>
            <p v-if="card.note" class="small text-secondary mb-0 c-services__note">
              {{ card.note }}
            </p>
          </section>
          <button
            v-if="isCollapsible"
            type="button"
            class="btn btn-outline-light c-services__details-toggle d-md-none mb-3"
            :aria-expanded="detailsExpanded ? 'true' : 'false'"
            :aria-controls="detailsId"
            @click="toggleDetails"
          >
            {{ detailsExpanded ? 'Ocultar detalle' : 'Ver detalle' }}
          </button>
          <div class="mt-auto c-cta-stack c-services__cta">
            <div class="c-cta-stack__item">
              <button
                type="button"
                class="btn c-ui-btn c-ui-btn--outline w-100 c-services__cta-button"
                @click="handleWhatsAppClick(card.cta.href, card.cta.section)"
              >
                {{ card.cta.label }}
              </button>
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
import { computed, ref } from 'vue'
import type { ServiceCardContent } from '@/domain/types/content'
import { handleImageLoadError } from '@/ui/utils/imageDebug'

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
const detailsExpanded = ref(false)
const showChips = computed(() => props.card.id === 'instalacion')
const isCollapsible = computed(() => props.card.items.length > 2 || Boolean(props.card.note))
const detailsId = computed(() => `service-card-details-${props.card.id}`)

function handleWhatsAppClick(href: string, section: string) {
  // Abrir directamente sin emit para evitar openWhatsApp fallback
  window.open(href, '_blank')
}

function toggleDetails() {
  detailsExpanded.value = !detailsExpanded.value
}

function onServiceImageError(event: Event) {
  handleImageLoadError(event, `ServiceCard:${props.card.id}`)
}
</script>
