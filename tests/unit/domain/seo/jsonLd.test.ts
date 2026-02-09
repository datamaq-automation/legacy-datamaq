import { describe, expect, it } from 'vitest'
import {
  buildLocalBusinessJsonLd,
  buildOfferCatalogJsonLd,
  buildOrganizationJsonLd,
  buildWebsiteJsonLd
} from '@/domain/seo/jsonLd'
import type { SeoMeta } from '@/domain/seo/types'

const service = {
  id: 'service-1',
  title: 'Servicio A',
  description: 'Descripcion A',
  subtitle: 'Subtitulo',
  media: { src: '/img.png', alt: 'alt' },
  items: ['item'],
  cta: { label: 'Contactar', section: 'hero', action: 'chat' },
  unavailableMessage: 'No disponible'
}

const baseMeta: SeoMeta = {
  title: 'Datamaq',
  description: 'Servicios industriales',
  siteUrl: 'https://example.com',
  siteName: 'Datamaq',
  ogImage: 'https://example.com/og.png',
  locale: 'es_AR',
  business: { name: 'Datamaq' },
  services: []
}

describe('jsonLd builders', () => {
  it('builds organization and website json-ld', () => {
    expect(buildOrganizationJsonLd(baseMeta)).toEqual({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Datamaq',
      url: 'https://example.com'
    })
    expect(buildWebsiteJsonLd(baseMeta)).toEqual({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Datamaq',
      url: 'https://example.com'
    })
  })

  it('returns null for local business when siteUrl is empty', () => {
    expect(buildLocalBusinessJsonLd({ ...baseMeta, siteUrl: '' })).toBeNull()
  })

  it('builds local business json-ld with address, geo, and services', () => {
    const meta: SeoMeta = {
      ...baseMeta,
      business: {
        name: 'Datamaq',
        telephone: '+54 11 1111',
        email: 'contact@example.com',
        street: 'Main 123',
        locality: 'Tigre',
        region: 'Buenos Aires',
        postalCode: '1648',
        country: 'AR',
        lat: -34.5,
        lng: -58.6,
        areaServed: ['AR', 'UY']
      },
      services: [service]
    }

    const jsonLd = buildLocalBusinessJsonLd(meta)
    expect(jsonLd).toEqual(
      expect.objectContaining({
        '@context': 'https://schema.org',
        '@type': 'ProfessionalService',
        name: 'Datamaq',
        url: 'https://example.com',
        telephone: '+54 11 1111',
        email: 'contact@example.com',
        areaServed: ['AR', 'UY'],
        service: [
          {
            '@type': 'Service',
            name: 'Servicio A',
            description: 'Descripcion A'
          }
        ]
      })
    )
    expect((jsonLd as Record<string, unknown>).address).toEqual({
      '@type': 'PostalAddress',
      streetAddress: 'Main 123',
      addressLocality: 'Tigre',
      addressRegion: 'Buenos Aires',
      postalCode: '1648',
      addressCountry: 'AR'
    })
    expect((jsonLd as Record<string, unknown>).geo).toEqual({
      '@type': 'GeoCoordinates',
      latitude: -34.5,
      longitude: -58.6
    })
  })

  it('builds offer catalog when services exist', () => {
    const meta: SeoMeta = {
      ...baseMeta,
      services: [service]
    }

    const catalog = buildOfferCatalogJsonLd(meta)
    expect(catalog).toEqual(
      expect.objectContaining({
        '@context': 'https://schema.org',
        '@type': 'OfferCatalog',
        name: 'Datamaq - Servicios'
      })
    )
    const item = (catalog as Record<string, unknown>).itemListElement as Array<
      Record<string, unknown>
    >
    expect(item[0]).toEqual({
      '@type': 'Offer',
      order: 1,
      itemOffered: {
        '@type': 'Service',
        name: 'Servicio A',
        description: 'Descripcion A'
      }
    })
  })

  it('returns null offer catalog when services are empty', () => {
    expect(buildOfferCatalogJsonLd(baseMeta)).toBeNull()
  })
})
