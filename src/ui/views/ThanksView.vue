<script setup lang="ts">
import { useThanksView } from './ThanksView'

const { chatEnabled, handleWhatsapp, handleGoHome } = useThanksView()
</script>

<template>
  <div class="thanks-view app-shell bg-dark text-white min-vh-100">
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
