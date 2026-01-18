<!--
Path: src/ui/sections/ServiciosSection.vue
-->

<template>
  <section id="servicios" class="section-mobile py-5 bg-body-secondary text-body services-section" aria-labelledby="servicios-title">
    <div class="container">
      <h2 id="servicios-title" class="mb-5 text-center text-body-emphasis services-section__title">{{ services.title }}</h2>
      <div class="row g-4">
        <div class="col-12 col-lg-6">
          <div class="card h-100 border-0 shadow-sm services-card">
            <div class="card-body p-4 d-flex flex-column gap-4 services-card__body">
              <div class="d-flex flex-column flex-sm-row gap-3 services-card__header">
                <img
                  :src="primaryCard.media.src"
                  :alt="primaryCard.media.alt"
                  class="rounded-3 shadow-sm align-self-start services-card__media"
                  :width="primaryCard.media.width"
                  :height="primaryCard.media.height"
                  loading="lazy"
                  decoding="async"
                />
                <div>
                  <h3 class="h4 fw-semibold text-body-emphasis mb-2 services-card__title">{{ primaryCard.title }}</h3>
                  <p class="text-secondary mb-0 services-card__text">
                    {{ primaryCard.description }}
                  </p>
                </div>
              </div>
              <h4 class="h6 text-uppercase text-secondary fw-semibold mb-1 services-card__subtitle">{{ primaryCard.subtitle }}</h4>
              <ul class="list-unstyled mb-0 services-card__list">
                <li class="d-flex gap-2 mb-2 services-card__item">
                  <span class="text-success fw-bold services-card__bullet">•</span>
                  <span class="text-body-secondary services-card__item-text">{{ primaryCard.items[0] }}</span>
                </li>
                <li class="d-flex gap-2 mb-2 services-card__item">
                  <span class="text-success fw-bold services-card__bullet">•</span>
                  <span class="text-body-secondary services-card__item-text">{{ primaryCard.items[1] }}</span>
                </li>
                <li class="d-flex gap-2 services-card__item">
                  <span class="text-success fw-bold services-card__bullet">•</span>
                  <span class="text-body-secondary services-card__item-text">{{ primaryCard.items[2] }}</span>
                </li>
              </ul>
              <figure class="text-center mb-4 services-card__figure">
                <img
                  :src="primaryCard.figure.src"
                  :alt="primaryCard.figure.alt"
                  class="img-fluid rounded-3 shadow-sm mx-auto"
                  :width="primaryCard.figure.width"
                  :height="primaryCard.figure.height"
                  loading="lazy"
                  decoding="async"
                />
                <figcaption class="small text-secondary mt-2 services-card__caption">
                  {{ primaryCard.figure.caption }}
                </figcaption>
              </figure>
              <div class="services-cta-stack services-card__cta">
                <div class="services-cta-stack__item">
                  <button
                    type="button"
                    class="btn btn-outline-primary w-100 secondary-whatsapp-cta"
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
                class="text-warning-emphasis bg-warning-subtle border border-warning-subtle rounded-3 px-3 py-2 small mt-3 services-card__alert"
              >
                {{ primaryCard.unavailableMessage }}
              </p>
            </div>
          </div>
        </div>

        <div class="col-12 col-lg-6">
          <div class="card h-100 border-0 shadow-sm services-card">
            <div class="card-body p-4 d-flex flex-column gap-4 services-card__body">
              <div class="d-flex flex-column flex-sm-row gap-3 services-card__header">
                <img
                  :src="secondaryCard.media.src"
                  :alt="secondaryCard.media.alt"
                  class="rounded-3 shadow-sm align-self-start services-card__media"
                  :width="secondaryCard.media.width"
                  :height="secondaryCard.media.height"
                  loading="lazy"
                  decoding="async"
                />
                <div>
                  <h3 class="h4 fw-semibold text-body-emphasis mb-2 services-card__title">{{ secondaryCard.title }}</h3>
                  <p class="text-secondary mb-0 services-card__text">
                    {{ secondaryCard.description }}
                  </p>
                </div>
              </div>
              <h4 class="h6 text-uppercase text-secondary fw-semibold mb-1 services-card__subtitle">{{ secondaryCard.subtitle }}</h4>
              <ul class="list-unstyled mb-0 services-card__list">
                <li class="d-flex gap-2 mb-2 services-card__item">
                  <span class="text-success fw-bold services-card__bullet">•</span>
                  <span class="text-body-secondary services-card__item-text">{{ secondaryCard.items[0] }}</span>
                </li>
                <li class="d-flex gap-2 mb-2 services-card__item">
                  <span class="text-success fw-bold services-card__bullet">•</span>
                  <span class="text-body-secondary services-card__item-text">{{ secondaryCard.items[1] }}</span>
                </li>
                <li class="d-flex gap-2 services-card__item">
                  <span class="text-success fw-bold services-card__bullet">•</span>
                  <span class="text-body-secondary services-card__item-text">{{ secondaryCard.items[2] }}</span>
                </li>
              </ul>
              <p class="small text-secondary mb-0 services-card__note">
                {{ secondaryCard.note }}
              </p>
              <div class="services-cta-stack services-card__cta">
                <div class="services-cta-stack__item">
                  <button
                    type="button"
                    class="btn btn-outline-primary w-100 secondary-whatsapp-cta"
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
                class="text-warning-emphasis bg-warning-subtle border border-warning-subtle rounded-3 px-3 py-2 small mt-3 services-card__alert"
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
import { computed } from 'vue'
import { useContent } from '@/ui/composables/useContent'
import type { ServiciosSectionEmits, ServiciosSectionProps } from '@/ui/types/sections'

const props = defineProps<ServiciosSectionProps>()

const emit = defineEmits<ServiciosSectionEmits>()

const chatEnabled = computed(() => props.chatEnabled)
const { services } = useContent()
const primaryCard = services.cards[0]
const secondaryCard = services.cards[1]

defineOptions({
  name: 'ServiciosSection'
})
</script>
