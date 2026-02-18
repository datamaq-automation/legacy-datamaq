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
                  :src="tecnicoAvatar"
                  alt="Foto del tecnico a cargo"
                  class="c-tecnico-avatar__image rounded-circle"
                  width="100"
                  height="100"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <p
                :id="headingId"
                class="text-uppercase small text-warning mb-1"
              >
                Técnico a cargo
              </p>
              <h3 class="h5 fw-bold mb-3">
                Agustín Bustos
              </h3>

              <button
                v-if="whatsappHref"
                type="button"
                class="btn c-ui-btn c-ui-btn--primary btn-lg w-100"
                @click="handleWhatsAppClick"
              >
                Coordinar por WhatsApp
              </button>
              <p v-else class="text-muted small mb-0">
                Contacto no disponible
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
            :src="tecnicoAvatar"
            alt="Foto del tecnico a cargo"
            class="c-tecnico-avatar__image rounded-circle"
            width="100"
            height="100"
            loading="lazy"
            decoding="async"
          />
        </div>

        <p
          :id="headingId"
          class="text-uppercase small text-warning mb-1"
        >
          Técnico a cargo
        </p>
        <h3 class="h5 fw-bold mb-3">
          Agustín Bustos
        </h3>

        <button
          v-if="whatsappHref"
          type="button"
          class="btn c-ui-btn c-ui-btn--primary btn-lg w-100"
          @click="handleWhatsAppClick"
        >
          Coordinar por WhatsApp
        </button>
        <p v-else class="text-muted small mb-0">
          Contacto no disponible
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import tecnicoAvatar from '@/assets/tecnico-a-cargo.webp'
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

const whatsappHref = computed(() => getWhatsAppHref())
const isSection = computed(() => props.variant === 'section')
const headingId = computed(() => props.headingId)

function handleWhatsAppClick(): void {
  if (!whatsappHref.value) {
    return
  }

  window.open(whatsappHref.value, '_blank')

  const { engagementTracker, environment } = useContainer()
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
