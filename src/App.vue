<script setup lang="ts">
/*
Path: src/App.vue
*/

import config from '../config.json'

import { ref } from 'vue'
import Navbar from './components/Navbar.vue'
import HeroSection from './components/HeroSection.vue'
import ServiciosSection from './components/ServiciosSection.vue'
import Sobreprofebustos from './components/SobreProfeBustos.vue'
import WhatsappFab from './components/WhatsappFab.vue'
import Footer from './components/Footer.vue'
import LegalSection from './components/LegalSection.vue'

const WHATSAPP_NUMBER = config.WHATSAPP_NUMBER
const CHAT_URL = config.CHAT_URL
const API_BASE_URL = config.API_BASE_URL

const PRESET_MSG = "Vengo de la página web, quiero más información."
const CHAT_ENABLED = false

// Estado para mensajes al usuario
const conversionMsg = ref<string | null>(null);

function openWhatsApp(): void {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(PRESET_MSG)}`;
  window.open(url, "_blank", "noopener");
  (window as any).dataLayer?.push({ event: "conversion_whatsapp_click" });
  window.dispatchEvent(new CustomEvent("conversion:whatsapp_click"));

  fetch(`${API_BASE_URL}/registrar_conversion.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tipo: 'whatsapp',
      timestamp: new Date().toISOString(),
      seccion: 'fab',
      web: window.location.href
    })
  })
    .then((response) => {
      return response.json().then((data) => {
        if (response.ok && data.success) {
          console.log("¡Conversión registrada correctamente!");
        } else if (response.status === 429) {
          conversionMsg.value = "Conversión duplicada detectada. Espera unos segundos antes de volver a intentar.";
        } else if (response.status === 400) {
          conversionMsg.value = "Datos incompletos o formato inválido.";
        } else if (response.status === 500) {
          conversionMsg.value = "Ocurrió un error técnico. Intenta nuevamente más tarde.";
        } else {
          conversionMsg.value = "No se pudo registrar la conversión. Intenta nuevamente.";
        }
        // Opcional: loguear el error para análisis
        if (data.error) {
          console.error("Error conversión:", data.error);
        }
      });
    })
    .catch((err) => {
      conversionMsg.value = "Error de red al registrar conversión.";
      console.error("Error de red conversión:", err);
    });
}
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
