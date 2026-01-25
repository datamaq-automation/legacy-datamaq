/*
Path: src/domain/seo/types.ts
*/

import type { ServiceCardContent } from '@/domain/types/content'

export type BusinessInfo = {
  name: string
  telephone?: string
  email?: string
  street?: string
  locality?: string
  region?: string
  postalCode?: string
  country?: string
  lat?: number
  lng?: number
  whatsapp?: string
  areaServed?: string[]
}

export type SeoMeta = {
  title: string
  description: string
  siteUrl: string
  siteName: string
  ogImage: string
  verificationToken?: string
  locale: string
  business: BusinessInfo
  services: ServiceCardContent[]
}
