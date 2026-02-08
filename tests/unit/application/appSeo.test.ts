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
})
