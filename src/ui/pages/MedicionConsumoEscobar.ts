import {
  getWhatsAppEnabled,
  getContactEmail,
  openWhatsApp,
  submitContact
} from '@/ui/controllers/contactController'

export function useMedicionConsumoEscobar() {
  const contactCtaEnabled = getWhatsAppEnabled()
  const contactEmail = getContactEmail()

  function handleChat(section: string, href?: string) {
    openWhatsApp(section, href)
  }

  function handleEmailSubmit(payload: Parameters<typeof submitContact>[1]) {
    return submitContact('landing-escobar-contacto', payload)
  }

  return {
    contactCtaEnabled,
    contactEmail,
    handleChat,
    handleEmailSubmit
  }
}
