import { describe, expect, it } from 'vitest'
import { buildAppHead } from '@/ui/seo/appSeo'

const baseSeo = {
  title: 'Datamaq',
  description: 'Servicios industriales y eficiencia energetica para empresas.',
  siteUrl: 'https://datamaq.com.ar',
  siteName: 'Datamaq',
  ogImage: 'https://datamaq.com.ar/og.png',
  locale: 'es_AR',
  business: {
    name: 'Datamaq'
  },
  services: []
} as const

describe('buildAppHead', () => {
  it('builds noindex head for thanks page', () => {
    const head = buildAppHead(baseSeo, '/gracias', true)

    expect(head.title).toBe('Gracias | Datamaq')
    expect(head.meta).toEqual(
      expect.arrayContaining([
        { name: 'robots', content: 'noindex,nofollow' }
      ])
    )
  })

  it('builds canonical and og tags for home page', () => {
    const head = buildAppHead(baseSeo, '/', false)

    expect(head.link).toEqual(
      expect.arrayContaining([
        { rel: 'canonical', href: 'https://datamaq.com.ar/' }
      ])
    )
    expect(head.meta).toEqual(
      expect.arrayContaining([
        { property: 'og:title', content: baseSeo.title }
      ])
    )
  })

  it('maneja canonical vacío cuando siteUrl está ausente', () => {
    const seoWithoutUrl = { ...baseSeo, siteUrl: '' }
    const head = buildAppHead(seoWithoutUrl, '/', false)

    expect(head.link).toEqual(
      expect.arrayContaining([{ rel: 'canonical', href: '/' }])
    )
  })

  it('incluye verificacion y scripts cuando hay datos de negocio y servicios', () => {
    const seoWithExtras = {
      ...baseSeo,
      verificationToken: 'token',
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
        areaServed: ['AR']
      },
      services: [
        {
          id: 'service-1',
          title: 'Servicio A',
          description: 'Descripcion A',
          subtitle: 'Subtitulo',
          media: { src: '/img.png', alt: 'alt' },
          items: ['item'],
          cta: { label: 'Contactar', section: 'hero', action: 'whatsapp' }
        }
      ]
    }

    const head = buildAppHead(seoWithExtras, 'contacto', false)

    expect(head.meta).toEqual(
      expect.arrayContaining([
        { name: 'google-site-verification', content: 'token' }
      ])
    )
    expect(head.link).toEqual(
      expect.arrayContaining([
        { rel: 'canonical', href: 'https://datamaq.com.ar/contacto' }
      ])
    )
    const scripts = head.script ?? []
    expect(scripts).toHaveLength(4)
    const payloads = scripts.map((entry) => JSON.parse(String(entry.children)))
    expect(payloads.some((entry) => entry['@type'] === 'ProfessionalService')).toBe(
      true
    )
    expect(payloads.some((entry) => entry['@type'] === 'OfferCatalog')).toBe(true)
  })
})
