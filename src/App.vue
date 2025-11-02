<script setup lang="ts">
import Navbar from './components/Navbar.vue'
import HeroSection from './components/HeroSection.vue'
import ServiciosSection from './components/ServiciosSection.vue'
import SobreDataMaq from './components/SobreDataMaq.vue' // <-- nuevo import
import WhatsappFab from './components/WhatsappFab.vue'
import Footer from './components/Footer.vue'
import LegalSection from './components/LegalSection.vue'
// === Configuración mínima (reemplazá el número por el tuyo en formato internacional, sin + ni espacios) ===
// Ejemplo AR (CABA): 54911XXXXXXXX — Ver: https://wa.me/<numero>
const WHATSAPP_NUMBER = "54911XXXXXXXX"; // TODO: reemplazar por tu número
const PRESET_MSG = "Vengo de la página web, quiero más información."; // debe coincidir con el SRS

// Habilitá esto cuando esté operativo tu subdominio del bot
const CHAT_ENABLED = false; // TODO: poner true cuando chat.datamaq.com.ar esté listo
const CHAT_URL = "https://chat.datamaq.com.ar";

function openWhatsApp(): void {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(PRESET_MSG)}`;
  window.open(url, "_blank", "noopener");
  // Señalización de conversión (si usás GTM/dataLayer u otro)
  // @see FR-006 — Medición de conversiones
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).dataLayer?.push({ event: "conversion_whatsapp_click" });
  // Fallback: CustomEvent para listeners propios
  window.dispatchEvent(new CustomEvent("conversion:whatsapp_click"));
}
</script>

<template>
  <Navbar :chatEnabled="CHAT_ENABLED" :chatUrl="CHAT_URL" />
  <HeroSection :chatEnabled="CHAT_ENABLED" :chatUrl="CHAT_URL" />
  <ServiciosSection />
  <SobreDataMaq />
  <WhatsappFab @whatsapp="openWhatsApp" />
  <LegalSection />
  <Footer />
</template>
