/*
Path: src/di/container.ts
*/

import { createConsentManager } from '@/application/consent/consentManager'
import { ContactBackendMonitor } from '@/application/contact/contactBackendStatus'
import { EngagementTracker } from '@/application/analytics/engagementTracker'
import { LeadTracking } from '@/application/analytics/leadTracking'
import { SubmitContactUseCase } from '@/application/use-cases/submitContact'
import { TrackingFacade } from '@/application/analytics/trackingFacade'
import type { AnalyticsPort } from '@/application/ports/Analytics'
import type { ConsentPort } from '@/application/ports/Consent'
import { ViteConfig } from '@/infrastructure/config/viteConfig'
import { BrowserEnvironment } from '@/infrastructure/environment/browserEnvironment'
import { FetchHttpClient } from '@/infrastructure/http/fetchHttpClient'
import { trackEvent, trackPageView } from '@/infrastructure/analytics'
import { getAnalyticsConsent, setAnalyticsConsent } from '@/infrastructure/consent/consent'
import { NoopLogger } from '@/infrastructure/logging/noopLogger'
import { BrowserStorage } from '@/infrastructure/storage/browserStorage'
import { BrowserSessionStorage } from '@/infrastructure/storage/browserSessionStorage'
import { ContactApiGateway } from '@/infrastructure/contact/contactApiGateway'
import { ContentRepository } from '@/infrastructure/content/contentRepository'
import type { App, InjectionKey } from 'vue'
import { getCurrentInstance, inject } from 'vue'

const environment = new BrowserEnvironment()
const logger = new NoopLogger()
const config = new ViteConfig()
const http = new FetchHttpClient(logger)
const analyticsPort: AnalyticsPort = {
  trackEvent(name, params) {
    trackEvent(name, params)
  },
  trackPageView(payload) {
    trackPageView(payload)
  }
}
const consentPort: ConsentPort = {
  getAnalyticsConsent() {
    return getAnalyticsConsent()
  },
  setAnalyticsConsent(value) {
    setAnalyticsConsent(value)
  }
}
const tracking = new TrackingFacade(analyticsPort, consentPort)
const contactBackend = new ContactBackendMonitor(http, config, environment, logger)
const engagementTracker = new EngagementTracker(environment, environment, tracking, logger)
const storage = new BrowserStorage()
const sessionStorage = new BrowserSessionStorage()
const consentManager = createConsentManager(storage, logger)
const leadTracking = new LeadTracking(sessionStorage, tracking, config, environment)
const contactGateway = new ContactApiGateway(http, config, storage, logger)
const contentRepository = new ContentRepository()

const submitContact = new SubmitContactUseCase(
  contactGateway,
  contactBackend,
  environment,
  environment,
  leadTracking,
  environment
)

export const container = {
  config,
  environment,
  analyticsPort,
  consentManager,
  consentPort,
  contactBackend,
  content: contentRepository,
  engagementTracker,
  leadTracking,
  storage,
  useCases: {
    submitContact
  }
} as const

export type AppContainer = typeof container

export const containerKey: InjectionKey<AppContainer> = Symbol('appContainer')

export function provideContainer(app: App, value: AppContainer = container): void {
  app.provide(containerKey, value)
}

export function useContainer(): AppContainer {
  if (!getCurrentInstance()) {
    return container
  }

  return inject(containerKey, container)
}
