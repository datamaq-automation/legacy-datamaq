<script setup lang="ts">
/*
Path: src/App.vue
*/

import {
  CHAT_URL,
  CHAT_ENABLED,
  openWhatsApp
} from './appLogic'
import Navbar from './components/Navbar.vue'
import HeroSection from './components/HeroSection.vue'
import ServiciosSection from './components/ServiciosSection.vue'
import Sobreprofebustos from './components/SobreProfeBustos.vue'
import WhatsappFab from './components/WhatsappFab.vue'
import Footer from './components/Footer.vue'
import LegalSection from './components/LegalSection.vue'

function handleHeroPrimaryCta() {
  if (CHAT_ENABLED) {
    openWhatsApp('hero')
  } else {
    window.location.href = 'mailto:contacto@profebustos.com.ar?subject=Diagn%C3%B3stico%20energ%C3%A9tico'
  }
}

function handleWhatsappFab() {
  openWhatsApp('fab')
}
</script>

<template>
  <div class="bg-dark text-white min-vh-100">
    <Navbar :chatEnabled="CHAT_ENABLED" :chatUrl="CHAT_URL" />
    <HeroSection
      :chatEnabled="CHAT_ENABLED"
      :chatUrl="CHAT_URL"
      @primary-cta="handleHeroPrimaryCta"
    />
    <ServiciosSection />
    <Sobreprofebustos />
    <WhatsappFab @whatsapp="handleWhatsappFab" />
    <LegalSection />
    <Footer />
  </div>
</template>
