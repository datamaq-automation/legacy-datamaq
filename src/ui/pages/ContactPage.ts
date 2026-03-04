import { useContainer } from '@/di/container'
import {
  getContactFormActive,
  getWhatsAppEnabled,
  getWhatsAppHref,
  openWhatsApp,
  submitContact
} from '@/ui/controllers/contactController'
import { computed } from 'vue'
import { mapNavbarLinks, toHomeSectionRoute } from './landingNavigation'

export function useContactPage() {
  const { content } = useContainer()
  const navbar = content.getNavbarContent()
  const footer = content.getFooterContent()
  const legal = content.getLegalContent()
  const contact = content.getContactContent()
  const contactPage = content.getContactPageContent()
  const contactCtaEnabled = getWhatsAppEnabled()
  const isContactFormActive = getContactFormActive()
  const navbarLinks = mapNavbarLinks(navbar)
  const homeLinks = navbarLinks.filter((link) => link.href !== '#contacto')
  const footerYear = new Date().getFullYear()
  const whatsappHref = computed(() => getWhatsAppHref() ?? '#contacto')
  const isExternalWhatsappHref = computed(() => /^https?:\/\//.test(whatsappHref.value))
  const contactIntroLinks = [
    { label: contactPage.introLinks.services, to: toHomeSectionRoute('#servicios') },
    { label: contactPage.introLinks.profile, to: toHomeSectionRoute('#perfil') },
    { label: contactPage.introLinks.faq, to: toHomeSectionRoute('#faq') }
  ]

  function handleChat(section: string, href?: string) {
    openWhatsApp(section, href)
  }

  function handleContactSubmit(payload: Parameters<typeof submitContact>[0]) {
    return submitContact(payload)
  }

  return {
    navbar,
    footer,
    legal,
    contact,
    contactPage,
    contactCtaEnabled,
    isContactFormActive,
    navbarLinks,
    homeLinks,
    footerYear,
    whatsappHref,
    isExternalWhatsappHref,
    contactIntroLinks,
    handleChat,
    handleContactSubmit
  }
}
