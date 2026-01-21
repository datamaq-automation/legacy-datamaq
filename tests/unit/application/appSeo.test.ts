import { describe, expect, it } from 'vitest'
import { buildAppHead } from '@/ui/seo/appSeo'

const baseSeo = {
  title: 'ProfeBustos',
  description: 'Servicios industriales y eficiencia energetica para empresas.',
  siteUrl: 'https://profebustos.com.ar',
  siteName: 'ProfeBustos',
  ogImage: 'https://profebustos.com.ar/og.png'
} as const

describe('buildAppHead', () => {
  it('builds noindex head for thanks page', () => {
    const head = buildAppHead(baseSeo, true)

    expect(head.title).toBe('Gracias | ProfeBustos')
    expect(head.meta).toEqual(
      expect.arrayContaining([
        { name: 'robots', content: 'noindex,nofollow' }
      ])
    )
  })

  it('builds canonical and og tags for home page', () => {
    const head = buildAppHead(baseSeo, false)

    expect(head.link).toEqual(
      expect.arrayContaining([
        { rel: 'canonical', href: 'https://profebustos.com.ar/' }
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
    const head = buildAppHead(seoWithoutUrl, false)

    expect(head.link).toEqual(
      expect.arrayContaining([{ rel: 'canonical', href: '' }])
    )
  })
})
