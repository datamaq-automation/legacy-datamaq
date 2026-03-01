<!--
Path: src/components/TecnicoACargo.vue
-->

<template>
  <section
    v-if="isSection"
    class="py-5"
    :aria-labelledby="headingId"
  >
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-6 col-md-8">
          <div class="card c-ui-card border-warning border-2 shadow-sm">
            <div class="card-body p-4 text-center">
              <div class="c-tecnico-avatar mx-auto mb-3">
                <img
                  :src="technician.photo.src"
                  :alt="technician.photo.alt"
                  class="c-tecnico-avatar__image rounded-circle"
                  :width="technician.photo.width ?? 100"
                  :height="technician.photo.height ?? 100"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <p
                :id="headingId"
                class="text-uppercase small text-warning mb-1"
              >
                {{ technician.role }}
              </p>
              <h3 class="h5 fw-bold mb-3">
                {{ technician.name }}
              </h3>

              <button
                v-if="whatsappHref"
                type="button"
                class="btn c-ui-btn c-ui-btn--primary btn-lg w-100"
                @click="handleWhatsAppClick"
              >
                {{ technician.whatsappLabel }}
              </button>
              <p v-else class="text-muted small mb-0">
                {{ technician.unavailableLabel }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <div
    v-else
    class="mb-4"
    role="region"
    :aria-labelledby="headingId"
  >
    <div class="card c-ui-card border-warning border-2 shadow-sm">
      <div class="card-body p-4 text-center">
        <div class="c-tecnico-avatar mx-auto mb-3">
          <img
            :src="technician.photo.src"
            :alt="technician.photo.alt"
            class="c-tecnico-avatar__image rounded-circle"
            :width="technician.photo.width ?? 100"
            :height="technician.photo.height ?? 100"
            loading="lazy"
            decoding="async"
          />
        </div>

        <p
          :id="headingId"
          class="text-uppercase small text-warning mb-1"
        >
          {{ technician.role }}
        </p>
        <h3 class="h5 fw-bold mb-3">
          {{ technician.name }}
        </h3>

        <button
          v-if="whatsappHref"
          type="button"
          class="btn c-ui-btn c-ui-btn--primary btn-lg w-100"
          @click="handleWhatsAppClick"
        >
          {{ technician.whatsappLabel }}
        </button>
        <p v-else class="text-muted small mb-0">
          {{ technician.unavailableLabel }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getWhatsAppHref } from '@/ui/controllers/contactController'
import { useContainer } from '@/di/container'

const props = withDefaults(
  defineProps<{
    variant?: 'section' | 'embedded'
    headingId?: string
  }>(),
  {
    variant: 'section',
    headingId: 'tecnico-a-cargo-title'
  }
)

const { content, engagementTracker, environment } = useContainer()

const whatsappHref = computed(() => getWhatsAppHref())
const isSection = computed(() => props.variant === 'section')
const headingId = computed(() => props.headingId)
const technician = computed(() => content.getBrandContent().technician)

function handleWhatsAppClick(): void {
  if (!whatsappHref.value) {
    return
  }

  window.open(whatsappHref.value, '_blank')

  const params = new URLSearchParams(environment.search())
  const utmSource = params.get('utm_source')
  const trafficSource = utmSource || environment.referrer() || 'direct'
  engagementTracker.trackChat('tecnico-a-cargo', trafficSource)
}
</script>

<style scoped>
.c-tecnico-avatar {
  width: 100px;
  height: 100px;
  display: inline-block;
}

.c-tecnico-avatar__image {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}
</style>
