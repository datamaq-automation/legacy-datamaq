import {
  getWhatsAppEnabled,
  getContactEmail,
  openWhatsApp,
  submitContact,
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

  function handleContactSubmit(payload: Parameters<typeof submitContact>[1]) {
    return submitContact('landing-escobar-lead', payload)
  }

  return {
    contactCtaEnabled,
    contactEmail,
    handleChat,
    handleContactSubmit,
    handleEmailSubmit
  }
}
