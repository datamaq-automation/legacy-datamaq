import { createConsentManager } from '@/application/services/consentManager'
import { AnalyticsComposite } from '@/application/services/analyticsComposite'
import { ContactBackendMonitor } from '@/application/services/contactBackendStatus'
import { EngagementTracker } from '@/application/services/engagementTracker'
import { OpenWhatsapp } from '@/application/use-cases/openWhatsapp'
import { SubmitEmailContact } from '@/application/use-cases/submitEmailContact'
import { BrowserAnalytics } from '@/infrastructure/analytics/browserAnalytics'
import { ViteConfig } from '@/infrastructure/config/viteConfig'
import { BrowserEnvironment } from '@/infrastructure/environment/browserEnvironment'
import { FetchHttpClient } from '@/infrastructure/http/fetchHttpClient'
import { ConsoleLogger } from '@/infrastructure/logging/consoleLogger'
import { BrowserStorage } from '@/infrastructure/storage/browserStorage'
import type { App, InjectionKey } from 'vue'
import { inject } from 'vue'

const environment = new BrowserEnvironment()
const logger = new ConsoleLogger(environment)
const config = new ViteConfig()
const http = new FetchHttpClient(logger)
const analytics = new AnalyticsComposite([new BrowserAnalytics(logger)], logger)
const contactBackend = new ContactBackendMonitor(http, config, environment, logger)
const engagementTracker = new EngagementTracker(analytics, environment, environment, logger)
const storage = new BrowserStorage()
const consentManager = createConsentManager(storage, logger)

const openWhatsapp = new OpenWhatsapp(
  config,
  environment,
  environment,
  environment,
  http,
  contactBackend,
  engagementTracker,
  logger
)

const submitEmailContact = new SubmitEmailContact(
  config,
  environment,
  http,
  contactBackend,
  engagementTracker,
  logger
)

export const container = {
  config,
  consentManager,
  contactBackend,
  useCases: {
    openWhatsapp,
    submitEmailContact
  }
} as const

export type AppContainer = typeof container

export const containerKey: InjectionKey<AppContainer> = Symbol('appContainer')

export function provideContainer(app: App, value: AppContainer = container): void {
  app.provide(containerKey, value)
}

export function useContainer(): AppContainer {
  return inject(containerKey, container)
}
