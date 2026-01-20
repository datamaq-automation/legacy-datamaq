<script setup lang="ts">
import { onMounted } from 'vue'
import Navbar from '@/ui/layout/Navbar.vue'
import Footer from '@/ui/layout/Footer.vue'
import ConsentBanner from '@/ui/features/contact/ConsentBanner.vue'
import { getChatEnabled, openWhatsApp } from '@/ui/controllers/contactController'
import { navigateTo } from '@/infrastructure/navigation/spaNavigation'
import { trackGenerateLeadOnce } from '@/application/analytics/leadTracking'

const chatEnabled = getChatEnabled()

function handleWhatsapp() {
  openWhatsApp('gracias')
}

function handleGoHome() {
  navigateTo('/')
}

onMounted(() => {
  const pageLocation = typeof window !== 'undefined' ? window.location.href : ''
  trackGenerateLeadOnce({ page_location: pageLocation })
})
</script>

<template>
  <div class="app-shell bg-dark text-white min-vh-100">
    <a class="skip-link" href="#contenido-principal">Saltar al contenido principal</a>
    <Navbar :chatEnabled="chatEnabled" @contact="handleWhatsapp" />
    <main
      id="contenido-principal"
      class="flex-grow-1 d-flex align-items-center py-5 thanks-hero"
    >
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-8">
            <div class="card border-0 shadow-lg bg-body text-body">
              <div class="card-body p-4 p-md-5 text-center">
                <p class="text-uppercase small text-muted mb-2">Formulario enviado</p>
                <h1 class="display-6 fw-bold mb-3">Gracias!</h1>
                <p class="lead mb-4">
                  Recibimos tu consulta. En breve te contactamos.
                </p>
                <div class="d-flex flex-column flex-sm-row justify-content-center gap-3">
                  <button
                    v-if="chatEnabled"
                    type="button"
                    class="btn btn-success btn-lg"
                    @click="handleWhatsapp"
                  >
                    Escribir por WhatsApp
                  </button>
                  <button
                    type="button"
                    class="btn btn-outline-primary btn-lg"
                    @click="handleGoHome"
                  >
                    Volver al inicio
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    <Footer />
    <ConsentBanner />
  </div>
</template>

<style scoped>
.app-shell {
  display: flex;
  flex-direction: column;
}

.thanks-hero {
  background: radial-gradient(circle at top, rgba(13, 110, 253, 0.2), transparent 55%);
}

.skip-link {
  position: absolute;
  left: -999px;
  top: 1rem;
  z-index: 1000;
  padding: 0.75rem 1rem;
  background-color: #0d6efd;
  color: #fff;
  border-radius: 0.5rem;
  transition: left 0.2s ease-in-out;
}

.skip-link:focus {
  left: 1rem;
}
</style>
