import type { AppContent, ImageContent } from '@/domain/types/content'

export interface BrandTechnicianContent {
  name: string
  role: string
  photo: ImageContent
  whatsappLabel: string
  unavailableLabel: string
}

export interface BrandContent {
  brandId: string
  brandName: string
  brandAriaLabel: string
  baseOperativa: string
  contactEmail?: string
  contactFormActive: boolean
  emailFormActive: boolean
  whatsappUrl?: string
  whatsappQr: {
    phoneE164?: string
    message: string
    sourceTag: string
  }
  technician: BrandTechnicianContent
  equipmentNames: {
    medidorNombre: string
    automateNombre: string
  }
}

export interface SeoBusinessContent {
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
  areaServed: string[]
}

export interface SeoContent {
  siteUrl: string
  siteName: string
  siteDescription: string
  siteOgImage: string
  siteLocale: string
  gscVerification?: string
  business: SeoBusinessContent
}

export interface SiteSnapshot {
  content: AppContent
  brand: BrandContent
  seo: SeoContent
}
