import { describe, expect, it } from 'vitest'
import {
  buildOrganizationJsonLd,
  buildWebsiteJsonLd,
  getDefaultSeo
} from '@/ui/seo/defaultSeo'
import type { ContentPort } from '@/application/ports/Content'
import type { ConfigPort } from '@/application/ports/Config'
import type { LocationProvider } from '@/application/ports/Environment'

const contentPort: ContentPort = {
  getContent: () => ({
    services: {
      title: 'Servicios',
      cards: []
    }
  }) as ReturnType<ContentPort['getContent']>
}

const location: LocationProvider = {
  href: () => 'https://datamaq.com/ruta',
  referrer: () => '',
  search: () => ''
}

function buildConfig(overrides: Partial<ConfigPort> = {}): ConfigPort {
  return {
    contactApiUrl: undefined,
    contactEmail: undefined,
    whatsappNumber: undefined,
    whatsappPresetMessage: undefined,
    originVerifySecret: undefined,
    analyticsEnabled: true,
    siteUrl: undefined,
    siteName: undefined,
    siteDescription: undefined,
    siteOgImage: undefined,
    siteLocale: undefined,
    gscVerification: undefined,
    businessName: undefined,
    businessTelephone: undefined,
    businessEmail: undefined,
    businessStreet: undefined,
    businessLocality: undefined,
    businessRegion: undefined,
    businessPostalCode: undefined,
    businessCountry: undefined,
    businessLat: undefined,
    businessLng: undefined,
    businessArea: undefined,
    ...overrides
  }
}

describe('defaultSeo', () => {
  it('usa valores de configuracion y los normaliza', () => {
    const seo = getDefaultSeo(
      contentPort,
      buildConfig({
        siteUrl: ' https://datamaq.com ',
        siteName: ' Profe ',
        siteDescription: '  Descripcion  ',
        siteOgImage: ' https://datamaq.com/og.png '
      }),
      location
    )

    expect(seo).toMatchObject({
      title: 'Profe',
      description: 'Descripcion',
      siteUrl: 'https://datamaq.com',
      siteName: 'Profe',
      ogImage: 'https://datamaq.com/og.png'
    })
    expect(buildOrganizationJsonLd(seo)).toEqual({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Profe',
      url: 'https://datamaq.com'
    })
    expect(buildWebsiteJsonLd(seo)).toEqual({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Profe',
      url: 'https://datamaq.com'
    })
  })

  it('usa fallbacks cuando la configuracion no esta definida', () => {
    const seo = getDefaultSeo(contentPort, buildConfig(), location)

    expect(seo.siteUrl).toBe('https://datamaq.com')
    expect(seo.ogImage).toBe('https://datamaq.com/og-default.png')
    expect(seo.siteName).toBe('Datamaq')
    expect(seo.title).toBe('Datamaq')
    expect(seo.description).toBe('Servicios industriales y eficiencia energetica para empresas.')
  })

  it('maneja ausencia de href devolviendo campos vacios', () => {
    const seo = getDefaultSeo(
      contentPort,
      buildConfig(),
      {
        href: () => '',
        referrer: () => '',
        search: () => ''
      }
    )

    expect(seo.siteUrl).toBe('')
    expect(seo.ogImage).toBe('')
    expect(seo.title).toBe('Datamaq')
  })

  it('incluye datos de negocio, verificacion y locale cuando se configuran', () => {
    const seo = getDefaultSeo(
      contentPort,
      buildConfig({
        siteUrl: ' https://example.com/ ',
        siteName: ' Example ',
        siteDescription: ' Desc ',
        siteOgImage: ' https://example.com/og.png ',
        siteLocale: ' es_ES ',
        gscVerification: ' token ',
        businessName: ' Example Biz ',
        businessTelephone: ' +54 11 1111 ',
        businessEmail: ' test@example.com ',
        businessStreet: ' Main 123 ',
        businessLocality: ' Tigre ',
        businessRegion: ' Buenos Aires ',
        businessPostalCode: ' 1648 ',
        businessCountry: ' AR ',
        businessLat: ' -34.0 ',
        businessLng: ' -58.5 ',
        businessArea: 'Tigre, GBA Norte, , Argentina'
      }),
      location
    )

    expect(seo.siteUrl).toBe('https://example.com')
    expect(seo.siteName).toBe('Example')
    expect(seo.description).toBe('Desc')
    expect(seo.ogImage).toBe('https://example.com/og.png')
    expect(seo.locale).toBe('es_ES')
    expect(seo.verificationToken).toBe('token')
    expect(seo.business).toMatchObject({
      name: 'Example Biz',
      telephone: '+54 11 1111',
      email: 'test@example.com',
      street: 'Main 123',
      locality: 'Tigre',
      region: 'Buenos Aires',
      postalCode: '1648',
      country: 'AR',
      lat: -34,
      lng: -58.5,
      areaServed: ['Tigre', 'GBA Norte', 'Argentina']
    })
  })

  it('omite latitud invalida y conserva longitud valida', () => {
    const seo = getDefaultSeo(
      contentPort,
      buildConfig({
        siteUrl: 'https://example.com',
        businessLat: 'nope',
        businessLng: ' -58.5 '
      }),
      location
    )

    expect(seo.business.lat).toBeUndefined()
    expect(seo.business.lng).toBe(-58.5)
  })
})
