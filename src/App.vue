<script setup lang="ts">
/*
Path: src/App.vue
*/

import { CHAT_ENABLED, CONTACT_EMAIL, openWhatsApp, submitEmailContact } from './appLogic'
import Navbar from './components/Navbar.vue'
import HeroSection from './components/HeroSection.vue'
import ServiciosSection from './components/ServiciosSection.vue'
import ContactFormSection from './components/ContactFormSection.vue'
import SobreProfeBustos from './components/SobreProfeBustos.vue'
import WhatsappFab from './components/WhatsappFab.vue'
import Footer from './components/Footer.vue'
import LegalSection from './components/LegalSection.vue'
import ConsentBanner from './components/ConsentBanner.vue'

function handleWhatsapp(section: string) {
  openWhatsApp(section)
}

function handleEmailSubmit(payload: Parameters<typeof submitEmailContact>[1]) {
  // El componente espera una promesa para feedback, así que retornamos la llamada
  return submitEmailContact('contacto-formulario', payload)
}
</script>

<template>
  <div class="app-shell bg-dark text-white min-vh-100">
    <a class="skip-link" href="#contenido-principal">Saltar al contenido principal</a>
    <Navbar :chatEnabled="CHAT_ENABLED" @contact="handleWhatsapp('navbar')" />
    <main id="contenido-principal" class="flex-grow-1 with-floating-cta">
      <HeroSection :chatEnabled="CHAT_ENABLED" @primary-cta="handleWhatsapp('hero')" />
      <ServiciosSection
        :chatEnabled="CHAT_ENABLED"
        @contact="handleWhatsapp($event)"
      />
      <ContactFormSection
        :contact-email="CONTACT_EMAIL"
        :on-submit="handleEmailSubmit"
      />
      <SobreProfeBustos />
      <LegalSection />
    </main>
    <Footer />
    <WhatsappFab v-if="CHAT_ENABLED" @whatsapp="handleWhatsapp('fab')" />
    <ConsentBanner />
  </div>
</template>

<style>
.app-shell {
  display: flex;
  flex-direction: column;
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
