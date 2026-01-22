<!--
Path: src/ui/sections/ServiciosSection.vue
-->

<template>
  <section id="servicios" class="section-mobile py-5 bg-body-secondary text-body c-services" aria-labelledby="servicios-title">
    <div class="container">
      <h2 id="servicios-title" class="mb-5 text-center text-body-emphasis c-services__title">{{ services.title }}</h2>
      <div class="row g-4">
        <div class="col-12 col-lg-6">
          <div class="card h-100 border-0 shadow-sm c-services__card">
            <div class="card-body p-4 d-flex flex-column gap-4 c-services__body">
              <div class="d-flex flex-column flex-sm-row gap-3 c-services__header">
                <img
                  :src="primaryCard.media.src"
                  :alt="primaryCard.media.alt"
                  class="rounded-3 shadow-sm align-self-start c-services__media"
                  :width="primaryCard.media.width"
                  :height="primaryCard.media.height"
                  loading="lazy"
                  decoding="async"
                />
                <div>
                  <h3 class="h4 fw-semibold text-body-emphasis mb-2 c-services__card-title">{{ primaryCard.title }}</h3>
                  <p class="text-secondary mb-0 c-services__card-text">
                    {{ primaryCard.description }}
                  </p>
                </div>
              </div>
              <h4 class="h6 text-uppercase text-secondary fw-semibold mb-1 c-services__subtitle">{{ primaryCard.subtitle }}</h4>
              <ul class="list-unstyled mb-0 c-services__list">
                <li class="d-flex gap-2 mb-2 c-services__list-item">
                  <span class="text-success fw-bold c-services__list-bullet">•</span>
                  <span class="text-body-secondary c-services__list-text">{{ primaryCard.items[0] }}</span>
                </li>
                <li class="d-flex gap-2 mb-2 c-services__list-item">
                  <span class="text-success fw-bold c-services__list-bullet">•</span>
                  <span class="text-body-secondary c-services__list-text">{{ primaryCard.items[1] }}</span>
                </li>
                <li class="d-flex gap-2 c-services__list-item">
                  <span class="text-success fw-bold c-services__list-bullet">•</span>
                  <span class="text-body-secondary c-services__list-text">{{ primaryCard.items[2] }}</span>
                </li>
              </ul>
              <figure class="text-center mb-4 c-services__figure">
                <img
                  :src="primaryCard.figure.src"
                  :alt="primaryCard.figure.alt"
                  class="img-fluid rounded-3 shadow-sm mx-auto"
                  :width="primaryCard.figure.width"
                  :height="primaryCard.figure.height"
                  loading="lazy"
                  decoding="async"
                />
                <figcaption class="small text-secondary mt-2 c-services__caption">
                  {{ primaryCard.figure.caption }}
                </figcaption>
              </figure>
              <div class="c-cta-stack c-services__cta">
                <div class="c-cta-stack__item">
                  <button
                    type="button"
                    class="btn btn-outline-primary w-100 c-services__cta-button"
                    :disabled="!chatEnabled"
                    :aria-disabled="!chatEnabled"
                    @click="emit('contact', primaryCard.cta.section)"
                  >
                    {{ chatEnabled ? primaryCard.cta.label : primaryCard.unavailableMessage }}
                  </button>
                </div>
              </div>
              <p
                v-if="!chatEnabled"
                class="text-warning-emphasis bg-warning-subtle border border-warning-subtle rounded-3 px-3 py-2 small mt-3 c-services__alert"
              >
                {{ primaryCard.unavailableMessage }}
              </p>
            </div>
          </div>
        </div>

        <div class="col-12 col-lg-6">
          <div class="card h-100 border-0 shadow-sm c-services__card">
            <div class="card-body p-4 d-flex flex-column gap-4 c-services__body">
              <div class="d-flex flex-column flex-sm-row gap-3 c-services__header">
                <img
                  :src="secondaryCard.media.src"
                  :alt="secondaryCard.media.alt"
                  class="rounded-3 shadow-sm align-self-start c-services__media"
                  :width="secondaryCard.media.width"
                  :height="secondaryCard.media.height"
                  loading="lazy"
                  decoding="async"
                />
                <div>
                  <h3 class="h4 fw-semibold text-body-emphasis mb-2 c-services__card-title">{{ secondaryCard.title }}</h3>
                  <p class="text-secondary mb-0 c-services__card-text">
                    {{ secondaryCard.description }}
                  </p>
                </div>
              </div>
              <h4 class="h6 text-uppercase text-secondary fw-semibold mb-1 c-services__subtitle">{{ secondaryCard.subtitle }}</h4>
              <ul class="list-unstyled mb-0 c-services__list">
                <li class="d-flex gap-2 mb-2 c-services__list-item">
                  <span class="text-success fw-bold c-services__list-bullet">•</span>
                  <span class="text-body-secondary c-services__list-text">{{ secondaryCard.items[0] }}</span>
                </li>
                <li class="d-flex gap-2 mb-2 c-services__list-item">
                  <span class="text-success fw-bold c-services__list-bullet">•</span>
                  <span class="text-body-secondary c-services__list-text">{{ secondaryCard.items[1] }}</span>
                </li>
                <li class="d-flex gap-2 c-services__list-item">
                  <span class="text-success fw-bold c-services__list-bullet">•</span>
                  <span class="text-body-secondary c-services__list-text">{{ secondaryCard.items[2] }}</span>
                </li>
              </ul>
              <p class="small text-secondary mb-0 c-services__note">
                {{ secondaryCard.note }}
              </p>
              <div class="c-cta-stack c-services__cta">
                <div class="c-cta-stack__item">
                  <button
                    type="button"
                    class="btn btn-outline-primary w-100 c-services__cta-button"
                    :disabled="!chatEnabled"
                    :aria-disabled="!chatEnabled"
                    @click="emit('contact', secondaryCard.cta.section)"
                  >
                    {{ chatEnabled ? secondaryCard.cta.label : secondaryCard.unavailableMessage }}
                  </button>
                </div>
              </div>
              <p
                v-if="!chatEnabled"
                class="text-warning-emphasis bg-warning-subtle border border-warning-subtle rounded-3 px-3 py-2 small mt-3 c-services__alert"
              >
                {{ secondaryCard.unavailableMessage }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { ServiciosSectionEmits, ServiciosSectionProps } from '@/ui/types/sections'
import { useServiciosSection } from './ServiciosSection'

const props = defineProps<ServiciosSectionProps>()
const emit = defineEmits<ServiciosSectionEmits>()

const { chatEnabled, services, primaryCard, secondaryCard } = useServiciosSection(props)

defineOptions({
  name: 'ServiciosSection'
})
</script>
