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
import { reportGtagConversion } from '@/ui/utils/gtagConversion'

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
const technician = computed(() => {
  if (!content || typeof content.getBrandContent !== 'function') {
    return {
      name: 'Agustín Bustos',
      role: 'Técnico a cargo',
      photo: { src: '/media/tecnico-a-cargo.webp', alt: 'Foto del técnico a cargo', width: 100, height: 100 },
      whatsappLabel: 'Coordinar por WhatsApp',
      unavailableLabel: 'Técnico no disponible'
    }
  }
  return content.getBrandContent().technician
})

function handleWhatsAppClick(): boolean | void {
  if (!whatsappHref.value) {
    return
  }

  const params = new URLSearchParams(environment.search())
  const utmSource = params.get('utm_source')
  const trafficSource = utmSource || environment.referrer() || 'direct'
  engagementTracker.trackChat('tecnico-a-cargo', trafficSource)

  return reportGtagConversion(whatsappHref.value)
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
