import type { ServiceCardContent } from '@/domain/types/content'
import { content } from '@/infrastructure/content/content'

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

export function getDefaultSeo(): SeoMeta {
  const siteUrl =
    normalize(import.meta.env.VITE_SITE_URL) ||
    (typeof window !== 'undefined' ? window.location.origin : '')
  const siteName = normalize(import.meta.env.VITE_SITE_NAME) || 'ProfeBustos'
  const description =
    normalize(import.meta.env.VITE_SITE_DESCRIPTION) ||
    'Servicios industriales y eficiencia energetica para empresas.'
  const ogImage =
    normalize(import.meta.env.VITE_SITE_OG_IMAGE) ||
    (siteUrl ? `${siteUrl.replace(/\/$/, '')}/og-default.png` : '')
  const verificationToken = normalize(import.meta.env.VITE_GSC_VERIFICATION)
  const locale = normalize(import.meta.env.VITE_SITE_LOCALE) || 'es_AR'

  const businessName = normalize(import.meta.env.VITE_BUSINESS_NAME) || siteName
  const businessInfo: BusinessInfo = {
    name: businessName,
    telephone: normalize(import.meta.env.VITE_BUSINESS_TELEPHONE),
    email: normalize(import.meta.env.VITE_BUSINESS_EMAIL),
    street: normalize(import.meta.env.VITE_BUSINESS_STREET),
    locality: normalize(import.meta.env.VITE_BUSINESS_LOCALITY),
    region: normalize(import.meta.env.VITE_BUSINESS_REGION),
    postalCode: normalize(import.meta.env.VITE_BUSINESS_POSTAL_CODE),
    country: normalize(import.meta.env.VITE_BUSINESS_COUNTRY) || 'AR',
    lat: parseNumber(import.meta.env.VITE_BUSINESS_LAT),
    lng: parseNumber(import.meta.env.VITE_BUSINESS_LNG),
    whatsapp: normalize(import.meta.env.VITE_WHATSAPP_NUMBER),
    areaServed: buildAreaServed()
  }

  return {
    title: siteName,
    description,
    siteUrl: siteUrl.replace(/\/$/, ''),
    siteName,
    ogImage,
    verificationToken,
    locale,
    business: businessInfo,
    services: content.services.cards
  }
}

export function buildOrganizationJsonLd(meta: SeoMeta): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: meta.siteName,
    url: meta.siteUrl
  }
}

export function buildWebsiteJsonLd(meta: SeoMeta): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: meta.siteName,
    url: meta.siteUrl
  }
}

export function buildLocalBusinessJsonLd(meta: SeoMeta): Record<string, unknown> | null {
  if (!meta.siteUrl) {
    return null
  }

  const business = meta.business
  const entry: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: business.name,
    url: meta.siteUrl
  }

  if (business.telephone) {
    entry.telephone = business.telephone
  }

  if (business.email) {
    entry.email = business.email
  }

  const address = buildAddress(business)
  if (address) {
    entry.address = address
  }

  const geo = buildGeo(business)
  if (geo) {
    entry.geo = geo
  }

  if (business.whatsapp) {
    entry.contactPoint = [
      {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        telephone: business.whatsapp
      }
    ]
  }

  if (business.areaServed?.length) {
    entry.areaServed = business.areaServed
  }

  if (meta.services.length) {
    entry.service = meta.services.map((service) => ({
      '@type': 'Service',
      name: service.title,
      description: service.description
    }))
  }

  return entry
}

export function buildOfferCatalogJsonLd(
  meta: SeoMeta
): Record<string, unknown> | null {
  if (!meta.services.length) {
    return null
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    name: `${meta.siteName} - Servicios`,
    itemListElement: meta.services.map((service, index) => ({
      '@type': 'Offer',
      order: index + 1,
      itemOffered: {
        '@type': 'Service',
        name: service.title,
        description: service.description
      }
    }))
  }
}

function buildAddress(business: BusinessInfo): Record<string, unknown> | null {
  const hasAddress =
    business.street || business.locality || business.region || business.postalCode || business.country

  if (!hasAddress) {
    return null
  }

  const address: Record<string, string> = {
    '@type': 'PostalAddress'
  }

  if (business.street) {
    address.streetAddress = business.street
  }

  if (business.locality) {
    address.addressLocality = business.locality
  }

  if (business.region) {
    address.addressRegion = business.region
  }

  if (business.postalCode) {
    address.postalCode = business.postalCode
  }

  if (business.country) {
    address.addressCountry = business.country
  }

  return address
}

function buildGeo(business: BusinessInfo): Record<string, number> | null {
  if (typeof business.lat !== 'number' || typeof business.lng !== 'number') {
    return null
  }

  return {
    '@type': 'GeoCoordinates',
    latitude: business.lat,
    longitude: business.lng
  }
}

function buildAreaServed(): string[] {
  const configured = parseCsv(import.meta.env.VITE_BUSINESS_AREA)
  if (configured.length) {
    return configured
  }
  return ['GBA Norte', 'Argentina']
}

function parseCsv(value: string | undefined): string[] {
  if (!value) {
    return []
  }
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function parseNumber(value: string | undefined): number | undefined {
  if (!value) {
    return undefined
  }
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

function normalize(value: string | undefined): string | undefined {
  const trimmed = value?.trim()
  return trimmed ? trimmed : undefined
}
