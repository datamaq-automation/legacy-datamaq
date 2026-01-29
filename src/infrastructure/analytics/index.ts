import type { AnalyticsPort } from '@/application/ports/Analytics'
import { getAnalyticsConsent } from '../consent/consent'
import { initClarity } from './clarity'
import { initGa4, trackGa4Event, trackGa4PageView } from './ga4'
import { publicConfig } from '@/infrastructure/content/content'

type PageViewPayload = {
  path: string
  title?: string
}

let analyticsReady = false
let ga4Enabled = false
let spaTrackingEnabled = false
let spaCleanup: (() => void) | null = null

export function initAnalytics(): void {
  if (analyticsReady) {
    return
  }

  const enabled = parseBoolean(publicConfig.analyticsEnabled, true)
  if (!enabled) {
    return
  }

  if (getAnalyticsConsent() !== 'granted') {
    return
  }

  const ga4Id = normalize(publicConfig.ga4Id)
  const clarityId = normalize(publicConfig.clarityProjectId)

  if (ga4Id) {
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

  if (ga4Enabled) {
    trackGa4Event(name, params)
  }
}

export function enableSpaPageTracking(analytics: AnalyticsPort): () => void {
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
    analytics.trackPageView({ path: nextPath, title: document.title })
  }

  analytics.trackPageView({ path: lastPath, title: document.title })

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

function parseBoolean(value: string | boolean | undefined, fallback: boolean): boolean {
  if (typeof value === 'undefined') {
    return fallback
  }
  if (typeof value === 'boolean') {
    return value
  }
  return value.toLowerCase() === 'true'
}
