/*
Path: src/di/container.ts
*/

import { createConsentManager } from '@/application/consent/consentManager'
import { AnalyticsFacade } from '@/application/analytics/analyticsFacade'
import { ContactBackendMonitor } from '@/application/contact/contactBackendStatus'
import { EngagementTracker } from '@/application/analytics/engagementTracker'
import { LeadTracking } from '@/application/analytics/leadTracking'
import { SubmitContactUseCase } from '@/application/use-cases/submitContact'
import { ContactSubmittedHandler } from '@/application/contact/handlers/contactSubmittedHandler'
import { TrackingFacade } from '@/application/analytics/trackingFacade'
import { BrowserAnalytics } from '@/infrastructure/analytics/browserAnalytics'
import { BrowserAnalyticsAdapter } from '@/infrastructure/analytics/browserAnalyticsAdapter'
import { BrowserConsentAdapter } from '@/infrastructure/consent/browserConsentAdapter'
import { ViteConfig } from '@/infrastructure/config/viteConfig'
import { BrowserEnvironment } from '@/infrastructure/environment/browserEnvironment'
import { InMemoryEventBus } from '@/infrastructure/events/inMemoryEventBus'
import { FetchHttpClient } from '@/infrastructure/http/fetchHttpClient'
import { NoopLogger } from '@/infrastructure/logging/noopLogger'
import { BrowserStorage } from '@/infrastructure/storage/browserStorage'
import { BrowserSessionStorage } from '@/infrastructure/storage/browserSessionStorage'
import { ContactApiGateway } from '@/infrastructure/contact/contactApiGateway'
import { ContactService } from '@/domain/contact/services/ContactService'
import { NotificationFacade } from '@/application/notifications/notificationFacade'
import { NoopNotificationProvider } from '@/infrastructure/notifications/noopNotificationProvider'
import { ContentRepository } from '@/infrastructure/content/contentRepository'
import type { App, InjectionKey } from 'vue'
import { getCurrentInstance, inject } from 'vue'

const environment = new BrowserEnvironment()
const logger = new NoopLogger()
const config = new ViteConfig()
const http = new FetchHttpClient(logger)
const analyticsPort = new BrowserAnalyticsAdapter()
const consentPort = new BrowserConsentAdapter()
const tracking = new TrackingFacade(analyticsPort, consentPort)
const analytics = new AnalyticsFacade([new BrowserAnalytics(logger)], logger)
const notifications = new NotificationFacade([new NoopNotificationProvider()], logger)
const contactBackend = new ContactBackendMonitor(http, config, environment, logger)
const engagementTracker = new EngagementTracker(environment, environment, tracking, logger)
const storage = new BrowserStorage()
const sessionStorage = new BrowserSessionStorage()
const consentManager = createConsentManager(storage, logger)
const leadTracking = new LeadTracking(sessionStorage, tracking, config, environment)
const eventBus = new InMemoryEventBus()
const contactService = new ContactService()
const contactGateway = new ContactApiGateway(http, config, storage, logger)
const contactSubmittedHandler = new ContactSubmittedHandler(analytics, notifications, logger)
const contentRepository = new ContentRepository(config, logger, http)

const submitContact = new SubmitContactUseCase(
  contactService,
  contactGateway,
  contactBackend,
  environment,
  environment,
  eventBus,
  leadTracking,
  environment
)

eventBus.subscribe('contact.submitted', (event) => {
  contactSubmittedHandler.handle(event)
})

export const container = {
  config,
  environment,
  analyticsPort,
  consentManager,
  consentPort,
  contactBackend,
  content: contentRepository,
  engagementTracker,
  eventBus,
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
