import {
  getChatEnabled,
  getContactEmail,
  openChat,
  submitContact
} from '@/ui/controllers/contactController'

export function useMedicionConsumoEscobar() {
  const chatEnabled = getChatEnabled()
  const contactEmail = getContactEmail()

  function handleChat(section: string) {
    openChat(section)
  }

  function handleEmailSubmit(payload: Parameters<typeof submitContact>[1]) {
    return submitContact('landing-escobar-contacto', payload)
  }

  return {
    chatEnabled,
    contactEmail,
    handleChat,
    handleEmailSubmit
  }
}
