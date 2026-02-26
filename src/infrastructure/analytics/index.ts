import type { AnalyticsPort } from '@/application/ports/Analytics'
import type { ConfigPort } from '@/application/ports/Config'
import { publicConfig } from '@/infrastructure/config/publicConfig'
import { getAnalyticsConsent } from '../consent/consent'
import { initClarity, updateClarityConsent } from './clarity'
import { clearGa4PendingEvents, initGa4, trackGa4Event, trackGa4PageView, updateGa4Consent } from './ga4'
import { clearAnalyticsCookies } from './cookies'

type PageViewPayload = {
  path: string
  title?: string
}

export type AnalyticsConsentStatus = 'unknown' | 'granted' | 'denied'
type AnalyticsRuntimeConfig = {
  analyticsEnabled: boolean
  ga4Id: string | undefined
  clarityProjectId: string | undefined
}

let analyticsReady = false
let ga4Enabled = false
let spaTrackingEnabled = false
let spaCleanup: (() => void) | null = null
let consentStatus: AnalyticsConsentStatus = resolveInitialConsentStatus()
let runtimeConfig: AnalyticsRuntimeConfig = resolveRuntimeConfigFromPublicConfig()

export function configureAnalytics(config: Pick<ConfigPort, 'analyticsEnabled' | 'ga4Id' | 'clarityProjectId'>): void {
  runtimeConfig = {
    analyticsEnabled: parseBoolean(config.analyticsEnabled, runtimeConfig.analyticsEnabled),
    ga4Id: normalize(config.ga4Id) ?? runtimeConfig.ga4Id,
    clarityProjectId: normalize(config.clarityProjectId) ?? runtimeConfig.clarityProjectId
  }
}

export function syncAnalyticsConsent(status: AnalyticsConsentStatus): void {
  consentStatus = status

  if (consentStatus === 'granted') {
    initAnalytics()
    updateRuntimeConsent('granted')
    return
  }

  applyHardRevoke()
}

export function hasAnalyticsConsent(): boolean {
  return consentStatus === 'granted'
}

export function isAnalyticsTrackingEnabled(): boolean {
  return analyticsReady && hasAnalyticsConsent()
}

export function initAnalytics(): void {
  if (analyticsReady) {
    return
  }

  if (!runtimeConfig.analyticsEnabled) {
    return
  }

  if (!hasAnalyticsConsent()) {
    return
  }

  const ga4Id = normalize(runtimeConfig.ga4Id)
  const clarityId = normalize(runtimeConfig.clarityProjectId)

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
  if (!isAnalyticsTrackingEnabled()) {
    return
  }

  if (ga4Enabled) {
    trackGa4PageView(path, title)
  }
}

export function trackEvent(name: string, params: Record<string, unknown> = {}): void {
  if (!isAnalyticsTrackingEnabled()) {
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

function resolveInitialConsentStatus(): AnalyticsConsentStatus {
  const consent = getAnalyticsConsent()

  if (consent === 'unset') {
    return 'unknown'
  }

  return consent
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

function resolveRuntimeConfigFromPublicConfig(): AnalyticsRuntimeConfig {
  return {
    analyticsEnabled: parseBoolean(publicConfig.analyticsEnabled, true),
    ga4Id: normalize(publicConfig.ga4Id),
    clarityProjectId: normalize(publicConfig.clarityProjectId)
  }
}

function updateRuntimeConsent(state: 'granted' | 'denied'): void {
  updateGa4Consent(state)
  updateClarityConsent(state)
}

function applyHardRevoke(): void {
  updateRuntimeConsent('denied')
  clearGa4PendingEvents()
  clearAnalyticsCookies()
}
