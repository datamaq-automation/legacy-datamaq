import {
  getWhatsAppEnabled,
  getContactFormActive,
  getEmailFormActive,
  openWhatsApp,
  submitContact,
  submitMail,
  trackSectionScroll
} from '@/ui/controllers/contactController'
import { onMounted, onUnmounted } from 'vue'

export function useHomePage() {
  const contactCtaEnabled = getWhatsAppEnabled()
  const isContactFormActive = getContactFormActive()
  const isEmailFormActive = getEmailFormActive()

  function handleChat(section: string, href?: string) {
    openWhatsApp(section, href)
  }

  function handleEmailSubmit(payload: Parameters<typeof submitMail>[0]) {
    // El componente espera una promesa para feedback, asi que retornamos la llamada
    return submitMail(payload)
  }

  function handleContactSubmit(payload: Parameters<typeof submitContact>[0]) {
    return submitContact(payload)
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
    isContactFormActive,
    isEmailFormActive,
    handleChat,
    handleContactSubmit,
    handleEmailSubmit
  }
}
