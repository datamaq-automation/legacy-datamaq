<script setup lang="ts">
import Navbar from '@/ui/layout/Navbar.vue'
import Footer from '@/ui/layout/Footer.vue'
import ConsentBanner from '@/ui/features/contact/ConsentBanner.vue'
import WhatsAppFab from '@/ui/features/contact/WhatsAppFab.vue'
import { useThanksView } from './ThanksView'

const { contactCtaEnabled, thanksContent, handleChat, handleGoHome } = useThanksView()
</script>

<template>
  <div class="thanks-view app-shell bg-dark text-white min-vh-100">
    <a class="skip-link" href="#contenido-principal">Saltar al contenido principal</a>
    <Navbar :contactCtaEnabled="contactCtaEnabled" @contact="handleChat" />
    <main
      id="contenido-principal"
      class="flex-grow-1 d-flex align-items-center py-5 thanks-hero"
    >
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-8">
            <div class="card c-ui-card c-ui-card--elevated border-0 shadow-lg bg-body text-body">
              <div class="card-body p-4 p-md-5 text-center">
                <p class="text-uppercase small text-muted mb-2">{{ thanksContent.badge }}</p>
                <h1 class="display-6 fw-bold mb-3">{{ thanksContent.title }}</h1>
                <p class="lead mb-4">{{ thanksContent.subtitle }}</p>
                <div class="d-flex flex-column flex-sm-row justify-content-center gap-3">
                  <button
                    v-if="contactCtaEnabled"
                    type="button"
                    class="btn c-ui-btn c-ui-btn--primary btn-lg"
                    @click="handleChat"
                  >
                    {{ thanksContent.whatsappButtonLabel }}
                  </button>
                  <button
                    type="button"
                    class="btn c-ui-btn c-ui-btn--outline btn-lg"
                    @click="handleGoHome"
                  >
                    {{ thanksContent.goHomeButtonLabel }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    <Footer :contactCtaEnabled="contactCtaEnabled" @contact="handleChat" />
    <ConsentBanner />
    <WhatsAppFab />
  </div>
</template>
