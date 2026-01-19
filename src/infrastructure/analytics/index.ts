import { getAnalyticsConsent } from './consent'
import { initClarity } from './clarity'
import { initGa4, trackGa4Event, trackGa4PageView } from './ga4'
import { initGtm, pushToDataLayer } from './gtm'

type PageViewPayload = {
  path: string
  title?: string
}

let analyticsReady = false
let gtmEnabled = false
let ga4Enabled = false
let spaTrackingEnabled = false
let spaCleanup: (() => void) | null = null

export function initAnalytics(): void {
  if (analyticsReady) {
    return
  }

  const enabled = parseBoolean(import.meta.env.VITE_ANALYTICS_ENABLED, true)
  if (!enabled) {
    return
  }

  if (getAnalyticsConsent() !== 'granted') {
    return
  }

  const gtmId = normalize(import.meta.env.VITE_GTM_ID)
  const ga4Id = normalize(import.meta.env.VITE_GA4_ID)
  const clarityId = normalize(import.meta.env.VITE_CLARITY_PROJECT_ID)

  if (gtmId) {
    initGtm({ id: gtmId })
    gtmEnabled = true
  }

  if (ga4Id && !gtmId) {
    initGa4({ id: ga4Id, debug: import.meta.env.DEV })
    ga4Enabled = true
  }

  if (clarityId) {
    initClarity({ id: clarityId })
  }

  analyticsReady = true
}

export function trackPageView({ path, title }: PageViewPayload): void {
  if (!analyticsReady) {
    return
  }

  if (getAnalyticsConsent() !== 'granted') {
    return
  }

  if (gtmEnabled) {
    pushToDataLayer({
      event: 'page_view',
      page_path: path,
      page_title: title,
      page_location: typeof window === 'undefined' ? undefined : window.location.href
    })
    return
  }

  if (ga4Enabled) {
    trackGa4PageView(path, title)
  }
}

export function trackEvent(name: string, params: Record<string, unknown> = {}): void {
  if (!analyticsReady) {
    return
  }

  if (getAnalyticsConsent() !== 'granted') {
    return
  }

  if (gtmEnabled) {
    pushToDataLayer({
      event: name,
      ...params
    })
    return
  }

  if (ga4Enabled) {
    trackGa4Event(name, params)
  }
}

export function enableSpaPageTracking(): () => void {
  if (spaTrackingEnabled || typeof window === 'undefined') {
    return spaCleanup ?? (() => {})
  }

  let lastPath = `${window.location.pathname}${window.location.search}${window.location.hash}`

  const sendPageView = () => {
    const nextPath = `${window.location.pathname}${window.location.search}${window.location.hash}`
    if (nextPath === lastPath) {
      return
    }
    lastPath = nextPath
    trackPageView({ path: nextPath, title: document.title })
  }

  trackPageView({ path: lastPath, title: document.title })

  const originalPushState = history.pushState.bind(history)
  history.pushState = (...args) => {
    originalPushState(...args)
    sendPageView()
  }

  const originalReplaceState = history.replaceState.bind(history)
  history.replaceState = (...args) => {
    originalReplaceState(...args)
    sendPageView()
  }

  window.addEventListener('popstate', sendPageView)
  spaTrackingEnabled = true
  spaCleanup = () => {
    history.pushState = originalPushState
    history.replaceState = originalReplaceState
    window.removeEventListener('popstate', sendPageView)
    spaTrackingEnabled = false
  }

  return spaCleanup
}

function normalize(value: string | undefined): string | undefined {
  const trimmed = value?.trim()
  return trimmed ? trimmed : undefined
}

function parseBoolean(value: string | undefined, fallback: boolean): boolean {
  if (typeof value === 'undefined') {
    return fallback
  }
  return value.toLowerCase() === 'true'
}
