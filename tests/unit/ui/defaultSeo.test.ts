import { describe, expect, it } from 'vitest'
import {
  buildOrganizationJsonLd,
  buildWebsiteJsonLd,
  getDefaultSeo
} from '@/ui/seo/defaultSeo'
import type { ContentPort, SeoContentPort } from '@/application/ports/Content'
import type { LocationProvider } from '@/application/ports/Environment'
import type { SeoContent } from '@/domain/types/site'

function buildSeoContent(overrides: Partial<SeoContent> = {}): SeoContent {
  return {
    siteUrl: '',
    siteName: '',
    siteDescription: '',
    siteOgImage: '',
    siteLocale: '',
    business: {
      name: '',
      areaServed: []
    },
    ...overrides
  }
}

const contentPort: ContentPort & SeoContentPort = {
  getContent: () =>
    ({
      services: {
        title: 'Servicios',
        cards: []
      }
    }) as ReturnType<ContentPort['getContent']>,
  getSeoContent: () => buildSeoContent()
}

const location: LocationProvider = {
  href: () => 'https://datamaq.com/ruta',
  referrer: () => '',
  search: () => ''
}

describe('defaultSeo', () => {
  it('usa valores de seo remoto y los normaliza', () => {
    const seo = getDefaultSeo(
      {
        ...contentPort,
        getSeoContent: () =>
          buildSeoContent({
            siteUrl: ' https://datamaq.com ',
            siteName: ' Profe ',
            siteDescription: '  Descripcion  ',
            siteOgImage: ' https://datamaq.com/og.png '
          })
      },
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

  it('usa fallbacks cuando seo remoto no esta definido', () => {
    const seo = getDefaultSeo(contentPort, location)

    expect(seo.siteUrl).toBe('https://datamaq.com')
    expect(seo.ogImage).toBe('https://datamaq.com/og-default.png')
    expect(seo.siteName).toBe('Sitio')
    expect(seo.title).toBe('Sitio')
    expect(seo.description).toBe('Servicios industriales y eficiencia energetica para empresas.')
  })

  it('maneja ausencia de href devolviendo campos vacios', () => {
    const seo = getDefaultSeo(contentPort, {
      href: () => '',
      referrer: () => '',
      search: () => ''
    })

    expect(seo.siteUrl).toBe('')
    expect(seo.ogImage).toBe('')
    expect(seo.title).toBe('Sitio')
  })

  it('incluye datos de negocio, verificacion y locale cuando se configuran', () => {
    const seo = getDefaultSeo(
      {
        ...contentPort,
        getSeoContent: () =>
          buildSeoContent({
            siteUrl: ' https://example.com/ ',
            siteName: ' Example ',
            siteDescription: ' Desc ',
            siteOgImage: ' https://example.com/og.png ',
            siteLocale: ' es_ES ',
            gscVerification: ' token ',
            business: {
              name: ' Example Biz ',
              telephone: ' +54 11 1111 ',
              email: ' test@example.com ',
              street: ' Main 123 ',
              locality: ' Tigre ',
              region: ' Buenos Aires ',
              postalCode: ' 1648 ',
              country: ' AR ',
              lat: -34,
              lng: -58.5,
              areaServed: ['Tigre', 'GBA Norte', 'Argentina']
            }
          })
      },
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
})
