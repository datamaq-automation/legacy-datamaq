<template>
  <section id="proceso" class="section-mobile py-5 bg-body text-body c-decision-flow" aria-labelledby="proceso-title">
    <div class="container">
      <h2 id="proceso-title" class="mb-4 text-body-emphasis c-decision-flow__title">{{ flow.processTitle }}</h2>
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
      <h2 id="tarifas-title" class="mb-3 text-body-emphasis c-decision-flow__title">{{ flow.pricingTitle }}</h2>
      <p class="mb-4 text-secondary c-decision-flow__summary">{{ pricingSummary }}</p>
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
      <a class="btn c-ui-btn c-ui-btn--outline mt-4" href="#contacto">{{ flow.contactFormLabel }}</a>
    </div>
  </section>

  <section id="cobertura" class="section-mobile py-5 bg-dark text-white c-decision-flow" aria-labelledby="cobertura-title">
    <div class="container">
      <h2 id="cobertura-title" class="mb-3 c-decision-flow__title">{{ flow.coverageTitle }}</h2>
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
                :href="decisionFlowWhatsappHref"
                :target="isExternalWhatsappHref ? '_blank' : undefined"
                :rel="isExternalWhatsappHref ? 'noopener noreferrer' : undefined"
              >
                {{ flow.whatsappLabel }}
              </a>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>

  <section id="faq" class="section-mobile py-5 bg-body text-body c-decision-flow" aria-labelledby="faq-title">
    <div class="container">
      <h2 id="faq-title" class="mb-4 text-body-emphasis c-decision-flow__title">{{ flow.faqTitle }}</h2>
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
import { getWhatsAppHref } from '@/ui/controllers/contactController'

const { content } = useContainer()
const flow = computed(() => content.getContent().decisionFlow)
const decisionFlowWhatsappHref = computed(() => getWhatsAppHref() ?? '#contacto')
const isExternalWhatsappHref = computed(() => /^https?:\/\//.test(decisionFlowWhatsappHref.value))
const pricingSummary = computed(() => {
  const installationCard = content.getServicesContent().cards.find((card) => card.id === 'instalacion')
  return installationCard?.figure?.caption ?? flow.value.pricingSummaryFallback
})

const processSteps = computed(() => flow.value.processSteps)
const pricingIncludes = computed(() => flow.value.pricingIncludes)
const pricingExcludes = computed(() => flow.value.pricingExcludes)
const pricingVariables = computed(() => flow.value.pricingVariables)
const coverageAreas = computed(() => flow.value.coverageAreas)
const responseTimes = computed(() => flow.value.responseTimes)
const faqItems = computed(() => flow.value.faqItems)

defineOptions({
  name: 'DecisionFlowSection'
})
</script>
