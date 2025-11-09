<!--
path: src/components/HeroSection.vue
-->

<template>
  <section class="bg-primary bg-gradient py-5 text-white" aria-labelledby="hero-title">
    <div class="container py-4">
      <div class="row justify-content-center align-items-center">
        <div class="col-md-4 mb-4 mb-md-0 text-center">
          <img
            src="@/assets/foto-tablero.png"
            alt="Foto profesional trabajando en tablero eléctrico"
            class="img-fluid rounded shadow"
            style="max-height: 260px;"
          />
        </div>
        <div class="col-lg-8 col-xl-8 text-center">
          <h1 id="hero-title" class="display-5 fw-bold mb-3">
            Eficiencia energética y OEE para industrias del GBA Norte
          </h1>
          <p class="fs-5 mb-3 text-white-50">
            Instalación de medidores + consultoría para interpretar datos de energía y producción
          </p>
          <p class="lead mb-4">
            Medimos <strong>kWh por unidad</strong> y <strong>disponibilidad/rendimiento</strong> para construir tu
            <strong>línea base</strong> y priorizar mejoras con retorno.
          </p>
          <div class="d-flex gap-3 flex-wrap justify-content-center mb-4">
            <button
              type="button"
              class="btn btn-light btn-lg px-4 fw-semibold text-dark"
              @click="emit('primary-cta')"
            >
              Agendar diagnóstico
            </button>
            <a
              v-if="chatEnabled"
              class="btn btn-outline-light btn-lg px-4"
              :href="chatUrl"
              target="_blank"
              rel="noopener"
              @click="emit('chat_click')"
            >
              Conversá con nuestro bot especializado para sacarte todas tus dudas
            </a>
          </div>
          <ul class="list-unstyled text-start text-md-center" aria-label="Beneficios">
            <li class="mb-2">✓ Línea base en semanas, no meses.</li>
            <li class="mb-2">✓ Decisiones con datos: energía/unidad, disponibilidad y rendimiento.</li>
            <li class="mb-2">✓ Preferencia sector gráfico y cooperativas (sin exclusiones).</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  chatEnabled: boolean
  chatUrl: string
}>()

const emit = defineEmits<{
  (e: 'primary-cta'): void
  (e: 'chat_click'): void
}>()
</script>
