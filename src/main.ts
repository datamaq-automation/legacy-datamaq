import { createApp } from 'vue'
import { createHead } from '@vueuse/head'
import App from './ui/App.vue'
import './styles/vendors/bootstrap.custom.scss'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './styles/tokens.css'
import './styles/base.css'
import './styles/layout.css'
import './styles/bootstrap-overrides.css'
import './assets/theme.css'
import './ui/styles/variables.css'
import './ui/styles/base.css'
import './ui/styles/app.css'
import { enableSpaPageTracking, initAnalytics } from './infrastructure/analytics'
import { initAttribution } from './infrastructure/attribution/utm'
import { consentManagerKey } from './application/consent/consentManager'
import { container, provideContainer } from './di/container'

const app = createApp(App)
const head = createHead()

app.use(head)

provideContainer(app, container)
app.provide(consentManagerKey, container.consentManager)

initAttribution(container.storage)

const syncConsent = () => {
  const status = container.consentManager.getStatus()
  if (status === 'granted') {
    container.consentPort.setAnalyticsConsent('granted')
  } else if (status === 'denied') {
    container.consentPort.setAnalyticsConsent('denied')
  } else {
    container.consentPort.setAnalyticsConsent('unset')
  }
}

syncConsent()

if (container.consentManager.getStatus() === 'granted') {
  initAnalytics()
  enableSpaPageTracking(container.analyticsPort)
}

container.consentManager.subscribe((status) => {
  syncConsent()
  if (status === 'granted') {
    initAnalytics()
    enableSpaPageTracking(container.analyticsPort)
  }
})

app.mount('#app')
