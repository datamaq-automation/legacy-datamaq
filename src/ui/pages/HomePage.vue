<script setup lang="ts">
import Navbar from '@/ui/layout/Navbar.vue'
import HeroSection from '@/ui/sections/HeroSection.vue'
import ServiciosSection from '@/ui/sections/ServiciosSection.vue'
import PerfilSection from '@/ui/sections/PerfilSection.vue'
import ContactFormSection from '@/ui/features/contact/ContactFormSection.vue'
import SobreProfeBustos from '@/ui/sections/SobreProfeBustos.vue'
import Footer from '@/ui/layout/Footer.vue'
import LegalSection from '@/ui/sections/LegalSection.vue'
import ConsentBanner from '@/ui/features/contact/ConsentBanner.vue'
import { useHomePage } from './HomePage'

const {
  chatEnabled,
  contactEmail,
  handleChat,
  handleEmailSubmit
} = useHomePage()
</script>

<template>
  <div class="app-shell bg-dark text-white min-vh-100">
    <a class="skip-link" href="#contenido-principal">Saltar al contenido principal</a>
    <Navbar :chatEnabled="chatEnabled" @contact="handleChat('navbar')" />
    <main id="contenido-principal" class="flex-grow-1 with-floating-cta">
      <HeroSection :chatEnabled="chatEnabled" @primary-cta="handleChat('hero')" />
      <ServiciosSection
        :chatEnabled="chatEnabled"
        @contact="handleChat($event)"
      />
      <PerfilSection />
      <ContactFormSection
        v-bind="contactEmail ? { contactEmail } : {}"
        :on-submit="handleEmailSubmit"
      />
      <SobreProfeBustos />
      <LegalSection />
    </main>
    <Footer />
    <ConsentBanner />
  </div>
</template>
