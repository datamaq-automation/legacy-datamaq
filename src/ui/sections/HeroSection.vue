<!--
Path: src/ui/sections/HeroSection.vue
-->

<template>
  <section class="section-mobile py-5 text-body c-hero" aria-labelledby="hero-title">
    <div class="container">
      <div class="row align-items-center gy-4">
        <div class="col-12 col-md-6 col-lg-6 order-1 text-center text-lg-start c-hero__content">
          <div class="c-hero__content-panel">
            <div
              class="c-ui-chip c-ui-chip--success text-uppercase d-inline-block mw-100 text-wrap"
            >
              {{ hero.badge }}
            </div>
            <h1 id="hero-title" class="display-5 fw-bold text-body-emphasis mt-3 mb-3 c-hero__title">
              {{ hero.title }}
            </h1>
            <p class="fs-5 text-secondary mb-3 c-hero__subtitle">
              {{ hero.subtitle }}
            </p>
            <div
              class="d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center align-items-lg-start mb-3 c-hero__actions c-cta-stack"
            >
              <div class="c-cta-stack__item">
                <button
                  type="button"
                  class="btn c-ui-btn c-ui-btn--primary btn-lg px-4 c-hero__primary-cta w-100"
                  @click="handleWhatsAppClick(hero.primaryCta.href)"
                >
                  {{ hero.primaryCta.label }}
                </button>
              </div>
              <div class="c-cta-stack__item">
                <a
                  class="btn btn-outline-light btn-lg px-4 c-hero__secondary-cta w-100"
                  :href="servicesAnchorHref"
                  aria-label="Ver servicios y desplazarse a la sección de servicios"
                >
                  {{ hero.secondaryCta.label }}
                </a>
              </div>
            </div>
            <p class="small text-secondary c-hero__microcopy mb-3">
              Sin compromiso · Respuesta en menos de 24 h
            </p>
            <ul
              class="list-unstyled d-flex flex-wrap gap-2 mb-4 c-hero__chips"
              aria-label="Condiciones operativas"
            >
              <li v-for="chip in heroChips" :key="chip">
                <span class="c-ui-chip">
                  {{ chip }}
                </span>
              </li>
            </ul>
            <section class="c-hero__conditions" aria-labelledby="hero-conditions-title">
              <div class="d-flex align-items-center justify-content-between gap-2 mb-2 c-hero__conditions-header">
                <h2 id="hero-conditions-title" class="c-hero__conditions-title h6 mb-0">Condiciones</h2>
                <button
                  type="button"
                  class="btn btn-outline-light c-hero__conditions-toggle"
                  :aria-expanded="conditionsExpanded ? 'true' : 'false'"
                  aria-controls="hero-conditions-list"
                  @click="toggleConditions"
                >
                  {{ conditionsExpanded ? 'Ocultar' : 'Ver' }}
                </button>
              </div>
              <ul
                id="hero-conditions-list"
                class="list-unstyled mb-0 c-hero__conditions-list"
                :class="{ 'c-hero__conditions-list--collapsed': !conditionsExpanded }"
              >
                <li v-for="condition in heroConditions" :key="condition">
                  {{ condition }}
                </li>
              </ul>
            </section>
          </div>
        </div>
        <div class="col-12 col-md-6 col-lg-6 order-2 text-center c-hero__media">
          <div class="position-relative mx-auto c-hero__illustration">
            <div
              class="bg-primary rounded-circle position-absolute c-hero__halo"
              aria-hidden="true"
            ></div>
            <!-- Espacio preparado para reemplazar luego la ilustracion por foto real -->
            <picture class="d-inline-block position-relative c-hero__media-slot">
              <img
                :src="hero.image.src"
                :alt="hero.image.alt"
                class="img-fluid rounded-4 shadow-lg c-hero__image"
                :width="hero.image.width"
                :height="hero.image.height"
                fetchpriority="high"
                loading="eager"
                decoding="async"
                @error="onHeroImageError"
              />
            </picture>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { HeroSectionEmits, HeroSectionProps } from '@/ui/types/sections'
import { useHeroSection } from './HeroSection'
import { handleImageLoadError } from '@/ui/utils/imageDebug'

const props = defineProps<HeroSectionProps>()
const emit = defineEmits<HeroSectionEmits>()

const { hero, heroChips, heroConditions } = useHeroSection(props)
const conditionsExpanded = ref(false)
const servicesAnchorHref = hero.secondaryCta.href.startsWith('#')
  ? hero.secondaryCta.href
  : '#servicios'

defineOptions({
  name: 'HeroSection'
})

function handleWhatsAppClick(href: string) {
  // Abrir directamente sin emit para evitar openWhatsApp fallback
  window.open(href, '_blank')
}

function toggleConditions() {
  conditionsExpanded.value = !conditionsExpanded.value
}

function onHeroImageError(event: Event) {
  handleImageLoadError(event, 'HeroSection')
}
</script>
