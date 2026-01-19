import { createApp } from 'vue'
import { createHead } from '@vueuse/head'
import App from './ui/App.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './styles/tokens.css'
import './styles/base.css'
import './styles/layout.css'
import './styles/components.css'
import './assets/theme.css'
import { enableSpaPageTracking, initAnalytics } from './infrastructure/analytics'
import { initAttribution } from './infrastructure/attribution/utm'
import { consentManagerKey } from './application/consent/consentManager'
import { container, provideContainer } from './di/container'

const app = createApp(App)
const head = createHead()

app.use(head)

provideContainer(app, container)
app.provide(consentManagerKey, container.consentManager)

initAttribution()

if (container.consentManager.getStatus() === 'granted') {
  initAnalytics()
  enableSpaPageTracking()
}

container.consentManager.subscribe((status) => {
  if (status === 'granted') {
    initAnalytics()
    enableSpaPageTracking()
  }
})

app.mount('#app')
