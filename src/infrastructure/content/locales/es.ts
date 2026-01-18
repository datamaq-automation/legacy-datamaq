import type { AppContent } from '@/domain/types/content'
import { aboutData } from '../sections/aboutData'
import { consentData } from '../sections/consentData'
import { contactData, whatsappFabData } from '../sections/contactData'
import { footerData } from '../sections/footerData'
import { heroData } from '../sections/heroData'
import { legalData } from '../sections/legalData'
import { navbarData } from '../sections/navbarData'
import { servicesData } from '../sections/servicesData'

export const es: AppContent = {
  hero: heroData,
  services: servicesData,
  about: aboutData,
  navbar: navbarData,
  footer: footerData,
  legal: legalData,
  contact: contactData,
  consent: consentData,
  whatsappFab: whatsappFabData
}
