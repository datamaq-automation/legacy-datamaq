import { useContainer } from '@/di/container'
import { mapNavbarLinks, toHomeSectionRoute } from './landingNavigation'
import { useContactPageActions } from './useContactPageActions'

export function useContactPage() {
  const { content } = useContainer()
  const navbar = content.getNavbarContent()
  const footer = content.getFooterContent()
  const legal = content.getLegalContent()
  const contact = content.getContactContent()
  const contactPage = content.getContactPageContent()
  const {
    contactCtaEnabled,
    isContactFormActive,
    footerYear,
    whatsappHref,
    isExternalWhatsappHref,
    handleChat,
    handleContactSubmit
  } = useContactPageActions()
  const homeLinks = mapNavbarLinks(navbar).filter((link) => link.href !== '#contacto')
  const contactIntroLinks = [
    { label: contactPage.introLinks.services, to: toHomeSectionRoute('#servicios') },
    { label: contactPage.introLinks.profile, to: toHomeSectionRoute('#perfil') },
    { label: contactPage.introLinks.faq, to: toHomeSectionRoute('#faq') }
  ]

  return {
    navbar,
    footer,
    legal,
    contact,
    contactPage,
    contactCtaEnabled,
    isContactFormActive,
    homeLinks,
    footerYear,
    whatsappHref,
    isExternalWhatsappHref,
    contactIntroLinks,
    handleChat,
    handleContactSubmit
  }
}
