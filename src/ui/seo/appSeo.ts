import type { HeadObject } from '@vueuse/head'
import {
  buildLocalBusinessJsonLd,
  buildOfferCatalogJsonLd,
  buildOrganizationJsonLd,
  buildWebsiteJsonLd,
  SeoMeta
} from '@/ui/seo/defaultSeo'

export function buildAppHead(
  seo: SeoMeta,
  currentPath: string,
  isThanksPage: boolean
): HeadObject {
  const normalizedPath = currentPath.startsWith('/') ? currentPath : `/${currentPath}`
  const canonicalUrl = buildCanonicalUrl(seo.siteUrl, normalizedPath)
  const pageTitle = isThanksPage ? `Gracias | ${seo.siteName}` : seo.title
  const pageDescription = isThanksPage
    ? 'Recibimos tu consulta. En breve te contactamos.'
    : seo.description

  const meta: HeadObject['meta'] = [
    { name: 'description', content: pageDescription },
    { name: 'robots', content: isThanksPage ? 'noindex,nofollow' : 'index,follow' },
    { property: 'og:title', content: pageTitle },
    { property: 'og:description', content: pageDescription },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: canonicalUrl },
    { property: 'og:image', content: seo.ogImage },
    { property: 'og:site_name', content: seo.siteName },
    { property: 'og:locale', content: seo.locale },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: pageTitle },
    { name: 'twitter:description', content: pageDescription },
    { name: 'twitter:image', content: seo.ogImage }
  ]

  if (seo.verificationToken) {
    meta.push({ name: 'google-site-verification', content: seo.verificationToken })
  }

  const scripts = [
    {
      type: 'application/ld+json',
      children: JSON.stringify(buildOrganizationJsonLd(seo))
    },
    {
      type: 'application/ld+json',
      children: JSON.stringify(buildWebsiteJsonLd(seo))
    }
  ]

  const localBusiness = buildLocalBusinessJsonLd(seo)
  if (localBusiness) {
    scripts.push({
      type: 'application/ld+json',
      children: JSON.stringify(localBusiness)
    })
  }

  const offerCatalog = buildOfferCatalogJsonLd(seo)
  if (offerCatalog) {
    scripts.push({
      type: 'application/ld+json',
      children: JSON.stringify(offerCatalog)
    })
  }

  return {
    title: pageTitle,
    meta,
    link: [
      { rel: 'canonical', href: canonicalUrl },
      { rel: 'alternate', hrefLang: seo.locale, href: canonicalUrl }
    ],
    script: scripts
  }
}

function buildCanonicalUrl(base: string, path: string): string {
  if (!base) {
    return path === '/' ? '/' : path
  }

  const normalizedBase = base.replace(/\/$/, '')
  return `${normalizedBase}${path}`
}
