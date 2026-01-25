import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  buildOrganizationJsonLd,
  buildWebsiteJsonLd,
  getDefaultSeo
} from '@/ui/seo/defaultSeo'

const originalWindow = globalThis.window

describe('defaultSeo', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    globalThis.window = originalWindow
  })

  it('usa valores de entorno y los normaliza', () => {
    vi.stubEnv('VITE_SITE_URL', ' https://profebustos.com ')
    vi.stubEnv('VITE_SITE_NAME', ' Profe ')
    vi.stubEnv('VITE_SITE_DESCRIPTION', '  Descripcion  ')
    vi.stubEnv('VITE_SITE_OG_IMAGE', ' https://profebustos.com/og.png ')

    const seo = getDefaultSeo()

    expect(seo).toMatchObject({
      title: 'Profe',
      description: 'Descripcion',
      siteUrl: 'https://profebustos.com',
      siteName: 'Profe',
      ogImage: 'https://profebustos.com/og.png'
    })
    expect(buildOrganizationJsonLd(seo)).toEqual({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Profe',
      url: 'https://profebustos.com'
    })
    expect(buildWebsiteJsonLd(seo)).toEqual({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Profe',
      url: 'https://profebustos.com'
    })
  })

  it('usa fallbacks cuando las env no están definidas', () => {
    vi.stubEnv('VITE_SITE_URL', '')
    vi.stubEnv('VITE_SITE_NAME', '')
    vi.stubEnv('VITE_SITE_DESCRIPTION', '')
    vi.stubEnv('VITE_SITE_OG_IMAGE', '')

    const seo = getDefaultSeo()

    expect(seo.siteUrl).toBe(window.location.origin)
    expect(seo.ogImage).toBe(`${window.location.origin}/og-default.png`)
    expect(seo.siteName).toBe('ProfeBustos')
    expect(seo.title).toBe('ProfeBustos')
    expect(seo.description).toBe('Servicios industriales y eficiencia energetica para empresas.')
  })

  it('maneja ausencia de window devolviendo campos vacíos', () => {
    vi.stubEnv('VITE_SITE_URL', '')
    vi.stubEnv('VITE_SITE_NAME', '')
    vi.stubEnv('VITE_SITE_DESCRIPTION', '')
    vi.stubEnv('VITE_SITE_OG_IMAGE', '')

    const backupWindow = globalThis.window

    globalThis.window = undefined

    const seo = getDefaultSeo()

    expect(seo.siteUrl).toBe('')
    expect(seo.ogImage).toBe('')
    expect(seo.title).toBe('ProfeBustos')


    globalThis.window = backupWindow
  })
})
