<template>
  <section class="px-6 py-12 bg-navy-dark/40 border-y border-slate-800/50">
    <h2 class="text-slate-100 text-2xl font-black mb-8">Preguntas Frecuentes</h2>
    
    <div class="space-y-4">
      
      <!-- FAQ 1 -->
      <div class="faq-item bg-navy-light border-l-2 border-primary/60 rounded-r-xl overflow-hidden shadow-lg">
        <input checked class="hidden" id="faq-1" name="faq-accordion" type="radio"/>
        <label class="flex items-center justify-between p-5 cursor-pointer active:bg-navy-light/80" for="faq-1">
          <span class="text-slate-100 font-bold text-sm leading-snug pr-4">¿Cuál es el tiempo de respuesta?</span>
          <span class="material-symbols-outlined text-primary icon-plus text-2xl">add</span>
        </label>
        <div class="faq-content px-5">
          <p class="text-slate-400 text-sm leading-relaxed border-t border-slate-800 pt-3">
            Nuestro equipo técnico garantiza una respuesta inicial en menos de 24 horas hábiles. Para emergencias críticas, disponemos de protocolos de intervención inmediata para minimizar paradas de planta.
          </p>
        </div>
      </div>
      
      <!-- FAQ 2 -->
      <div class="faq-item bg-navy-light border-l-2 border-primary/60 rounded-r-xl overflow-hidden shadow-lg">
        <input class="hidden" id="faq-2" name="faq-accordion" type="radio"/>
        <label class="flex items-center justify-between p-5 cursor-pointer active:bg-navy-light/80" for="faq-2">
          <span class="text-slate-100 font-bold text-sm leading-snug pr-4">¿Cómo se determinan los costos?</span>
          <span class="material-symbols-outlined text-primary icon-plus text-2xl">add</span>
        </label>
        <div class="faq-content px-5">
          <p class="text-slate-400 text-sm leading-relaxed border-t border-slate-800 pt-3">
            Los costos se basan en la complejidad del proyecto, el tiempo estimado de ejecución y los recursos técnicos especializados requeridos. Proporcionamos presupuestos detallados tras una evaluación técnica preliminar.
          </p>
        </div>
      </div>

      <!-- FAQ 3 -->
      <div class="faq-item bg-navy-light border-l-2 border-primary/60 rounded-r-xl overflow-hidden shadow-lg">
        <input class="hidden" id="faq-3" name="faq-accordion" type="radio"/>
        <label class="flex items-center justify-between p-5 cursor-pointer active:bg-navy-light/80" for="faq-3">
          <span class="text-slate-100 font-bold text-sm leading-snug pr-4">¿Qué zonas de cobertura abarcan?</span>
          <span class="material-symbols-outlined text-primary icon-plus text-2xl">add</span>
        </label>
        <div class="faq-content px-5">
          <p class="text-slate-400 text-sm leading-relaxed border-t border-slate-800 pt-3">
            Contamos con cobertura presencial en los principales nodos industriales del país. Adicionalmente, ofrecemos servicios de consultoría y soporte remoto para proyectos internacionales y regiones alejadas.
          </p>
        </div>
      </div>

      <!-- FAQ 4 -->
      <div class="faq-item bg-navy-light border-l-2 border-primary/60 rounded-r-xl overflow-hidden shadow-lg">
        <input class="hidden" id="faq-4" name="faq-accordion" type="radio"/>
        <label class="flex items-center justify-between p-5 cursor-pointer active:bg-navy-light/80" for="faq-4">
          <span class="text-slate-100 font-bold text-sm leading-snug pr-4">¿Qué tipo de garantía ofrecen?</span>
          <span class="material-symbols-outlined text-primary icon-plus text-2xl">add</span>
        </label>
        <div class="faq-content px-5">
          <p class="text-slate-400 text-sm leading-relaxed border-t border-slate-800 pt-3">
            Todos nuestros servicios cuentan con garantía de satisfacción y soporte post-implementación. Aseguramos que los sistemas instalados y la lógica programada cumplan con los estándares de seguridad industrial vigentes.
          </p>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
// Acordeón interactivo sin JS complejo, aprovechando el truco de inputs tipo radio.
</script>

<style scoped>
.bg-navy-dark {
    background-color: #020c1b;
}
.bg-navy-light {
    background-color: #0A192F;
}
.text-primary {
    color: #ff8c00;
}
.border-primary {
    border-color: #ff8c00;
}

/* Smooth Accordion Animations */
.faq-item input:checked ~ .faq-content {
    max-height: 500px;
    padding-bottom: 1.25rem;
    opacity: 1;
}
.faq-item input:checked ~ label .icon-plus {
    transform: rotate(45deg);
}
.faq-content {
    max-height: 0;
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    opacity: 0;
}
.icon-plus {
    transition: transform 0.3s ease;
}
</style>
