<!--
Path: src/components/ServiciosSection.vue
-->

<template>
  <section id="servicios" class="py-5 bg-body-secondary text-body">
    <div class="container">
      <h2 class="mb-5 text-center text-body-emphasis">Servicios</h2>
      <div class="row g-4">
        <div class="col-12 col-lg-6">
          <div class="card h-100 border-0 shadow-sm">
            <div class="card-body p-4">
              <div class="d-flex flex-column flex-sm-row gap-3 mb-4">
                <img
                  src="@/assets/herramientas.png"
                  alt="Herramientas eléctricas y de medición industrial"
                  class="rounded-3 shadow-sm align-self-start"
                  style="max-width: 140px; object-fit: contain;"
                />
                <div>
                  <h3 class="h4 fw-semibold text-body-emphasis mb-2">Instalación de medidores</h3>
                  <p class="text-secondary mb-0">
                    Diseñamos y dejamos operativa la captura de datos de energía y producción para que empieces a
                    medir sin fricciones.
                  </p>
                </div>
              </div>
              <h4 class="h6 text-uppercase text-secondary fw-semibold mb-3">Entregables</h4>
              <ul class="list-unstyled mb-4">
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
              <figure class="text-center mb-0">
                <img
                  src="@/assets/powermeter.png"
                  alt="Equipos powermeter industriales"
                  class="img-fluid rounded-3 shadow-sm mx-auto"
                  style="max-height: 120px; object-fit: contain;"
                />
                <figcaption class="small text-secondary mt-2">
                  Equipos powermeter industriales para lecturas confiables desde el primer día.
                </figcaption>
              </figure>
            </div>
          </div>
        </div>

        <div class="col-12 col-lg-6">
          <div class="card h-100 border-0 shadow-sm">
            <div class="card-body p-4">
              <div class="d-flex flex-column flex-sm-row gap-3 mb-4">
                <img
                  src="@/assets/infografia-indicadores.png"
                  alt="Infografía de indicadores energéticos y período de repago"
                  class="rounded-3 shadow-sm align-self-start"
                  style="max-width: 160px; object-fit: contain;"
                />
                <div>
                  <h3 class="h4 fw-semibold text-body-emphasis mb-2">Consultoría en datos y mejora</h3>
                  <p class="text-secondary mb-0">
                    Interpretamos la línea base (energía/unidad, disponibilidad y rendimiento) y priorizamos dónde
                    intervenir primero.
                  </p>
                </div>
              </div>
              <h4 class="h6 text-uppercase text-secondary fw-semibold mb-3">Resultados clave</h4>
              <ul class="list-unstyled mb-4">
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
                Visualizamos indicadores como IDEn, OEE y payback para alinear a equipos técnicos y gerencia en las
                mismas prioridades.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
