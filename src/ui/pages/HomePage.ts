import {
  getChatEnabled,
  getContactEmail,
  openChat,
  submitContact
} from '@/ui/controllers/contactController'

export function useHomePage() {
  const chatEnabled = getChatEnabled()
  const contactEmail = getContactEmail()

  function handleChat(section: string, href?: string) {
    openChat(section, href)
  }

  function handleEmailSubmit(payload: Parameters<typeof submitContact>[1]) {
    // El componente espera una promesa para feedback, asi que retornamos la llamada
    return submitContact('contacto-formulario', payload)
  }

  return {
    chatEnabled,
    contactEmail,
    handleChat,
    handleEmailSubmit
  }
}
