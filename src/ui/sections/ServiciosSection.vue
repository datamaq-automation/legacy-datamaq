<!--
Path: src/components/ServiciosSection.vue
-->

<template>
  <section id="servicios" class="section-mobile py-5 bg-body-secondary text-body" aria-labelledby="servicios-title">
    <div class="container">
      <h2 id="servicios-title" class="mb-5 text-center text-body-emphasis">Servicios</h2>
      <div class="row g-4">
        <div class="col-12 col-lg-6">
          <div class="card h-100 border-0 shadow-sm">
            <div class="card-body p-4 d-flex flex-column gap-4">
              <div class="d-flex flex-column flex-sm-row gap-3">
                <img
                  :src="installTools"
                  alt="Ilustración de herramientas y plano técnico"
                  class="rounded-3 shadow-sm align-self-start"
                  width="140"
                  height="120"
                  loading="lazy"
                  decoding="async"
                />
                <div>
                  <h3 class="h4 fw-semibold text-body-emphasis mb-2">Instalación de medidores</h3>
                  <p class="text-secondary mb-0">
                    Diseñamos y dejamos operativa la captura de datos de energía y producción para que empieces a
                    medir sin fricciones.
                  </p>
                </div>
              </div>
              <h4 class="h6 text-uppercase text-secondary fw-semibold mb-1">Entregables</h4>
              <ul class="list-unstyled mb-0">
                <li class="d-flex gap-2 mb-2">
                  <span class="text-success fw-bold">•</span>
                  <span class="text-body-secondary">Mapa priorizado de puntos eléctricos y de proceso.</span>
                </li>
                <li class="d-flex gap-2 mb-2">
                  <span class="text-success fw-bold">•</span>
                  <span class="text-body-secondary">Checklist de instalación, seguridad y calibración.</span>
                </li>
                <li class="d-flex gap-2">
                  <span class="text-success fw-bold">•</span>
                  <span class="text-body-secondary">Configuración inicial validada con lecturas de referencia.</span>
                </li>
              </ul>
              <figure class="text-center mb-4">
                <img
                  :src="powermeter"
                  alt="Ilustración de medidor de energía"
                  class="img-fluid rounded-3 shadow-sm mx-auto"
                  width="220"
                  height="140"
                  loading="lazy"
                  decoding="async"
                />
                <figcaption class="small text-secondary mt-2">
                  Equipos powermeter industriales para lecturas confiables desde el primer día.
                </figcaption>
              </figure>
              <div class="cta-stack">
                <div class="cta-stack__item">
                  <button
                    type="button"
                    class="btn btn-outline-primary w-100 secondary-whatsapp-cta"
                    :disabled="!chatEnabled"
                    :aria-disabled="!chatEnabled"
                    @click="emit('contact', 'servicios-instalacion')"
                  >
                    {{ chatEnabled ? CTA_COPY.PRIMARY_WHATSAPP : CTA_COPY.WHATSAPP_UNAVAILABLE }}
                  </button>
                </div>
              </div>
              <p
                v-if="!chatEnabled"
                class="text-warning-emphasis bg-warning-subtle border border-warning-subtle rounded-3 px-3 py-2 small mt-3"
              >
                El canal de WhatsApp se encuentra temporalmente fuera de línea. Volvé a intentar en unos minutos.
              </p>
            </div>
          </div>
        </div>

        <div class="col-12 col-lg-6">
          <div class="card h-100 border-0 shadow-sm">
            <div class="card-body p-4 d-flex flex-column gap-4">
              <div class="d-flex flex-column flex-sm-row gap-3">
                <img
                  :src="analytics"
                  alt="Ilustración de dashboard con indicadores energéticos"
                  class="rounded-3 shadow-sm align-self-start"
                  width="160"
                  height="140"
                  loading="lazy"
                  decoding="async"
                />
                <div>
                  <h3 class="h4 fw-semibold text-body-emphasis mb-2">Consultoría en datos y mejora</h3>
                  <p class="text-secondary mb-0">
                    Interpretamos la línea base (energía/unidad, disponibilidad y rendimiento) y priorizamos dónde
                    intervenir primero.
                  </p>
                </div>
              </div>
              <h4 class="h6 text-uppercase text-secondary fw-semibold mb-1">Resultados clave</h4>
              <ul class="list-unstyled mb-0">
                <li class="d-flex gap-2 mb-2">
                  <span class="text-success fw-bold">•</span>
                  <span class="text-body-secondary">Dashboard base con kWh/unidad, disponibilidad y rendimiento.</span>
                </li>
                <li class="d-flex gap-2 mb-2">
                  <span class="text-success fw-bold">•</span>
                  <span class="text-body-secondary">Matriz impacto/esfuerzo con quick wins y proyectos estructurales.</span>
                </li>
                <li class="d-flex gap-2">
                  <span class="text-success fw-bold">•</span>
                  <span class="text-body-secondary">Informe ejecutivo con próximos pasos y período de repago estimado.</span>
                </li>
              </ul>
              <p class="small text-secondary mb-0">
                Visualizamos indicadores como IDEn, OEE y payback para alinear a equipos técnicos y gerencia en las mismas prioridades.
              </p>
              <div class="cta-stack">
                <div class="cta-stack__item">
                  <button
                    type="button"
                    class="btn btn-outline-primary w-100 secondary-whatsapp-cta"
                    :disabled="!chatEnabled"
                    :aria-disabled="!chatEnabled"
                    @click="emit('contact', 'servicios-consultoria')"
                  >
                    {{ chatEnabled ? CTA_COPY.PRIMARY_WHATSAPP : CTA_COPY.WHATSAPP_UNAVAILABLE }}
                  </button>
                </div>
              </div>
              <p
                v-if="!chatEnabled"
                class="text-warning-emphasis bg-warning-subtle border border-warning-subtle rounded-3 px-3 py-2 small mt-3"
              >
                El canal de WhatsApp se encuentra temporalmente fuera de línea. Volvé a intentar en unos minutos.
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
import { CTA_COPY } from '@/application/constants/ctaCopy'
import type { ServiciosSectionEmits, ServiciosSectionProps } from '@/ui/types/sections'
import analytics from '@/assets/analytics-dashboard.svg'
import installTools from '@/assets/install-tools.svg'
import powermeter from '@/assets/powermeter.svg'

const props = defineProps<ServiciosSectionProps>()

const emit = defineEmits<ServiciosSectionEmits>()

const chatEnabled = computed(() => props.chatEnabled)

defineOptions({
  name: 'ServiciosSection'
})
</script>
