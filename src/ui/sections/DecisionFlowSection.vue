<template>
  <section id="proceso" class="section-mobile py-5 bg-body text-body c-decision-flow" aria-labelledby="proceso-title">
    <div class="container">
      <h2 id="proceso-title" class="mb-4 text-body-emphasis c-decision-flow__title">
        Como trabajamos
      </h2>
      <ol class="row g-3 list-unstyled c-decision-flow__steps">
        <li v-for="step in processSteps" :key="step.order" class="col-12 col-lg-6">
          <article class="card c-ui-card h-100 border-0">
            <div class="card-body">
              <p class="small text-uppercase fw-semibold mb-2 c-decision-flow__eyebrow">Paso {{ step.order }}</p>
              <h3 class="h5 mb-2">{{ step.title }}</h3>
              <p class="mb-0 text-secondary">{{ step.description }}</p>
            </div>
          </article>
        </li>
      </ol>
    </div>
  </section>

  <section id="tarifas" class="section-mobile py-5 bg-body-secondary text-body c-decision-flow" aria-labelledby="tarifas-title">
    <div class="container">
      <h2 id="tarifas-title" class="mb-3 text-body-emphasis c-decision-flow__title">
        Tarifa base y alcance
      </h2>
      <p class="mb-4 text-secondary c-decision-flow__summary">
        {{ pricingSummary }}
      </p>
      <div class="row g-3">
        <article class="col-12 col-lg-4">
          <div class="card c-ui-card h-100 border-0">
            <div class="card-body">
              <h3 class="h6 text-uppercase mb-3 c-decision-flow__card-title">Incluye</h3>
              <ul class="mb-0 ps-3 c-decision-flow__list">
                <li v-for="item in pricingIncludes" :key="item">{{ item }}</li>
              </ul>
            </div>
          </div>
        </article>
        <article class="col-12 col-lg-4">
          <div class="card c-ui-card h-100 border-0">
            <div class="card-body">
              <h3 class="h6 text-uppercase mb-3 c-decision-flow__card-title">No incluye</h3>
              <ul class="mb-0 ps-3 c-decision-flow__list">
                <li v-for="item in pricingExcludes" :key="item">{{ item }}</li>
              </ul>
            </div>
          </div>
        </article>
        <article class="col-12 col-lg-4">
          <div class="card c-ui-card h-100 border-0">
            <div class="card-body">
              <h3 class="h6 text-uppercase mb-3 c-decision-flow__card-title">Puede variar por</h3>
              <ul class="mb-0 ps-3 c-decision-flow__list">
                <li v-for="item in pricingVariables" :key="item">{{ item }}</li>
              </ul>
            </div>
          </div>
        </article>
      </div>
      <a class="btn c-ui-btn c-ui-btn--outline mt-4" href="#contacto">Ir al formulario de contacto</a>
    </div>
  </section>

  <section id="cobertura" class="section-mobile py-5 bg-dark text-white c-decision-flow" aria-labelledby="cobertura-title">
    <div class="container">
      <h2 id="cobertura-title" class="mb-3 c-decision-flow__title">Cobertura y tiempos</h2>
      <div class="row g-3">
        <article class="col-12 col-lg-6">
          <div class="card c-ui-card c-ui-card--elevated h-100 border-0">
            <div class="card-body">
              <h3 class="h6 text-uppercase mb-3 c-decision-flow__card-title">Zona</h3>
              <ul class="mb-0 ps-3 c-decision-flow__list">
                <li v-for="item in coverageAreas" :key="item">{{ item }}</li>
              </ul>
            </div>
          </div>
        </article>
        <article class="col-12 col-lg-6">
          <div class="card c-ui-card c-ui-card--elevated h-100 border-0">
            <div class="card-body">
              <h3 class="h6 text-uppercase mb-3 c-decision-flow__card-title">Tiempo de respuesta</h3>
              <ul class="mb-0 ps-3 c-decision-flow__list">
                <li v-for="item in responseTimes" :key="item">{{ item }}</li>
              </ul>
              <a
                class="btn c-ui-btn c-ui-btn--primary mt-3"
                href="https://wa.me/5491156297160?text=Hola%20vengo%20de%20la%20p%C3%A1gina%20web%20y%20quiero%20m%C3%A1s%20informaci%C3%B3n"
                target="_blank"
                rel="noopener noreferrer"
              >
                Pedir coordinacion por WhatsApp
              </a>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>

  <section id="faq" class="section-mobile py-5 bg-body text-body c-decision-flow" aria-labelledby="faq-title">
    <div class="container">
      <h2 id="faq-title" class="mb-4 text-body-emphasis c-decision-flow__title">Preguntas frecuentes</h2>
      <div class="row g-3">
        <article v-for="item in faqItems" :key="item.question" class="col-12 col-lg-6">
          <div class="card c-ui-card h-100 border-0">
            <div class="card-body">
              <h3 class="h6 mb-2">{{ item.question }}</h3>
              <p class="mb-0 text-secondary">{{ item.answer }}</p>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useContainer } from '@/di/container'

