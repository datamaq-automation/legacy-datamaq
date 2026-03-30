<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useHead } from '@vueuse/head'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useContainer } from '@/di/container'
import { getDefaultSeo } from '@/application/seo/defaultSeo'
import { buildAppHead } from '@/ui/seo/appSeo'

const route = useRoute()
const { content, environment } = useContainer()
const isThanksPage = computed(() => route.path === '/gracias')

useHead(() => buildAppHead(getDefaultSeo(content, environment), route.path, isThanksPage.value, content.getContent()))
</script>

<template>
  <RouterView />
</template>
