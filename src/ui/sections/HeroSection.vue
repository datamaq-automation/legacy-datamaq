<!--
Path: src/ui/sections/HeroSection.vue
-->

<template>
  <section class="section-mobile py-5 text-body c-hero" aria-labelledby="hero-title">
    <div class="container py-4">
      <div class="row align-items-center gy-4 gy-lg-5">
        <div class="col-lg-6 order-1 order-lg-1 text-center text-lg-start c-hero__content">
          <div
            class="c-ui-chip c-ui-chip--success text-uppercase"
          >
            {{ hero.badge }}
          </div>
          <h1 id="hero-title" class="display-5 fw-bold text-body-emphasis mt-3 mb-3">
            {{ hero.title }}
          </h1>
          <p class="fs-5 text-secondary mb-4 c-hero__subtitle">
            {{ hero.subtitle }}
          </p>
          <div
            class="d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center align-items-lg-start mb-4 c-hero__actions c-cta-stack"
          >
            <div class="c-cta-stack__item">
              <a
                class="btn c-ui-btn c-ui-btn--primary btn-lg px-4 c-hero__primary-cta w-100"
                :href="hero.primaryCta.href"
                target="_blank"
                rel="noopener noreferrer"
                @click.prevent="emit('primary-cta', hero.primaryCta.href)"
              >
                {{ hero.primaryCta.label }}
              </a>
            </div>
            <div class="c-cta-stack__item">
              <a
                class="btn c-ui-btn c-ui-btn--outline btn-lg px-4 c-hero__secondary-cta w-100"
                :href="hero.secondaryCta.href"
              >
                {{ hero.secondaryCta.label }}
              </a>
            </div>
          </div>
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
          <p class="text-secondary small mb-2 c-hero__response-note">
            {{ hero.responseNote }}
          </p>
          <ul class="row list-unstyled gy-3 text-start c-hero__benefits" aria-label="Beneficios">
            <li class="col-12 col-sm-6">
              <div class="c-hero__benefit-card c-hero__benefit-card--success h-100">
                <span class="c-hero__benefit-badge">1</span>
                <div>
                  <p class="c-hero__benefit-title">{{ benefit1.title }}</p>
                  <p class="c-hero__benefit-text">{{ benefit1.text }}</p>
                </div>
              </div>
            </li>
            <li class="col-12 col-sm-6">
              <div class="c-hero__benefit-card c-hero__benefit-card--primary h-100">
                <span class="c-hero__benefit-badge">2</span>
                <div>
                  <p class="c-hero__benefit-title">{{ benefit2.title }}</p>
                  <p class="c-hero__benefit-text">{{ benefit2.text }}</p>
                </div>
              </div>
            </li>
            <li class="col-12">
              <div class="c-hero__benefit-card c-hero__benefit-card--warning h-100">
                <span class="c-hero__benefit-badge">3</span>
                <div>
                  <p class="c-hero__benefit-title">{{ benefit3.title }}</p>
                  <p class="c-hero__benefit-text">{{ benefit3.text }}</p>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div class="col-lg-6 order-2 order-lg-2 text-center c-hero__media">
          <div class="position-relative mx-auto c-hero__illustration">
            <div
              class="bg-primary rounded-circle position-absolute opacity-25 c-hero__halo"
              aria-hidden="true"
            ></div>
            <picture class="d-inline-block position-relative">
              <img
                :src="hero.image.src"
                :alt="hero.image.alt"
                class="img-fluid rounded-4 shadow-lg c-hero__image"
                :width="hero.image.width"
                :height="hero.image.height"
                fetchpriority="high"
                loading="eager"
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

const { hero, benefit1, benefit2, benefit3, heroChips } = useHeroSection(props)

defineOptions({
  name: 'HeroSection'
})
</script>
