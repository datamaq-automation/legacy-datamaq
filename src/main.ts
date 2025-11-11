import { createApp } from 'vue'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './assets/theme.css'
import { installAnalytics } from './infrastructure/analytics'
import { consentManager, consentManagerKey } from './application/services/consentManager'

const app = createApp(App)

app.provide(consentManagerKey, consentManager)

if (consentManager.getStatus() === 'granted') {
  installAnalytics(app)
}

consentManager.subscribe((status) => {
  if (status === 'granted') {
    installAnalytics(app)
  }
})

app.mount('#app')
