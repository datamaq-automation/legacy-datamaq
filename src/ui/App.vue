<script setup lang="ts">
import { useHead } from '@vueuse/head'
import HomePage from '@/ui/pages/HomePage.vue'
import { buildOrganizationJsonLd, buildWebsiteJsonLd, getDefaultSeo } from '@/ui/seo/defaultSeo'

const seo = getDefaultSeo()
const canonicalUrl = seo.siteUrl ? `${seo.siteUrl}/` : ''

useHead({
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
  link: [
    { rel: 'canonical', href: canonicalUrl }
  ],
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
})
</script>

<template>
  <HomePage />
</template>
