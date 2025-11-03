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
</script>

<template>
  <div class="bg-dark text-white min-vh-100">
    <Navbar :chatEnabled="CHAT_ENABLED" :chatUrl="CHAT_URL" />
    <HeroSection :chatEnabled="CHAT_ENABLED" :chatUrl="CHAT_URL" />
    <ServiciosSection />
    <Sobreprofebustos />
    <WhatsappFab @whatsapp="openWhatsApp" />
    <LegalSection />
    <Footer />
  </div>
</template>
