/*
Path: src/domain/seo/jsonLd.ts
*/

import type { BusinessInfo, SeoMeta } from './types'

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
    entry['telephone'] = business.telephone
  }

  if (business.email) {
    entry['email'] = business.email
  }

  const address = buildAddress(business)
  if (address) {
    entry['address'] = address
  }

  const geo = buildGeo(business)
  if (geo) {
    entry['geo'] = geo
  }

  if (business.whatsapp) {
    entry['contactPoint'] = [
      {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        telephone: business.whatsapp
      }
    ]
  }

  if (business.areaServed?.length) {
    entry['areaServed'] = business.areaServed
  }

  if (meta.services.length) {
    entry['service'] = meta.services.map((service) => ({
      '@type': 'Service',
      name: service.title,
      description: service.description
    }))
  }

  return entry
}

export function buildOfferCatalogJsonLd(meta: SeoMeta): Record<string, unknown> | null {
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
    business.street ||
    business.locality ||
    business.region ||
    business.postalCode ||
    business.country

  if (!hasAddress) {
    return null
  }

  const address: Record<string, string> = {
    '@type': 'PostalAddress'
  }

  if (business.street) {
    address['streetAddress'] = business.street
  }

  if (business.locality) {
    address['addressLocality'] = business.locality
  }

  if (business.region) {
    address['addressRegion'] = business.region
  }

  if (business.postalCode) {
    address['postalCode'] = business.postalCode
  }

  if (business.country) {
    address['addressCountry'] = business.country
  }

  return address
}

function buildGeo(business: BusinessInfo): Record<string, number | string> | null {
  if (typeof business.lat !== 'number' || typeof business.lng !== 'number') {
    return null
  }

  return {
    '@type': 'GeoCoordinates',
    latitude: business.lat,
    longitude: business.lng
  }
}
