import {
  getWhatsAppEnabled,
  getContactEmail,
  openWhatsApp,
  submitMail
} from '@/ui/controllers/contactController'

export function useMedicionConsumoEscobar() {
  const contactCtaEnabled = getWhatsAppEnabled()
  const contactEmail = getContactEmail()

  function handleChat(section: string, href?: string) {
    openWhatsApp(section, href)
  }

  function handleEmailSubmit(payload: Parameters<typeof submitMail>[1]) {
    return submitMail('landing-escobar-contacto', payload)
  }

  return {
    contactCtaEnabled,
    contactEmail,
    handleChat,
    handleEmailSubmit
  }
}
