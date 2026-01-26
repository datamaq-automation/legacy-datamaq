import { ref } from 'vue'
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
import {
  buildPrequalificationMessage,
  type PrequalificationPayload
} from '@/ui/features/contact/prequalification'

export function useHomePage() {
  const chatEnabled = getChatEnabled()
  const contactEmail = getContactEmail()
  const prequalOpen = ref(false)
  const prequalSection = ref('hero')

  function handleWhatsapp(section: string) {
    prequalSection.value = section
    prequalOpen.value = true
  }

  function handleEmailSubmit(payload: Parameters<typeof submitContact>[1]) {
    // El componente espera una promesa para feedback, asi que retornamos la llamada
    return submitContact('contacto-formulario', payload)
  }

  function handlePrequalClose() {
    prequalOpen.value = false
  }

  function handlePrequalSubmit(payload: PrequalificationPayload) {
    prequalOpen.value = false
    const message = buildPrequalificationMessage(payload)
    openWhatsApp(prequalSection.value, message)
  }

  return {
    chatEnabled,
    contactEmail,
    handleWhatsapp,
    handleEmailSubmit,
    prequalOpen,
    handlePrequalClose,
    handlePrequalSubmit
  }
}
