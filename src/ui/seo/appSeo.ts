import type { HeadObject } from '@vueuse/head'
import { buildOrganizationJsonLd, buildWebsiteJsonLd } from '@/ui/seo/defaultSeo'

type SeoMeta = {
  title: string
  description: string
  siteUrl: string
  siteName: string
  ogImage: string
}

export function buildAppHead(seo: SeoMeta, isThanksPage: boolean): HeadObject {
  const canonicalPath = isThanksPage ? '/gracias' : '/'
  const canonicalUrl = seo.siteUrl ? `${seo.siteUrl}${canonicalPath}` : ''

  if (isThanksPage) {
    const thanksTitle = `Gracias | ${seo.siteName}`
    return {
      title: thanksTitle,
      meta: [
        { name: 'description', content: 'Recibimos tu consulta. En breve te contactamos.' },
        { name: 'robots', content: 'noindex,nofollow' }
      ],
      link: [{ rel: 'canonical', href: canonicalUrl }]
    }
  }

  return {
    title: seo.title,
    meta: [
      { name: 'description', content: seo.description },
      { name: 'robots', content: 'index,follow' },
      { property: 'og:title', content: seo.title },
      { property: 'og:description', content: seo.description },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: canonicalUrl },
      { property: 'og:image', content: seo.ogImage },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: seo.title },
      { name: 'twitter:description', content: seo.description },
      { name: 'twitter:image', content: seo.ogImage }
    ],
    link: [{ rel: 'canonical', href: canonicalUrl }],
    script: [
      {
        type: 'application/ld+json',
        children: JSON.stringify(buildOrganizationJsonLd(seo))
      },
      {
        type: 'application/ld+json',
        children: JSON.stringify(buildWebsiteJsonLd(seo))
      }
    ]
  }
}
