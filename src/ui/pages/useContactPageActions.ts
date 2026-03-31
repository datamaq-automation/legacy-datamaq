import { computed } from 'vue'
import {
  getContactFormActive,
  getWhatsAppEnabled,
  getWhatsAppHref,
  openWhatsApp,
  submitContact
} from '@/ui/controllers/contactController'

export function useContactPageActions() {
  const contactCtaEnabled = getWhatsAppEnabled()
  const isContactFormActive = getContactFormActive()
  const footerYear = new Date().getFullYear()
  const whatsappHref = computed(() => getWhatsAppHref() ?? '#contacto')
  const isExternalWhatsappHref = computed(() => /^https?:\/\//.test(whatsappHref.value))

  function handleChat(section: string, href?: string) {
    openWhatsApp(section, href)
  }

  function handleContactSubmit(payload: Parameters<typeof submitContact>[0]) {
    return submitContact(payload)
  }

  return {
    contactCtaEnabled,
    isContactFormActive,
    footerYear,
    whatsappHref,
    isExternalWhatsappHref,
    handleChat,
    handleContactSubmit
  }
}
