<script setup lang="ts">
import { useWhatsAppRedirectView } from './WhatsAppRedirectView'

const { whatsappHref } = useWhatsAppRedirectView()
</script>

<template>
  <main class="wa-redirect min-vh-100 d-flex align-items-center py-4">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-sm-10 col-md-8 col-lg-6">
          <section class="wa-redirect__card p-4 p-sm-5">
            <p class="wa-redirect__kicker mb-2">DataMaq</p>
            <h1 class="wa-redirect__title h3 mb-3">DataMaq</h1>
            <p class="wa-redirect__text mb-4">
              Si no se abrió WhatsApp automáticamente, tocá el botón.
            </p>
            <a
              class="btn wa-redirect__button btn-lg w-100 mb-3"
              :href="whatsappHref"
              target="_blank"
              rel="noopener noreferrer"
            >
              Abrir WhatsApp
            </a>
            <p class="wa-redirect__link mb-0">
              {{ whatsappHref }}
            </p>
          </section>
        </div>
      </div>
    </div>
  </main>
</template>
