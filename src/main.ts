import { createApp } from 'vue'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { installAnalytics } from './infrastructure/analytics'

const app = createApp(App)

installAnalytics(app)

app.mount('#app')
