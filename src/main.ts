import { createHead } from '@vueuse/head'
import { ViteSSG } from 'vite-ssg'
import App from './ui/App.vue'
import { routes } from './router/routes'
import './styles/main.scss'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './assets/theme.css'
import './ui/styles/variables.css'
import { enableSpaPageTracking, initAnalytics } from './infrastructure/analytics'
import { initAttribution } from './infrastructure/attribution/utm'
import { consentManagerKey } from './application/consent/consentManager'
import { container, provideContainer } from './di/container'

export const createApp = ViteSSG(
  App,
  { routes },
  ({ app, isClient }) => {
    const head = createHead()
    app.use(head)
    provideContainer(app, container)
    app.provide(consentManagerKey, container.consentManager)

    if (isClient) {
      initAttribution(container.storage)
      initAnalytics()
      enableSpaPageTracking(container.analyticsPort)
    }
  }
)
