/*
Path: src/application/ports/Content.ts
*/

import type {
  AboutContent,
  AppContent,
  ConsentContent,
  ContactContent,
  FooterContent,
  HeroContent,
  LegalContent,
  NavbarContent,
  ServicesContent,
  WhatsappFabContent
} from '@/domain/types/content'

export interface ContentPort {
  getContent(): AppContent
}

export interface NavbarContentPort {
  getNavbarContent(): NavbarContent
}

export interface FooterContentPort {
  getFooterContent(): FooterContent
}

export interface ContactContentPort {
  getContactContent(): ContactContent
}

export interface HeroContentPort {
  getHeroContent(): HeroContent
}

export interface AboutContentPort {
  getAboutContent(): AboutContent
}

export interface LegalContentPort {
  getLegalContent(): LegalContent
}

export interface ConsentContentPort {
  getConsentContent(): ConsentContent
}

export interface WhatsappFabContentPort {
  getWhatsappFabContent(): WhatsappFabContent
}

export interface ServicesContentPort {
  getServicesContent(): ServicesContent
}
