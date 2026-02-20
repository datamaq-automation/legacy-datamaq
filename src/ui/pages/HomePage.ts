import {
  getWhatsAppEnabled,
  getContactEmail,
  openWhatsApp,
  submitContact,
  submitMail,
  trackSectionScroll
} from '@/ui/controllers/contactController'
import { onMounted, onUnmounted } from 'vue'

export function useHomePage() {
  const contactCtaEnabled = getWhatsAppEnabled()
  const contactEmail = getContactEmail()

  function handleChat(section: string, href?: string) {
    openWhatsApp(section, href)
  }

  function handleEmailSubmit(payload: Parameters<typeof submitMail>[1]) {
    // El componente espera una promesa para feedback, asi que retornamos la llamada
    return submitMail('contacto-formulario', payload)
  }

  function handleContactSubmit(payload: Parameters<typeof submitContact>[1]) {
    return submitContact('contacto-lead-formulario', payload)
  }

  function handleHashChange() {
    if (typeof window === 'undefined') {
      return
    }
    if (!window.location.hash) {
      return
    }
    trackSectionScroll(window.location.hash)
  }

  onMounted(() => {
    if (typeof window === 'undefined') {
      return
    }
    window.addEventListener('hashchange', handleHashChange)
  })

  onUnmounted(() => {
    if (typeof window === 'undefined') {
      return
    }
    window.removeEventListener('hashchange', handleHashChange)
  })

  return {
    contactCtaEnabled,
    contactEmail,
    handleChat,
    handleContactSubmit,
    handleEmailSubmit
  }
}
