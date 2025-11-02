<!--
Path: src/components/ServiciosSection.vue
-->

<template>
  <section id="servicios" class="py-5">
    <div class="container">
      <h2 class="mb-4">Servicios</h2>
      <div class="row g-4">
        <div class="col-12 col-md-6">
          <div class="card h-100 bg-dark border-secondary">
            <img
              src="@/assets/herramientas.png"
              alt="Herramientas eléctricas y de medición industrial"
              class="card-img-top p-3"
              style="max-height: 180px; object-fit: contain;"
            />
            <div class="card-body">
              <h3 class="card-title text-white">Instalación de medidores</h3>
              <p class="card-text text-white">
                Relevamiento, instalación y puesta en marcha de puntos de captura para energía y producción con
                lecturas confiables. Entregamos mapa de puntos, checklist y recomendaciones iniciales.
              </p>
              <img
                src="@/assets/powermeter.png"
                alt="Equipos powermeter industriales"
                class="img-fluid rounded shadow mt-3 mx-auto d-block"
                style="max-height: 120px; object-fit: contain;"
              />
              <p class="text-white-50 mt-2 mb-0" style="font-size: 0.95em;">
                Utilizamos equipos powermeter industriales para garantizar precisión y confiabilidad en la medición.
              </p>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="card h-100 bg-dark border-secondary">
            <div class="card-body">
              <h3 class="card-title text-white">Consultoría en datos y mejora</h3>
              <p class="card-text text-white">
                Analizamos tu <em>línea base</em> (energía/unidad, disponibilidad, rendimiento), detectamos oportunidades
                y priorizamos mejoras por impacto/esfuerzo. Entregamos un informe ejecutivo accionable.
              </p>
              <img
                src="@/assets/infografia-indicadores.png"
                alt="Infografía de indicadores energéticos y período de repago"
                class="img-fluid rounded shadow mt-3"
                style="max-height: 140px; object-fit: contain;"
              />
              <p class="text-white-50 mt-2 mb-0" style="font-size: 0.95em;">
                Visualizamos indicadores clave como IDEn, OEE y período de repago para facilitar la toma de decisiones.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
