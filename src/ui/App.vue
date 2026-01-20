<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { useHead } from '@vueuse/head'
import HomePage from '@/ui/pages/HomePage.vue'
import ThanksView from '@/ui/views/ThanksView.vue'
import { buildOrganizationJsonLd, buildWebsiteJsonLd, getDefaultSeo } from '@/ui/seo/defaultSeo'
import { getCurrentPath, subscribeToNavigation } from '@/infrastructure/navigation/spaNavigation'

const seo = getDefaultSeo()
const currentPath = ref(getCurrentPath())
const isThanksPage = computed(() => currentPath.value === '/gracias')

const unsubscribe = subscribeToNavigation(() => {
  currentPath.value = getCurrentPath()
})

onBeforeUnmount(() => {
  unsubscribe()
})

useHead(() => {
  const canonicalPath = isThanksPage.value ? '/gracias' : '/'
  const canonicalUrl = seo.siteUrl ? `${seo.siteUrl}${canonicalPath}` : ''

  if (isThanksPage.value) {
    const thanksTitle = `Gracias | ${seo.siteName}`
    return {
      title: thanksTitle,
      meta: [
        { name: 'description', content: 'Recibimos tu consulta. En breve te contactamos.' },
        { name: 'robots', content: 'noindex,nofollow' }
      ],
      link: [
        { rel: 'canonical', href: canonicalUrl }
      ]
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
  }
})
</script>

<template>
  <ThanksView v-if="isThanksPage" />
  <HomePage v-else />
</template>
