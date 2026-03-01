import { useContainer } from '@/di/container'
import {
  getContactFormActive,
  getEmailFormActive,
  getWhatsAppEnabled,
  getWhatsAppHref,
  openWhatsApp,
  submitContact,
  submitMail
} from '@/ui/controllers/contactController'
import { computed } from 'vue'
import { mapNavbarLinks, toHomeSectionRoute } from './landingNavigation'

export function useContactPage() {
  const { content } = useContainer()
  const navbar = content.getNavbarContent()
  const footer = content.getFooterContent()
  const legal = content.getLegalContent()
  const contact = content.getContactContent()
  const contactCtaEnabled = getWhatsAppEnabled()
  const isContactFormActive = getContactFormActive()
  const isEmailFormActive = getEmailFormActive()
  const navbarLinks = mapNavbarLinks(navbar)
  const homeLinks = navbarLinks.filter((link) => link.href !== '#contacto')
  const footerYear = new Date().getFullYear()
  const whatsappHref = computed(() => getWhatsAppHref() ?? '#contacto')
  const isExternalWhatsappHref = computed(() => /^https?:\/\//.test(whatsappHref.value))
  const contactIntroLinks = [
    { label: 'Servicios', to: toHomeSectionRoute('#servicios') },
    { label: 'Perfil tecnico', to: toHomeSectionRoute('#perfil') },
    { label: 'FAQ', to: toHomeSectionRoute('#faq') }
  ]

  function handleChat(section: string, href?: string) {
    openWhatsApp(section, href)
  }

  function handleEmailSubmit(payload: Parameters<typeof submitMail>[0]) {
    return submitMail(payload)
  }

  function handleContactSubmit(payload: Parameters<typeof submitContact>[0]) {
    return submitContact(payload)
  }

  return {
    navbar,
    footer,
    legal,
    contact,
    contactCtaEnabled,
    isContactFormActive,
    isEmailFormActive,
    navbarLinks,
    homeLinks,
    footerYear,
    whatsappHref,
    isExternalWhatsappHref,
    contactIntroLinks,
    handleChat,
    handleContactSubmit,
    handleEmailSubmit
  }
}
