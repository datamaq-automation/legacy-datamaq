import { createHead } from '@vueuse/head'
import { ViteSSG } from 'vite-ssg'
import App from './ui/App.vue'
import { routes } from './router/routes'
import './styles/main.scss'
import 'bootstrap-icons/font/bootstrap-icons.css'
import * as bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js'
import { emitRuntimeWarn } from './application/utils/runtimeConsole'
import { configureAnalytics, enableSpaPageTracking, syncAnalyticsConsent } from './infrastructure/analytics'
import { probeBackendHealth } from './infrastructure/health/probeBackendHealth'

// Exponer Bootstrap globalmente para que Vue pueda accesarlo
declare global {
  interface Window {
    bootstrap: typeof bootstrap
  }
}
if (typeof window !== 'undefined') {
  window.bootstrap = bootstrap
}
import { initAttribution } from './infrastructure/attribution/utm'
import { consentManagerKey, type ConsentStatus } from './application/consent/consentManager'
import { container, provideContainer } from './di/container'

const head = createHead()

function applyCriticalCssVariableFallbacks(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return
  }

  const root = document.documentElement
  const computed = getComputedStyle(root)
  const fallbackMap: Record<string, string> = {
    '--dm-bg-0': '#0c092f',
    '--dm-text-0': '#e2e9f3',
    '--bs-body-bg': '#0c092f',
    '--bs-body-color': '#e2e9f3',
    '--bs-emphasis-color': '#e2e9f3'
  }

  let applied = false
  Object.entries(fallbackMap).forEach(([variableName, fallbackValue]) => {
    const currentValue = computed.getPropertyValue(variableName).trim()
    if (currentValue.length > 0) {
      return
    }
    root.style.setProperty(variableName, fallbackValue)
    applied = true
  })

  if (applied) {
    emitRuntimeWarn('[ui:css] Fallback de variables CSS criticas aplicado en runtime.')
  }
}

async function bootstrapRemoteBackendData(): Promise<void> {
  await probeBackendHealth().catch(() => undefined)
  container.content.bootstrapRemoteData()
}

export const createApp = ViteSSG(
  App,
  { routes },
  ({ app, isClient }) => {
    const provides = (app as unknown as { _context?: { provides?: Record<string, unknown> } })._context
      ?.provides
    if (!provides || !('usehead' in provides)) {
      app.use(head)
    }
    provideContainer(app, container)
    app.provide(consentManagerKey, container.consentManager)

    if (isClient) {
      applyCriticalCssVariableFallbacks()
      void bootstrapRemoteBackendData()
      configureAnalytics(container.config)
      initAttribution(container.storage)
      syncAnalyticsConsent(container.consentManager.getStatus())

      container.consentManager.subscribe((status: ConsentStatus) => {
        syncAnalyticsConsent(status)
      })

      enableSpaPageTracking(container.analyticsPort)
    }
  }
)
