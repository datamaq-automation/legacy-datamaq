<!--
path: src/components/HeroSection.vue
-->

<template>
  <section class="py-5 bg-body-tertiary text-body" aria-labelledby="hero-title">
    <div class="container py-4">
      <div class="row align-items-center gy-5">
        <div class="col-lg-6 order-2 order-lg-1 text-center text-lg-start">
          <div
            class="d-inline-flex align-items-center gap-2 rounded-pill px-3 py-1 bg-success-subtle text-success-emphasis fw-semibold text-uppercase small"
          >
            Consulta Virtual sin cargo
          </div>
          <h1 id="hero-title" class="display-5 fw-bold text-body-emphasis mt-3 mb-3">
            Energía y producción alineadas a tus objetivos de planta
          </h1>
          <p class="fs-5 text-secondary mb-4">
            Instalamos los medidores críticos y te acompañamos para que el OEE y los kWh/unidad guíen cada decisión
            operativa.
          </p>
          <div
            class="d-flex flex-column flex-sm-row gap-3 align-items-stretch align-items-sm-center align-items-lg-start mb-3"
          >
            <button
              type="button"
              class="btn btn-primary btn-lg px-4 fw-semibold shadow-sm"
              @click="emit('primary-cta')"
            >
              Agendar diagnóstico
            </button>
            <a
              class="btn btn-outline-secondary btn-lg px-4"
              href="#servicios"
            >
              Ver servicios
            </a>
          </div>
          <p class="text-secondary small mb-4">
            Respuesta en menos de 24 horas con agenda de instalación y análisis de datos.
          </p>
          <ul class="row list-unstyled gy-3 text-start" aria-label="Beneficios">
            <li class="col-12 col-sm-6">
              <div class="d-flex gap-3 align-items-start p-3 bg-white rounded-3 shadow-sm h-100">
                <span class="badge bg-success-subtle text-success-emphasis rounded-pill mt-1">1</span>
                <div>
                  <p class="fw-semibold text-body-emphasis mb-1">Línea base en semanas</p>
                  <p class="text-secondary small mb-0">Lecturas continuas de energía y producción con checklist validado.</p>
                </div>
              </div>
            </li>
            <li class="col-12 col-sm-6">
              <div class="d-flex gap-3 align-items-start p-3 bg-white rounded-3 shadow-sm h-100">
                <span class="badge bg-primary-subtle text-primary-emphasis rounded-pill mt-1">2</span>
                <div>
                  <p class="fw-semibold text-body-emphasis mb-1">Decisiones guiadas por OEE</p>
                  <p class="text-secondary small mb-0">Disponibilidad, rendimiento y calidad listos para priorizar mejoras.</p>
                </div>
              </div>
            </li>
            <li class="col-12">
              <div class="d-flex gap-3 align-items-start p-3 bg-white rounded-3 shadow-sm h-100">
                <span class="badge bg-warning-subtle text-warning-emphasis rounded-pill mt-1">3</span>
                <div>
                  <p class="fw-semibold text-body-emphasis mb-1">Preferencia cooperativas y sector gráfico</p>
                  <p class="text-secondary small mb-0">Planes ajustados a industrias del GBA Norte sin exclusiones.</p>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div class="col-lg-6 order-1 order-lg-2 text-center">
          <div class="position-relative mx-auto" style="max-width: 420px;">
            <div
              class="bg-primary rounded-circle position-absolute top-50 start-50 translate-middle"
              style="width: 320px; height: 320px; opacity: 0.25;"
            ></div>
            <img
              src="@/assets/foto-tablero.png"
              alt="Profesional instalando sensores en tablero industrial"
              class="img-fluid rounded-4 shadow-lg position-relative"
              style="max-height: 320px; object-fit: cover;"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: 'primary-cta'): void
}>()
</script>
