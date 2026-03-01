/*
Path: src/application/ports/Content.ts
*/

import type {
  AboutContent,
  AppContent,
  ContactPageContent,
  ConsentContent,
  ContactContent,
  FooterContent,
  HeroContent,
  HomePageContent,
  LegalContent,
  NavbarContent,
  ProfileContent,
  ServicesContent
} from '@/domain/types/content'
import type { BrandContent, SeoContent, SiteSnapshot } from '@/domain/types/site'

export type RemoteContentStatus = 'pending' | 'ready' | 'unavailable' | 'not-required'

export interface ContentPort {
  getContent(): AppContent
}

export interface SiteSnapshotPort {
  getSiteSnapshot(): SiteSnapshot
}

export interface RemoteContentStatusPort {
  getRemoteContentStatus(): RemoteContentStatus
  subscribeRemoteContentStatus(listener: (status: RemoteContentStatus) => void): () => void
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

export interface BrandContentPort {
  getBrandContent(): BrandContent
}

export interface SeoContentPort {
  getSeoContent(): SeoContent
}

export interface HomePageContentPort {
  getHomePageContent(): HomePageContent
}

export interface ContactPageContentPort {
  getContactPageContent(): ContactPageContent
}
