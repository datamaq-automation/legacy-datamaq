type SeoMeta = {
  title: string
  description: string
  siteUrl: string
  siteName: string
  ogImage: string
}

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
    (siteUrl ? `${siteUrl}/og-default.png` : '')

  return {
    title: siteName,
    description,
    siteUrl,
    siteName,
    ogImage
  }
}

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

function normalize(value: string | undefined): string | undefined {
  const trimmed = value?.trim()
  return trimmed ? trimmed : undefined
}
