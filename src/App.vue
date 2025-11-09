<script setup lang="ts">
/*
Path: src/App.vue
*/

import { CHAT_ENABLED, openWhatsApp } from './appLogic'
import Navbar from './components/Navbar.vue'
import HeroSection from './components/HeroSection.vue'
import ServiciosSection from './components/ServiciosSection.vue'
import Sobreprofebustos from './components/SobreProfeBustos.vue'
import WhatsappFab from './components/WhatsappFab.vue'
import Footer from './components/Footer.vue'
import LegalSection from './components/LegalSection.vue'

function handleWhatsapp(section: string) {
  openWhatsApp(section)
}
</script>

<template>
  <div class="app-shell bg-dark text-white min-vh-100">
    <a class="skip-link" href="#contenido-principal">Saltar al contenido principal</a>
    <Navbar :chatEnabled="CHAT_ENABLED" @contact="handleWhatsapp('navbar')" />
    <main id="contenido-principal" class="flex-grow-1">
      <HeroSection :chatEnabled="CHAT_ENABLED" @primary-cta="handleWhatsapp('hero')" />
      <ServiciosSection
        :chatEnabled="CHAT_ENABLED"
        @contact="handleWhatsapp($event)"
      />
      <Sobreprofebustos />
      <LegalSection />
    </main>
    <Footer />
    <WhatsappFab v-if="CHAT_ENABLED" @whatsapp="handleWhatsapp('fab')" />
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
