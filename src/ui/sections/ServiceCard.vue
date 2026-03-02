<!--
Path: src/ui/sections/ServiceCard.vue
-->

<template>
  <div class="tw:h-full tw:bg-transparent tw:border-0 c-services__card">
    <div class="tw:p-0">
      <article class="c-ui-card c-ui-card--interactive tw:h-full c-services__panel">
        <div class="tw:p-4 tw:flex tw:flex-col tw:h-full c-services__panel-body">
          <div class="tw:text-center">
            <img
              :src="card.media.src"
              :alt="card.media.alt"
              class="tw:max-w-full tw:h-auto tw:mb-3 c-services__media c-services__media-image"
              :width="card.media.width"
              :height="card.media.height"
              loading="lazy"
              decoding="async"
              @error="onServiceImageError"
            />
          </div>
          <h3 class="tw:text-lg tw:font-semibold tw:text-dm-text-0 tw:mb-2 c-services__card-title">{{ card.title }}</h3>
          <p class="tw:text-dm-text-muted tw:mb-3 c-services__card-text">
            {{ card.description }}
          </p>
          <section
            class="c-services__scope tw:mb-3"
            :id="detailsId"
            :class="{ 'c-services__scope--collapsed': !detailsExpanded }"
            :aria-label="`${card.subtitle}: detalle del alcance`"
          >
            <h4 class="tw:text-sm tw:uppercase tw:text-dm-text-muted tw:font-semibold tw:mb-2 c-services__subtitle">
              {{ card.subtitle }}
            </h4>
            <ul class="tw:text-sm tw:mb-3 tw:pl-3 c-services__list">
              <li
                v-for="(item, index) in card.items"
                :key="`${card.id}-item-${index}`"
                class="tw:mb-2 c-services__list-item"
              >
                <span class="tw:text-dm-text-muted c-services__list-text">{{ item }}</span>
              </li>
            </ul>
            <p v-if="card.note" class="tw:text-sm tw:text-dm-text-muted tw:mb-0 c-services__note">
              {{ card.note }}
            </p>
          </section>
          <button
            v-if="isCollapsible"
            type="button"
            class="tw:btn-outline tw:md:hidden tw:mb-3 c-services__details-toggle"
            :aria-expanded="detailsExpanded ? 'true' : 'false'"
            :aria-controls="detailsId"
            @click="toggleDetails"
          >
            {{ detailsExpanded ? 'Ocultar detalle' : 'Ver detalle' }}
          </button>
          <div class="tw:mt-auto c-cta-stack c-services__cta">
            <div class="c-cta-stack__item">
              <button
                type="button"
                class="tw:btn-outline tw:w-full c-services__cta-button"
                @click="handleWhatsAppClick(card.cta.href ?? '', card.cta.section ?? '')"
              >
                {{ card.cta.label }}
              </button>
            </div>
          </div>
          <ul
            v-if="showChips"
            class="tw:list-none tw:flex tw:flex-wrap tw:gap-2 tw:mt-3 tw:mb-0 c-services__chips"
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
