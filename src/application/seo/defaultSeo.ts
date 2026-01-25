/*
Path: src/application/seo/defaultSeo.ts
*/

import type { BusinessInfo, SeoMeta } from '@/domain/seo/types'
import { content } from '@/infrastructure/content/content'

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
    country: normalize(import.meta.env.VITE_BUSINESS_COUNTRY) || 'AR',
    areaServed: buildAreaServed()
  }

  const telephone = normalize(import.meta.env.VITE_BUSINESS_TELEPHONE)
  if (telephone) {
    businessInfo.telephone = telephone
  }

  const email = normalize(import.meta.env.VITE_BUSINESS_EMAIL)
  if (email) {
    businessInfo.email = email
  }

  const street = normalize(import.meta.env.VITE_BUSINESS_STREET)
  if (street) {
    businessInfo.street = street
  }

  const locality = normalize(import.meta.env.VITE_BUSINESS_LOCALITY)
  if (locality) {
    businessInfo.locality = locality
  }

  const region = normalize(import.meta.env.VITE_BUSINESS_REGION)
  if (region) {
    businessInfo.region = region
  }

  const postalCode = normalize(import.meta.env.VITE_BUSINESS_POSTAL_CODE)
  if (postalCode) {
    businessInfo.postalCode = postalCode
  }

  const lat = parseNumber(import.meta.env.VITE_BUSINESS_LAT)
  if (typeof lat === 'number') {
    businessInfo.lat = lat
  }

  const lng = parseNumber(import.meta.env.VITE_BUSINESS_LNG)
  if (typeof lng === 'number') {
    businessInfo.lng = lng
  }

  const whatsapp = normalize(import.meta.env.VITE_WHATSAPP_NUMBER)
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
