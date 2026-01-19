<script setup lang="ts">
import {
  getChatEnabled,
  getContactEmail,
  openWhatsApp,
  submitContact
} from '@/ui/controllers/contactController'
import Navbar from '@/ui/layout/Navbar.vue'
import HeroSection from '@/ui/sections/HeroSection.vue'
import ServiciosSection from '@/ui/sections/ServiciosSection.vue'
import ContactFormSection from '@/ui/features/contact/ContactFormSection.vue'
import SobreProfeBustos from '@/ui/sections/SobreProfeBustos.vue'
import WhatsappFab from '@/ui/features/contact/WhatsappFab.vue'
import Footer from '@/ui/layout/Footer.vue'
import LegalSection from '@/ui/sections/LegalSection.vue'
import ConsentBanner from '@/ui/features/contact/ConsentBanner.vue'

const chatEnabled = getChatEnabled()
const contactEmail = getContactEmail()

function handleWhatsapp(section: string) {
  openWhatsApp(section)
}

function handleEmailSubmit(payload: Parameters<typeof submitContact>[1]) {
  // El componente espera una promesa para feedback, asi que retornamos la llamada
  return submitContact('contacto-formulario', payload)
}
</script>

<template>
  <div class="app-shell bg-dark text-white min-vh-100">
    <a class="skip-link" href="#contenido-principal">Saltar al contenido principal</a>
    <Navbar :chatEnabled="chatEnabled" @contact="handleWhatsapp('navbar')" />
    <main id="contenido-principal" class="flex-grow-1 with-floating-cta">
      <HeroSection :chatEnabled="chatEnabled" @primary-cta="handleWhatsapp('hero')" />
      <ServiciosSection
        :chatEnabled="chatEnabled"
        @contact="handleWhatsapp($event)"
      />
      <ContactFormSection
        :contact-email="contactEmail"
        :on-submit="handleEmailSubmit"
      />
      <SobreProfeBustos />
      <LegalSection />
    </main>
    <Footer />
    <WhatsappFab v-if="chatEnabled" @whatsapp="handleWhatsapp('fab')" />
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
