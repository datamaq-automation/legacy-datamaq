import {
  getWhatsAppEnabled,
  getContactEmail,
  openWhatsApp,
  submitContact
} from '@/ui/controllers/contactController'

export function useHomePage() {
  const contactCtaEnabled = getWhatsAppEnabled()
  const contactEmail = getContactEmail()

  function handleChat(section: string, href?: string) {
    openWhatsApp(section, href)
  }

  function handleEmailSubmit(payload: Parameters<typeof submitContact>[1]) {
    // El componente espera una promesa para feedback, asi que retornamos la llamada
    return submitContact('contacto-formulario', payload)
  }

  return {
    contactCtaEnabled,
    contactEmail,
    handleChat,
    handleEmailSubmit
  }
}
