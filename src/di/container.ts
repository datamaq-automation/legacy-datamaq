import { createConsentManager } from '@/application/consent/consentManager'
import { AnalyticsFacade } from '@/application/analytics/analyticsFacade'
import { ContactBackendMonitor } from '@/application/contact/contactBackendStatus'
import { EngagementTracker } from '@/application/analytics/engagementTracker'
import { SubmitContactUseCase } from '@/application/use-cases/submitContact'
import { ContactSubmittedHandler } from '@/application/contact/handlers/contactSubmittedHandler'
import { OpenWhatsappUseCase } from '@/application/use-cases/openWhatsapp'
import { BrowserAttribution } from '@/infrastructure/attribution/browserAttribution'
import { BrowserAnalytics } from '@/infrastructure/analytics/browserAnalytics'
import { ViteConfig } from '@/infrastructure/config/viteConfig'
import { BrowserEnvironment } from '@/infrastructure/environment/browserEnvironment'
import { InMemoryEventBus } from '@/infrastructure/events/inMemoryEventBus'
import { FetchHttpClient } from '@/infrastructure/http/fetchHttpClient'
import { ConsoleLogger } from '@/infrastructure/logging/consoleLogger'
import { BrowserStorage } from '@/infrastructure/storage/browserStorage'
import { ContactApiGateway } from '@/infrastructure/contact/contactApiGateway'
import { ContactService } from '@/domain/contact/services/ContactService'
import { NotificationFacade } from '@/application/notifications/notificationFacade'
import { NoopNotificationProvider } from '@/infrastructure/notifications/noopNotificationProvider'
import type { App, InjectionKey } from 'vue'
import { getCurrentInstance, inject } from 'vue'

const environment = new BrowserEnvironment()
const logger = new ConsoleLogger(environment)
const config = new ViteConfig()
const http = new FetchHttpClient(logger)
const analytics = new AnalyticsFacade([new BrowserAnalytics(logger)], logger)
const notifications = new NotificationFacade([new NoopNotificationProvider()], logger)
const contactBackend = new ContactBackendMonitor(http, config, environment, logger)
const engagementTracker = new EngagementTracker(environment, environment, logger)
const attribution = new BrowserAttribution()
const storage = new BrowserStorage()
const consentManager = createConsentManager(storage, logger)
const eventBus = new InMemoryEventBus()
const contactService = new ContactService()
const contactGateway = new ContactApiGateway(http, config, logger)
const contactSubmittedHandler = new ContactSubmittedHandler(analytics, notifications, logger)

const openWhatsapp = new OpenWhatsappUseCase(
  config,
  environment,
  environment,
  environment,
  http,
  contactBackend,
  engagementTracker,
  attribution,
  logger
)

const submitContact = new SubmitContactUseCase(
  contactService,
  contactGateway,
  contactBackend,
  environment,
  environment,
  eventBus,
  logger
)

eventBus.subscribe('contact.submitted', (event) => {
  contactSubmittedHandler.handle(event)
})

export const container = {
  config,
  consentManager,
  contactBackend,
  eventBus,
  useCases: {
    openWhatsapp,
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
