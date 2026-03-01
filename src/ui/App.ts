/*
Path: src/ui/App.ts
*/

import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useHead } from '@vueuse/head'
import { useRoute } from 'vue-router'
import type { RemoteContentStatus } from '@/application/ports/Content'
import { getDefaultSeo } from '@/ui/seo/defaultSeo'
import { buildAppHead } from '@/ui/seo/appSeo'
import { useContainer } from '@/di/container'
import {
  getDevBackendAvailability,
  subscribeDevBackendAvailability,
  type DevBackendAvailability
} from '@/application/backend/devBackendAvailability'

export function useApp() {
  const { content, environment } = useContainer()
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
    void logUiDebugSnapshot('mounted')
  })

  onBeforeUnmount(() => {
    unsubscribeRemoteContentStatus?.()
    unsubscribeRemoteContentStatus = undefined
    unsubscribeDevBackendAvailability?.()
    unsubscribeDevBackendAvailability = undefined
  })

  watch(
    () => route.path,
    () => {
      void logUiDebugSnapshot('route-change')
    }
  )

  watch(
    () => remoteContentStatus.value,
    () => {
      void logUiDebugSnapshot('content-status-change')
    }
  )

  return {
    isContentReady,
    isContentPending,
    isContentUnavailable,
    showDevBackendOfflineBanner,
    devBackendAvailability
  }

  async function logUiDebugSnapshot(reason: string): Promise<void> {
    await nextTick()

    const selectors = ['h1', 'h2', '.c-hero__title', '.c-services__card-title', '.c-contact__title']
    const rows = selectors.map((selector) => {
      const element = document.querySelector(selector)
      if (!(element instanceof HTMLElement)) {
        return { selector, exists: false }
      }

      const style = window.getComputedStyle(element)
      const rect = element.getBoundingClientRect()
      return {
        selector,
        exists: true,
        text: element.textContent?.trim().slice(0, 80),
        color: style.color,
        opacity: style.opacity,
        visibility: style.visibility,
        display: style.display,
        zIndex: style.zIndex,
        width: Math.round(rect.width),
        height: Math.round(rect.height)
      }
    })

  }
}
