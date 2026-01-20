import {
  getChatEnabled,
  getContactEmail,
  openWhatsApp,
  submitContact
} from '@/ui/controllers/contactController'
import './HomePage.css'
import Navbar from '@/ui/layout/Navbar.vue'
import HeroSection from '@/ui/sections/HeroSection.vue'
import ServiciosSection from '@/ui/sections/ServiciosSection.vue'
import ContactFormSection from '@/ui/features/contact/ContactFormSection.vue'
import SobreProfeBustos from '@/ui/sections/SobreProfeBustos.vue'
import WhatsappFab from '@/ui/features/contact/WhatsappFab.vue'
import Footer from '@/ui/layout/Footer.vue'
import LegalSection from '@/ui/sections/LegalSection.vue'
import ConsentBanner from '@/ui/features/contact/ConsentBanner.vue'

export function useHomePage() {
  const chatEnabled = getChatEnabled()
  const contactEmail = getContactEmail()

  function handleWhatsapp(section: string) {
    openWhatsApp(section)
  }

  function handleEmailSubmit(payload: Parameters<typeof submitContact>[1]) {
    // El componente espera una promesa para feedback, asi que retornamos la llamada
    return submitContact('contacto-formulario', payload)
  }

  return {
    chatEnabled,
    contactEmail,
    handleWhatsapp,
    handleEmailSubmit
  }
}
