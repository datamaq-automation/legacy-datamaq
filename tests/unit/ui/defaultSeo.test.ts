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
})
