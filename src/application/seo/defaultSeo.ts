/*
Path: src/application/seo/defaultSeo.ts
*/

import type { BusinessInfo, SeoMeta } from '@/domain/seo/types'
import type { ContentPort, SeoContentPort } from '@/application/ports/Content'
import type { LocationProvider } from '@/application/ports/Environment'

export function getDefaultSeo(
  content: ContentPort & SeoContentPort,
  location: LocationProvider
): SeoMeta {
  const seoContent = content.getSeoContent()
  const fallbackOrigin = getOrigin(location.href())
  const siteUrl = normalize(seoContent.siteUrl) || fallbackOrigin
  const siteName = normalize(seoContent.siteName) || 'Sitio'
  const description = normalize(seoContent.siteDescription) || 'Servicios industriales y eficiencia energetica para empresas.'
  const ogImage =
    normalize(seoContent.siteOgImage) ||
    (siteUrl ? `${siteUrl.replace(/\/$/, '')}/og-default.png` : '')
  const verificationToken = normalize(seoContent.gscVerification)
  const locale = normalize(seoContent.siteLocale) || 'es_AR'

  const businessName = normalize(seoContent.business.name) || siteName
  const businessInfo: BusinessInfo = {
    name: businessName,
    country: normalize(seoContent.business.country) || 'AR',
    areaServed: buildAreaServed(seoContent)
  }

  const telephone = normalize(seoContent.business.telephone)
  if (telephone) {
    businessInfo.telephone = telephone
  }

  const email = normalize(seoContent.business.email)
  if (email) {
    businessInfo.email = email
  }

  const street = normalize(seoContent.business.street)
  if (street) {
    businessInfo.street = street
  }

  const locality = normalize(seoContent.business.locality)
  if (locality) {
    businessInfo.locality = locality
  }

  const region = normalize(seoContent.business.region)
  if (region) {
    businessInfo.region = region
  }

  const postalCode = normalize(seoContent.business.postalCode)
  if (postalCode) {
    businessInfo.postalCode = postalCode
  }

  const lat = typeof seoContent.business.lat === 'number' ? seoContent.business.lat : undefined
  if (typeof lat === 'number') {
    businessInfo.lat = lat
  }

  const lng = typeof seoContent.business.lng === 'number' ? seoContent.business.lng : undefined
  if (typeof lng === 'number') {
    businessInfo.lng = lng
  }

  const meta: SeoMeta = {
    title: siteName,
    description,
    siteUrl: siteUrl.replace(/\/$/, ''),
    siteName,
    ogImage,
    locale,
    business: businessInfo,
    services: content.getContent().services.cards
  }

  if (verificationToken) {
    meta.verificationToken = verificationToken
  }

  return meta
}

function buildAreaServed(seoContent: { business: { areaServed?: string[] } }): string[] {
  const configured = seoContent.business.areaServed?.map((item) => item.trim()).filter(Boolean) ?? []
  if (configured.length > 0) {
    return configured
  }
  return ['GBA Norte', 'Argentina']
}

function getOrigin(href: string): string {
  if (!href) {
    return ''
  }
  try {
    return new URL(href).origin
  } catch {
    return ''
  }
}

function normalize(value: string | undefined): string | undefined {
  const trimmed = value?.trim()
  return trimmed ? trimmed : undefined
}
