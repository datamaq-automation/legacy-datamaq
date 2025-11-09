import type { App } from 'vue'
import clarity from '@microsoft/clarity'
import VueGtag from 'vue-gtag-next'
import { getAnalyticsIds } from './config'

const isDev = import.meta.env.DEV

export function installAnalytics(app: App): void {
  const { clarityProjectId, ga4Id } = getAnalyticsIds()

  if (clarityProjectId) {
    clarity.init(clarityProjectId)
    if (isDev) {
      console.info(`[Clarity] Inicializado con ID: ${clarityProjectId}`)
    }
  } else if (isDev) {
    console.info('[Clarity] ID no configurado, Clarity no se inicializa.')
  }

  if (ga4Id) {
    app.use(VueGtag, {
      config: {
        id: ga4Id
      }
    })
    if (isDev) {
      console.info(`[GA4] Inicializado con ID: ${ga4Id}`)
    }
  } else if (isDev) {
    console.info('[GA4] ID no configurado, GA4 no se inicializa.')
  }
}