interface ProcessStep {
  order: number
  title: string
  description: string
}

interface FaqItem {
  question: string
  answer: string
}

const { content } = useContainer()
const pricingSummary = computed(() => {
  const installationCard = content
    .getServicesContent()
    .cards.find((card) => card.id === 'instalacion')

  return (
    installationCard?.figure?.caption ??
    'Tarifa base y alcance sujetos a diagnóstico, distancia y condiciones de seguridad.'
  )
})

const processSteps: ProcessStep[] = [
  {
    order: 1,
    title: 'Relevamiento y checklist de seguridad',
    description:
      'Levantamos contexto de tablero, riesgos y objetivo operativo antes de intervenir para evitar cambios a ciegas.'
  },
  {
    order: 2,
    title: 'Ejecucion tecnica en planta',
    description:
      'Instalamos o diagnosticamos con criterio industrial, manteniendo trazabilidad de cada accion durante la intervencion.'
  },
  {
    order: 3,
    title: 'Verificacion final',
    description:
      'Validamos lectura de referencia y condiciones de funcionamiento para confirmar que el servicio queda operativo.'
  },
  {
    order: 4,
    title: 'Cierre tecnico y documentacion',
    description:
      'Entregamos observaciones, pendientes y recomendaciones concretas para sostener continuidad operativa.'
  }
]

const pricingIncludes = [
  'Relevamiento inicial y checklist tecnico.',
  'Instalacion de 1 Powermeter o diagnostico en sitio.',
  'Verificacion final de funcionamiento.',
  'Registro tecnico basico de la intervencion.'
]

const pricingExcludes = [
  'Equipo Powermeter/Automate (lo provee el cliente).',
  'Adecuaciones electricas mayores del tablero.',
  'Materiales extra no previstos en el alcance inicial.'
]

const pricingVariables = [
  'Distancia y traslado desde base operativa en Garin.',
  'Criticidad de urgencia y franja horaria.',
  'Condiciones de seguridad o accesibilidad en planta.'
]

const coverageAreas = [
  'Cobertura prioritaria en GBA Norte.',
  'AMBA sujeto a agenda y viabilidad tecnica.',
  'Interior con coordinacion previa.'
]

const responseTimes = [
  'Respuesta comercial en menos de 24 horas.',
  'Agenda de visita segun criticidad y disponibilidad.',
  'Urgencias industriales fuera de horario con coordinacion.'
]

const faqItems: FaqItem[] = [
  {
    question: 'Que necesito para coordinar rapido?',
    answer:
      'Servicio requerido, zona de planta y nivel de urgencia. Con eso enviamos tarifa base y siguiente paso.'
  },
  {
    question: 'Trabajan con seguridad y trazabilidad?',
    answer:
      'Si. El flujo incluye checklist previo, verificacion final y cierre tecnico documentado.'
  },
  {
    question: 'La tarifa base puede cambiar?',
    answer:
      'Si, puede variar por distancia, urgencia, accesibilidad y condiciones de seguridad detectadas en sitio.'
  },
  {
    question: 'Si no puedo esperar correo, como sigo?',
    answer:
      'El canal mas rapido es WhatsApp. Desde ahi coordinamos diagnostico, instalacion o urgencia.'
  }
]

defineOptions({
  name: 'DecisionFlowSection'
})
</script>
