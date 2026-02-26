/*
Path: src/ui/App.ts
*/

import { computed, nextTick, onMounted, watch } from 'vue'
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

  useHead(() => buildAppHead(seo, route.path, isThanksPage.value, content.getContent()))

  onMounted(() => {
    void logUiDebugSnapshot('mounted')
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
    isContentUnavailable
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
