<script setup lang="ts">
import ConsentBanner from '@/ui/features/contact/ConsentBanner.vue'
import WhatsAppFab from '@/ui/features/contact/WhatsAppFab.vue'
import { useThanksView } from './ThanksView'

const { contactCtaEnabled, thanksContent, handleChat, handleGoHome } = useThanksView()
</script>

<template>
  <div class="thanks-view thanks-shell">
    <a class="skip-link" href="#contenido-principal">Saltar al contenido principal</a>

    <main id="contenido-principal" class="thanks-stage" aria-labelledby="thanks-title">
      <header class="thanks-topbar">
        <button
          type="button"
          class="thanks-topbar__close"
          aria-label="Volver al inicio"
          @click="handleGoHome"
        >
          <i class="bi bi-x-lg" aria-hidden="true"></i>
        </button>
        <h2 class="thanks-topbar__title">Solicitud Finalizada</h2>
      </header>

      <section class="thanks-main">
        <div class="thanks-main__icon-wrap" aria-hidden="true">
          <div class="thanks-main__icon-glow"></div>
          <div class="thanks-main__icon">
            <i class="bi bi-check-lg"></i>
          </div>
        </div>

        <p class="thanks-main__badge">{{ thanksContent.badge }}</p>
        <h1 id="thanks-title" class="thanks-main__title">{{ thanksContent.title }}</h1>
        <p class="thanks-main__copy">
          {{ thanksContent.subtitle }}
        </p>
      </section>

      <footer class="thanks-actions">
        <button
          v-if="contactCtaEnabled"
          type="button"
          class="thanks-actions__whatsapp"
          @click="handleChat"
        >
          <i class="bi bi-whatsapp" aria-hidden="true"></i>
          <span>{{ thanksContent.whatsappButtonLabel }}</span>
        </button>

        <button
          type="button"
          class="thanks-actions__home"
          @click="handleGoHome"
        >
          {{ thanksContent.goHomeButtonLabel }}
        </button>
      </footer>

      <div class="thanks-stage__glow" aria-hidden="true"></div>
    </main>

    <ConsentBanner />
    <WhatsAppFab />
  </div>
</template>
