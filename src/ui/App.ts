/*
Path: src/ui/App.ts
*/

import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useHead } from '@vueuse/head'
import { useRoute } from 'vue-router'
import type { RemoteContentStatus } from '@/application/ports/Content'
import { getDefaultSeo } from '@/application/seo/defaultSeo'
import { buildAppHead } from '@/ui/seo/appSeo'
import { useContainer } from '@/di/container'
import {
  getDevBackendAvailability,
  subscribeDevBackendAvailability,
  type DevBackendAvailability
} from '@/application/backend/devBackendAvailability'

export function useApp() {
  const container = useContainer()
  const { content, environment } = container
  
  if (!content || typeof content.getRemoteContentStatus !== 'function') {
    throw new Error('Content repository is not properly initialized in useContainer()')
  }
  
  const route = useRoute()
  const isThanksPage = computed(() => route.path === '/gracias')
  const remoteContentStatus = ref<RemoteContentStatus>(content.getRemoteContentStatus())
  let unsubscribeRemoteContentStatus: (() => void) | undefined
  const isContentReady = computed(
    () => remoteContentStatus.value === 'ready' || remoteContentStatus.value === 'not-required'
  )
  const isContentPending = computed(() => remoteContentStatus.value === 'pending')
  const isContentUnavailable = computed(() => remoteContentStatus.value === 'unavailable')
  const devBackendAvailability = ref<DevBackendAvailability>(getDevBackendAvailability())
  const showDevBackendOfflineBanner = computed(
    () => import.meta.env.DEV && !devBackendAvailability.value.reachable
  )
  let unsubscribeDevBackendAvailability: (() => void) | undefined

  useHead(() => buildAppHead(getDefaultSeo(content, environment), route.path, isThanksPage.value, content.getContent()))

  onMounted(() => {
    remoteContentStatus.value = content.getRemoteContentStatus()
    unsubscribeRemoteContentStatus = content.subscribeRemoteContentStatus((status) => {
      remoteContentStatus.value = status
    })
    unsubscribeDevBackendAvailability = subscribeDevBackendAvailability((state) => {
      devBackendAvailability.value = state
    })
  })

  onBeforeUnmount(() => {
    unsubscribeRemoteContentStatus?.()
    unsubscribeRemoteContentStatus = undefined
    unsubscribeDevBackendAvailability?.()
    unsubscribeDevBackendAvailability = undefined
  })

  return {
    isContentReady,
    isContentPending,
    isContentUnavailable,
    showDevBackendOfflineBanner,
    devBackendAvailability
  }
}
