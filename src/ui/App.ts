import { computed, onBeforeUnmount, ref } from 'vue'
import { useHead } from '@vueuse/head'
import { getDefaultSeo } from '@/ui/seo/defaultSeo'
import { buildAppHead } from '@/ui/seo/appSeo'
import { getCurrentPath, subscribeToNavigation } from '@/infrastructure/navigation/spaNavigation'

export function useApp() {
  const seo = getDefaultSeo()
  const currentPath = ref(getCurrentPath())
  const isThanksPage = computed(() => currentPath.value === '/gracias')

  const unsubscribe = subscribeToNavigation(() => {
    currentPath.value = getCurrentPath()
  })

  onBeforeUnmount(() => {
    unsubscribe()
  })

  useHead(() => buildAppHead(seo, isThanksPage.value))

  return { isThanksPage }
}
