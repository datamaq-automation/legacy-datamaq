import type { HeadObject } from '@vueuse/head'
import {
  buildLocalBusinessJsonLd,
  buildOfferCatalogJsonLd,
  buildOrganizationJsonLd,
  buildWebsiteJsonLd,
  SeoMeta
} from '@/ui/seo/defaultSeo'
import { getLandingPageByPath, type LandingPageContent, type LandingPageFaq } from '@/seo/landingPages'

export function buildAppHead(
  seo: SeoMeta,
  currentPath: string,
  isThanksPage: boolean
): HeadObject {
  const normalizedPath = currentPath.startsWith('/') ? currentPath : `/${currentPath}`
  const canonicalUrl = buildCanonicalUrl(seo.siteUrl, normalizedPath)
  const landingPage = getLandingPageByPath(normalizedPath)
  const baseTitle = landingPage?.title ?? seo.title
  const baseDescription = landingPage?.description ?? seo.description
  const pageTitle = isThanksPage ? `Gracias | ${seo.siteName}` : baseTitle
  const pageDescription = isThanksPage
    ? 'Recibimos tu consulta. En breve te contactamos.'
    : baseDescription

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

  if (landingPage && !isThanksPage) {
    scripts.push({
      type: 'application/ld+json',
      children: JSON.stringify(buildServiceJsonLd(landingPage, seo))
    })

    if (landingPage.faqs.length) {
      scripts.push({
        type: 'application/ld+json',
        children: JSON.stringify(buildFaqJsonLd(landingPage.faqs))
      })
    }
  }

  return {
    title: pageTitle,
    meta,
    link: [
      { rel: 'canonical', href: canonicalUrl },
      { rel: 'alternate', hreflang: seo.locale, href: canonicalUrl }
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

function buildServiceJsonLd(
  landing: LandingPageContent,
  seo: SeoMeta
): Record<string, unknown> {
  const provider: Record<string, unknown> = {
    '@type': 'Organization',
    name: seo.business.name || seo.siteName
  }
  if (seo.siteUrl) {
    provider['url'] = seo.siteUrl
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: landing.service.name,
    serviceType: landing.service.serviceType,
    description: landing.service.description,
    areaServed: landing.service.areaServed,
    provider
  }
}

function buildFaqJsonLd(faqs: LandingPageFaq[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  }
}
