import type { App } from 'vue'
import clarity from '@microsoft/clarity'
import VueGtag from 'vue-gtag-next'
import { getAnalyticsIds } from './config'

const isDev = import.meta.env.DEV
let analyticsInstalled = false

export function installAnalytics(app: App): void {
  if (analyticsInstalled) {
    if (isDev) {
      console.warn('[analytics] Se ignoró un intento duplicado de inicializar analíticas.')
    }
    return
  }

  const { clarityProjectId, ga4Id } = getAnalyticsIds()

  if (clarityProjectId) {
    clarity.init(clarityProjectId)
    if (isDev) {
      console.log(`[Clarity] Inicializado con ID: ${clarityProjectId}`)
    }
  } else if (isDev) {
    console.log('[Clarity] ID no configurado, Clarity no se inicializa.')
  }

  if (ga4Id) {
    app.use(VueGtag, {
      property: { id: ga4Id }
    })
    if (isDev) {
      console.log(`[GA4] Inicializado con ID: ${ga4Id}`)
    }
  } else if (isDev) {
    console.log('[GA4] ID no configurado, GA4 no se inicializa.')
  }

  analyticsInstalled = true
}
