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
  ProfileContent,
  ServicesContent
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

export interface ProfileContentPort {
  getProfileContent(): ProfileContent
}

export interface LegalContentPort {
  getLegalContent(): LegalContent
}

export interface ConsentContentPort {
  getConsentContent(): ConsentContent
}

export interface ServicesContentPort {
  getServicesContent(): ServicesContent
}
