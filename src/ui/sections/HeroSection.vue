<!--
Path: src/ui/sections/HeroSection.vue
-->

<template>
  <section class="section-mobile py-5 bg-body-tertiary text-body" aria-labelledby="hero-title">
    <div class="container py-4">
      <div class="row align-items-center gy-5">
        <div class="col-lg-6 order-2 order-lg-1 text-center text-lg-start">
          <div
            class="d-inline-flex align-items-center gap-2 rounded-pill px-3 py-1 bg-success-subtle text-success-emphasis fw-semibold text-uppercase small"
          >
            {{ hero.badge }}
          </div>
          <h1 id="hero-title" class="display-5 fw-bold text-body-emphasis mt-3 mb-3">
            {{ hero.title }}
          </h1>
          <p class="fs-5 text-secondary mb-4">
            {{ hero.subtitle }}
          </p>
          <div
            class="d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center align-items-lg-start mb-4 hero-primary-actions hero-cta-stack"
          >
            <div class="hero-cta-stack__item">
              <button
                type="button"
                class="btn btn-primary btn-lg px-4 fw-semibold shadow-sm primary-whatsapp-cta w-100"
                :disabled="!chatEnabled"
                :aria-disabled="!chatEnabled"
                :aria-describedby="!chatEnabled ? 'hero-chat-disabled' : undefined"
                @click="emit('primary-cta')"
              >
                {{ chatEnabled ? hero.primaryCta.label : hero.chatUnavailableMessage }}
              </button>
            </div>
            <div class="hero-cta-stack__item">
              <a
                class="btn btn-outline-secondary btn-lg px-4 hero-secondary-cta w-100"
                :href="hero.secondaryCta.href"
              >
                {{ hero.secondaryCta.label }}
              </a>
            </div>
          </div>
          <p class="text-secondary small mb-2">
            {{ hero.responseNote }}
          </p>
          <p
            v-if="!chatEnabled"
            id="hero-chat-disabled"
            class="text-warning-emphasis bg-warning-subtle border border-warning-subtle rounded-3 px-3 py-2 small"
          >
            {{ hero.chatUnavailableMessage }}
          </p>
          <ul class="row list-unstyled gy-3 text-start hero-benefits" aria-label="Beneficios">
            <li class="col-12 col-sm-6">
              <div class="hero-benefit-card hero-benefit-card--success h-100">
                <span class="hero-benefit-card__badge">1</span>
                <div>
                  <p class="hero-benefit-card__title">{{ benefit1.title }}</p>
                  <p class="hero-benefit-card__text">{{ benefit1.text }}</p>
                </div>
              </div>
            </li>
            <li class="col-12 col-sm-6">
              <div class="hero-benefit-card hero-benefit-card--primary h-100">
                <span class="hero-benefit-card__badge">2</span>
                <div>
                  <p class="hero-benefit-card__title">{{ benefit2.title }}</p>
                  <p class="hero-benefit-card__text">{{ benefit2.text }}</p>
                </div>
              </div>
            </li>
            <li class="col-12">
              <div class="hero-benefit-card hero-benefit-card--warning h-100">
                <span class="hero-benefit-card__badge">3</span>
                <div>
                  <p class="hero-benefit-card__title">{{ benefit3.title }}</p>
                  <p class="hero-benefit-card__text">{{ benefit3.text }}</p>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div class="col-lg-6 order-1 order-lg-2 text-center">
          <div class="position-relative mx-auto hero-illustration">
            <div
              class="bg-primary rounded-circle position-absolute top-50 start-50 translate-middle"
              style="width: 320px; height: 320px; opacity: 0.25;"
            ></div>
            <picture class="d-inline-block position-relative">
              <img
                :src="hero.image.src"
                :alt="hero.image.alt"
                class="img-fluid rounded-4 shadow-lg"
                :width="hero.image.width"
                :height="hero.image.height"
                fetchpriority="high"
                decoding="async"
              />
            </picture>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { HeroSectionEmits, HeroSectionProps } from '@/ui/types/sections'
import { useHeroSection } from './HeroSection'

const props = defineProps<HeroSectionProps>()
const emit = defineEmits<HeroSectionEmits>()

const { chatEnabled, hero, benefit1, benefit2, benefit3 } = useHeroSection(props)

defineOptions({
  name: 'HeroSection'
})
</script>

<style scoped>
.hero-illustration {
  max-width: 420px;
}

.hero-primary-actions :deep(.btn) {
  min-height: 3.25rem;
}

@media (max-width: 575.98px) {
  .hero-primary-actions {
    align-items: stretch !important;
  }

  .hero-secondary-cta {
    font-size: 1rem;
    line-height: 1.5;
    padding-block: 0.75rem;
    border-width: 1px;
  }

  .primary-whatsapp-cta {
    font-size: 1.05rem;
    line-height: 1.55;
  }

  .hero-benefits {
    row-gap: 1.5rem !important;
  }
}
</style>

