<script setup lang="ts">
import Navbar from '@/ui/layout/Navbar.vue'
import HeroSection from '@/ui/sections/HeroSection.vue'
import ServiciosSection from '@/ui/sections/ServiciosSection.vue'
import TecnicoACargo from '@/components/TecnicoACargo.vue'
import DecisionFlowSection from '@/ui/sections/DecisionFlowSection.vue'
import PerfilSection from '@/ui/sections/PerfilSection.vue'
import ContactFormSection from '@/ui/features/contact/ContactFormSection.vue'
import SobreProfeBustos from '@/ui/sections/SobreProfeBustos.vue'
import Footer from '@/ui/layout/Footer.vue'
import LegalSection from '@/ui/sections/LegalSection.vue'
import ConsentBanner from '@/ui/features/contact/ConsentBanner.vue'
import WhatsAppFab from '@/ui/features/contact/WhatsAppFab.vue'
import { useHomePage } from './HomePage'

const {
  contactCtaEnabled,
  isContactFormActive,
  isEmailFormActive,
  handleChat,
  handleContactSubmit,
  handleEmailSubmit
} = useHomePage()
</script>

<template>
  <div class="app-shell bg-dark text-white min-vh-100">
    <a class="skip-link" href="#contenido-principal">Saltar al contenido principal</a>
    <Navbar :contactCtaEnabled="contactCtaEnabled" @contact="handleChat('navbar')" />
    <main id="contenido-principal" class="flex-grow-1 with-floating-cta">
      <HeroSection :contactCtaEnabled="contactCtaEnabled" @primary-cta="handleChat('hero', $event)" />
      <ServiciosSection
        :contactCtaEnabled="contactCtaEnabled"
        @contact="handleChat($event.section, $event.href)"
      />
      <TecnicoACargo />
      <DecisionFlowSection />
      <ContactFormSection
        v-if="isContactFormActive"
        section-id="contacto-lead"
        title="Ingreso de contacto"
        subtitle="Dejanos tus datos y te contactamos por el canal más adecuado."
        submit-label="Registrar contacto"
        backend-channel="contact"
        :on-submit="handleContactSubmit"
      />
      <ContactFormSection
        v-if="isEmailFormActive"
        section-id="contacto-mail"
        title="Enviar e-mail"
        subtitle="Enviá tu consulta por correo y te respondemos por email."
        submit-label="Enviar consulta por correo"
        backend-channel="mail"
        :on-submit="handleEmailSubmit"
      />
      <PerfilSection />
      <SobreProfeBustos />
      <LegalSection />
    </main>
    <Footer :contactCtaEnabled="contactCtaEnabled" @contact="handleChat('footer')" />
    <ConsentBanner />
    <WhatsAppFab />
  </div>
</template>
