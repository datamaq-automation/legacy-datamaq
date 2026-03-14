import { createHead } from '@vueuse/head'
import { ViteSSG } from 'vite-ssg'
import App from './ui/App.vue'
import { routes } from './router/routes'
import './styles/main.scss'
import './styles/tailwind.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { emitRuntimeInfo, emitRuntimeWarn } from './application/utils/runtimeConsole'
import { setDevBackendAvailability } from './application/backend/devBackendAvailability'
import { configureAnalytics, enableSpaPageTracking, syncAnalyticsConsent } from './infrastructure/analytics'
import { probeBackendHealth } from './infrastructure/health/probeBackendHealth'
import { initAttribution } from './infrastructure/attribution/utm'
import { type ConsentStatus } from './application/consent/consentManager'
import { container, provideContainer } from './di/container'
import { consentManagerKey } from './di/keys'

const head = createHead()
type VueAppProvidesContext = { _context?: { provides?: Record<string, unknown> } }
// EXCEPCION: fallback minimo de bootstrap para primera pintura si el CSS de tokens no cargo.
const CRITICAL_CSS_FALLBACKS: Readonly<Record<string, string>> = {
  '--dm-bg-0': '#0c092f',
  '--dm-text-0': '#e2e9f3',
  '--bs-body-bg': '#0c092f',
  '--bs-body-color': '#e2e9f3',
  '--bs-emphasis-color': '#e2e9f3'
}

function applyCriticalCssVariableFallbacks(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return
  }

  const root = document.documentElement
  const computed = getComputedStyle(root)
  let applied = false
  Object.entries(CRITICAL_CSS_FALLBACKS).forEach(([variableName, fallbackValue]) => {
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
  const health = await probeBackendHealth().catch(() => undefined)
  if (import.meta.env.DEV) {
    setDevBackendAvailability({
      reachable: Boolean(health?.ok),
      endpoint: health?.endpoint ?? null,
      status: health?.status ?? null
    })
  }
  if (import.meta.env.DEV && health && !health.ok) {
    emitRuntimeInfo('[backend:bootstrap] backend no disponible en dev; se omite content/pricing remoto', {
      endpoint: health.endpoint,
      status: health.status
    })
    return
  }
  container.content.bootstrapRemoteData()
}

export const createApp = ViteSSG(
  App,
  {
    routes,
    scrollBehavior(to, _from, savedPosition) {
      if (savedPosition) {
        return savedPosition
      }

      if (!to.hash) {
        return { top: 0, behavior: 'smooth' }
      }

      return new Promise((resolve) => {
        window.requestAnimationFrame(() => {
          resolve({
            el: to.hash,
            top: 88,
            behavior: 'smooth'
          })
        })
      })
    }
  },
  ({ app, isClient }) => {
    const provides = (app as VueAppProvidesContext)._context?.provides
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
