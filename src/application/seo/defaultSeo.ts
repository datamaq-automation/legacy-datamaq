/*
Path: src/application/seo/defaultSeo.ts
*/

import type { BusinessInfo, SeoMeta } from '@/domain/seo/types'
import { content, publicConfig } from '@/infrastructure/content/content'

export function getDefaultSeo(): SeoMeta {
  const siteUrl =
    normalize(publicConfig.siteUrl) || (typeof window !== 'undefined' ? window.location.origin : '')
  const siteName = normalize(publicConfig.siteName) || 'ProfeBustos'
  const description =
    normalize(publicConfig.siteDescription) ||
    'Servicios industriales y eficiencia energetica para empresas.'
  const ogImage =
    normalize(publicConfig.siteOgImage) ||
    (siteUrl ? `${siteUrl.replace(/\/$/, '')}/og-default.png` : '')
  const verificationToken = normalize(publicConfig.gscVerification)
  const locale = normalize(publicConfig.siteLocale) || 'es_AR'

  const businessName = normalize(publicConfig.businessName) || siteName
  const businessInfo: BusinessInfo = {
    name: businessName,
    country: normalize(publicConfig.businessCountry) || 'AR',
    areaServed: buildAreaServed()
  }

  const telephone = normalize(publicConfig.businessTelephone)
  if (telephone) {
    businessInfo.telephone = telephone
  }

  const email = normalize(publicConfig.businessEmail)
  if (email) {
    businessInfo.email = email
  }

  const street = normalize(publicConfig.businessStreet)
  if (street) {
    businessInfo.street = street
  }

  const locality = normalize(publicConfig.businessLocality)
  if (locality) {
    businessInfo.locality = locality
  }

  const region = normalize(publicConfig.businessRegion)
  if (region) {
    businessInfo.region = region
  }

  const postalCode = normalize(publicConfig.businessPostalCode)
  if (postalCode) {
    businessInfo.postalCode = postalCode
  }

  const lat = parseNumber(publicConfig.businessLat)
  if (typeof lat === 'number') {
    businessInfo.lat = lat
  }

  const lng = parseNumber(publicConfig.businessLng)
  if (typeof lng === 'number') {
    businessInfo.lng = lng
  }

  const whatsapp = normalize(publicConfig.whatsappNumber)
  if (whatsapp) {
    businessInfo.whatsapp = whatsapp
  }

  const meta: SeoMeta = {
    title: siteName,
    description,
    siteUrl: siteUrl.replace(/\/$/, ''),
    siteName,
    ogImage,
    locale,
    business: businessInfo,
    services: content.services.cards
  }

  if (verificationToken) {
    meta.verificationToken = verificationToken
  }

  return meta
}

function buildAreaServed(): string[] {
  const configured = parseCsv(publicConfig.businessArea)
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
