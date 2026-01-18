import { createApp } from 'vue'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './styles/tokens.css'
import './styles/base.css'
import './styles/layout.css'
import './styles/components.css'
import './assets/theme.css'
import { installAnalytics } from './infrastructure/analytics'
import { consentManagerKey } from './application/consent/consentManager'
import { container, provideContainer } from './di/container'

const app = createApp(App)

provideContainer(app, container)
app.provide(consentManagerKey, container.consentManager)

if (container.consentManager.getStatus() === 'granted') {
  installAnalytics(app)
}

container.consentManager.subscribe((status) => {
  if (status === 'granted') {
    installAnalytics(app)
  }
})

app.mount('#app')
