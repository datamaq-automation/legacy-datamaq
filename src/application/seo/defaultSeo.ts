/*
Path: src/application/seo/defaultSeo.ts
*/

import type { BusinessInfo, SeoMeta } from '@/domain/seo/types'
import type { ContentPort } from '@/application/ports/Content'
import type { ConfigPort } from '@/application/ports/Config'
import type { LocationProvider } from '@/application/ports/Environment'

export function getDefaultSeo(
  content: ContentPort,
  config: ConfigPort,
  location: LocationProvider
): SeoMeta {
  const fallbackOrigin = getOrigin(location.href())
  const siteUrl = normalize(config.siteUrl) || fallbackOrigin
  const siteName = normalize(config.siteName) || 'Datamaq'
  const description =
    normalize(config.siteDescription) ||
    'Servicios industriales y eficiencia energetica para empresas.'
  const ogImage =
    normalize(config.siteOgImage) ||
    (siteUrl ? `${siteUrl.replace(/\/$/, '')}/og-default.png` : '')
  const verificationToken = normalize(config.gscVerification)
  const locale = normalize(config.siteLocale) || 'es_AR'

  const businessName = normalize(config.businessName) || siteName
  const businessInfo: BusinessInfo = {
    name: businessName,
    country: normalize(config.businessCountry) || 'AR',
    areaServed: buildAreaServed(config)
  }

  const telephone = normalize(config.businessTelephone)
  if (telephone) {
    businessInfo.telephone = telephone
  }

  const email = normalize(config.businessEmail)
  if (email) {
    businessInfo.email = email
  }

  const street = normalize(config.businessStreet)
  if (street) {
    businessInfo.street = street
  }

  const locality = normalize(config.businessLocality)
  if (locality) {
    businessInfo.locality = locality
  }

  const region = normalize(config.businessRegion)
  if (region) {
    businessInfo.region = region
  }

  const postalCode = normalize(config.businessPostalCode)
  if (postalCode) {
    businessInfo.postalCode = postalCode
  }

  const lat = parseNumber(config.businessLat)
  if (typeof lat === 'number') {
    businessInfo.lat = lat
  }

  const lng = parseNumber(config.businessLng)
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

function buildAreaServed(config: ConfigPort): string[] {
  const configured = parseCsv(config.businessArea)
  if (configured.length) {
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
