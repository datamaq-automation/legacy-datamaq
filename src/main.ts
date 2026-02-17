import { createHead } from '@vueuse/head'
import { ViteSSG } from 'vite-ssg'
import App from './ui/App.vue'
import { routes } from './router/routes'
import './styles/main.scss'
import 'bootstrap-icons/font/bootstrap-icons.css'
import * as bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js'
import { enableSpaPageTracking, syncAnalyticsConsent } from './infrastructure/analytics'

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
      initAttribution(container.storage)
      syncAnalyticsConsent(container.consentManager.getStatus())

      container.consentManager.subscribe((status: ConsentStatus) => {
        syncAnalyticsConsent(status)
      })

      enableSpaPageTracking(container.analyticsPort)
    }
  }
)
