<script setup lang="ts">
import Navbar from '@/ui/layout/Navbar.vue'
import Footer from '@/ui/layout/Footer.vue'
import ConsentBanner from '@/ui/features/contact/ConsentBanner.vue'
import ContactFormSection from '@/ui/features/contact/ContactFormSection.vue'
import WhatsAppFab from '@/ui/features/contact/WhatsAppFab.vue'
import { landingPages } from '@/seo/landingPages'
import { useMedicionConsumoEscobar } from './MedicionConsumoEscobar'

const content = landingPages.medicionConsumoEscobar
const {
  contactCtaEnabled,
  contactEmail,
  handleChat,
  handleEmailSubmit
} = useMedicionConsumoEscobar()
</script>

<template>
  <div class="app-shell bg-dark text-white min-vh-100">
    <a class="skip-link" href="#contenido-principal">Saltar al contenido principal</a>
    <Navbar :contactCtaEnabled="contactCtaEnabled" @contact="handleChat('landing-escobar-navbar')" />
    <main id="contenido-principal" class="flex-grow-1 with-floating-cta">
      <section class="py-5" aria-labelledby="escobar-hero-title">
        <div class="container">
          <p class="text-uppercase small text-muted mb-2">{{ content.eyebrow }}</p>
          <h1 id="escobar-hero-title" class="display-5 fw-bold mb-3">{{ content.headline }}</h1>
          <p class="lead text-white-50 mb-4">{{ content.lead }}</p>
          <div class="d-flex flex-column flex-sm-row gap-3">
            <button
              v-if="contactCtaEnabled"
              type="button"
              class="btn c-ui-btn c-ui-btn--primary btn-lg"
              @click="handleChat('landing-escobar-hero')"
            >
              Escribir por WhatsApp
            </button>
            <a class="btn c-ui-btn c-ui-btn--outline btn-lg" href="#contacto">
              Solicitar medicion
            </a>
          </div>
        </div>
      </section>

      <section class="py-4" aria-labelledby="escobar-summary-title">
        <div class="container">
          <h2 id="escobar-summary-title" class="h3 fw-semibold mb-3">Respuesta rapida</h2>
          <ul class="text-white-50">
            <li v-for="item in content.summary" :key="item">{{ item }}</li>
          </ul>
        </div>
      </section>

      <section class="py-4" aria-labelledby="escobar-includes-title">
        <div class="container">
          <div class="row g-4">
            <div class="col-lg-6">
              <h2 id="escobar-includes-title" class="h4 fw-semibold mb-3">Que incluye</h2>
              <ul class="text-white-50">
                <li v-for="item in content.includes" :key="item">{{ item }}</li>
              </ul>
            </div>
            <div class="col-lg-6">
              <h2 class="h4 fw-semibold mb-3">Como trabajamos</h2>
              <ol class="text-white-50">
                <li v-for="item in content.steps" :key="item">{{ item }}</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section class="py-4" aria-labelledby="escobar-deliverables-title">
        <div class="container">
          <h2 id="escobar-deliverables-title" class="h4 fw-semibold mb-3">Entregables</h2>
          <ul class="text-white-50">
            <li v-for="item in content.deliverables" :key="item">{{ item }}</li>
          </ul>
        </div>
      </section>

      <section class="py-4" aria-labelledby="escobar-faq-title">
        <div class="container">
          <h2 id="escobar-faq-title" class="h4 fw-semibold mb-3">Preguntas frecuentes</h2>
          <div class="d-flex flex-column gap-3">
            <details
              v-for="faq in content.faqs"
              :key="faq.question"
              class="bg-body text-body rounded-3 p-3"
            >
              <summary class="fw-semibold mb-2">{{ faq.question }}</summary>
              <p class="mb-0">{{ faq.answer }}</p>
            </details>
          </div>
        </div>
      </section>

      <ContactFormSection
        v-bind="contactEmail ? { contactEmail } : {}"
        :on-submit="handleEmailSubmit"
      />
    </main>
    <Footer :contactCtaEnabled="contactCtaEnabled" @contact="handleChat('landing-escobar-footer')" />
    <ConsentBanner />
    <WhatsAppFab />
  </div>
</template>
