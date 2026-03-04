<script setup lang="ts">
import Navbar from '@/ui/layout/Navbar.vue'
import Footer from '@/ui/layout/Footer.vue'
import ConsentBanner from '@/ui/features/contact/ConsentBanner.vue'
import ContactFormSection from '@/ui/features/contact/ContactFormSection.vue'
import WhatsAppFab from '@/ui/features/contact/WhatsAppFab.vue'
import { useMedicionConsumoEscobar } from './MedicionConsumoEscobar'

const {
  pageContent,
  contactContent,
  contactCtaEnabled,
  isContactFormActive,
  handleChat,
  handleContactSubmit
} = useMedicionConsumoEscobar()
</script>

<template>
  <div class="app-shell tw:bg-dm-bg tw:text-dm-text-0 tw:min-h-screen">
    <a class="skip-link" href="#contenido-principal">Saltar al contenido principal</a>
    <Navbar :contactCtaEnabled="contactCtaEnabled" @contact="handleChat('landing-escobar-navbar')" />
    <main id="contenido-principal" class="flex-grow-1 with-floating-cta">
      <section class="tw:py-16" aria-labelledby="escobar-hero-title">
        <div class="tw:container tw:mx-auto tw:px-4">
          <p class="tw:uppercase tw:text-sm tw:font-bold tw:text-dm-primary tw:mb-2">{{ pageContent.eyebrow }}</p>
          <h1 id="escobar-hero-title" class="tw:text-4xl tw:lg:text-5xl tw:font-extrabold tw:mb-6">{{ pageContent.headline }}</h1>
          <p class="tw:text-xl tw:text-dm-text-muted tw:mb-8 tw:max-w-3xl">{{ pageContent.lead }}</p>
          <div class="tw:flex tw:flex-col tw:sm:flex-row tw:gap-4">
            <button
              v-if="contactCtaEnabled"
              type="button"
              class="tw:btn-primary tw:px-8"
              @click="handleChat('landing-escobar-hero')"
            >
              {{ pageContent.primaryCtaLabel }}
            </button>
            <a class="tw:btn-outline tw:px-8" href="#contacto">
              {{ pageContent.secondaryCtaLabel }}
            </a>
          </div>
        </div>
      </section>

      <section class="tw:py-12" aria-labelledby="escobar-summary-title">
        <div class="tw:container tw:mx-auto tw:px-4">
          <h2 id="escobar-summary-title" class="tw:text-2xl tw:font-bold tw:mb-6">{{ pageContent.summaryTitle }}</h2>
          <ul class="tw:text-dm-text-muted tw:space-y-2">
            <li v-for="item in pageContent.summary" :key="item">{{ item }}</li>
          </ul>
        </div>
      </section>

      <section class="tw:py-12" aria-labelledby="escobar-includes-title">
        <div class="tw:container tw:mx-auto tw:px-4">
          <div class="tw:grid tw:grid-cols-1 tw:lg:grid-cols-2 tw:gap-12">
            <div>
              <h2 id="escobar-includes-title" class="tw:text-xl tw:font-bold tw:mb-4">{{ pageContent.includesTitle }}</h2>
              <ul class="tw:text-dm-text-muted tw:space-y-2">
                <li v-for="item in pageContent.includes" :key="item">{{ item }}</li>
              </ul>
            </div>
            <div>
              <h2 class="tw:text-xl tw:font-bold tw:mb-4">{{ pageContent.processTitle }}</h2>
              <ol class="tw:text-dm-text-muted tw:space-y-4">
                <li v-for="item in pageContent.processSteps" :key="item">{{ item }}</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section class="tw:py-12" aria-labelledby="escobar-deliverables-title">
        <div class="tw:container tw:mx-auto tw:px-4">
          <h2 id="escobar-deliverables-title" class="tw:text-xl tw:font-bold tw:mb-4">{{ pageContent.deliverablesTitle }}</h2>
          <ul class="tw:text-dm-text-muted tw:space-y-2">
            <li v-for="item in pageContent.deliverables" :key="item">{{ item }}</li>
          </ul>
        </div>
      </section>

      <section class="tw:py-12" aria-labelledby="escobar-faq-title">
        <div class="tw:container tw:mx-auto tw:px-4">
          <h2 id="escobar-faq-title" class="tw:text-xl tw:font-bold tw:mb-6">{{ pageContent.faqTitle }}</h2>
          <div class="tw:flex tw:flex-col tw:gap-4">
            <details
              v-for="faq in pageContent.faqs"
              :key="faq.question"
              class="tw:bg-dm-surface tw:text-dm-text-0 tw:rounded-xl tw:p-6 tw:border tw:border-dm-border"
            >
              <summary class="fw-semibold mb-2">{{ faq.question }}</summary>
              <p class="mb-0">{{ faq.answer }}</p>
            </details>
          </div>
        </div>
      </section>

      <ContactFormSection
        v-if="isContactFormActive"
        section-id="landing-escobar-lead"
        :title="contactContent.title"
        :subtitle="contactContent.subtitle"
        :submit-label="contactContent.submitLabel"
        :on-submit="handleContactSubmit"
      />
    </main>
    <Footer :contactCtaEnabled="contactCtaEnabled" @contact="handleChat('landing-escobar-footer')" />
    <ConsentBanner />
    <WhatsAppFab />
  </div>
</template>
