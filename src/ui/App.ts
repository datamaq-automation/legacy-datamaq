import { computed } from 'vue'
import { useHead } from '@vueuse/head'
import { useRoute } from 'vue-router'
import { getDefaultSeo } from '@/ui/seo/defaultSeo'
import { buildAppHead } from '@/ui/seo/appSeo'
import { useContainer } from '@/di/container'

export function useApp() {
  const { content, config, environment } = useContainer()
  const seo = getDefaultSeo(content, config, environment)
  const route = useRoute()
  const isThanksPage = computed(() => route.path === '/gracias')
  const remoteContentStatus = computed(() => content.getRemoteContentStatus())
  const isContentReady = computed(
    () => remoteContentStatus.value === 'ready' || remoteContentStatus.value === 'not-required'
  )
  const isContentUnavailable = computed(() => remoteContentStatus.value === 'unavailable')

  useHead(() => buildAppHead(seo, route.path, isThanksPage.value))

  return {
    isContentReady,
    isContentUnavailable
  }
}
