import type { Clock, LocationProvider } from '../ports/Environment'
import type { TrackingPort } from './trackingFacade'
import type { LoggerPort } from '../ports/Logger'
import { conversionEvents } from './conversionEvents'

export interface ContactEngagementContext {
  section: string
  pageUrl: string
  trafficSource: string
  navigationTimeMs: number
}

const CHAT_EVENT_NAME = conversionEvents.contact
const EMAIL_EVENT_NAME = conversionEvents.generateLead
const DEDUPE_WINDOW_MS = 2000

export class EngagementTracker {
  private dispatchedEvents = new Map<string, number>()
  private pageEntryTimestamp: number

  constructor(
    private clock: Clock,
    private location: LocationProvider,
    private tracking: TrackingPort,
    private logger: LoggerPort
  ) {
    this.pageEntryTimestamp = clock.now()
  }

  trackChat(section: string, trafficSource: string): void {
    const context = this.buildContext(section, trafficSource)
    if (this.shouldSkipEvent(CHAT_EVENT_NAME, context)) {
      return
    }
    this.tracking.trackEvent(CHAT_EVENT_NAME, context)
  }

  trackEmail(section: string, trafficSource: string): void {
    const context = this.buildContext(section, trafficSource)
    if (this.shouldSkipEvent(EMAIL_EVENT_NAME, context)) {
      return
    }
    this.tracking.trackEvent(EMAIL_EVENT_NAME, context)
  }

  private buildContext(section: string, trafficSource: string): ContactEngagementContext {
    const now = this.clock.now()

    return {
      section,
      pageUrl: this.location.href(),
      trafficSource,
      navigationTimeMs: Math.max(now - this.pageEntryTimestamp, 0)
    }
  }

  private shouldSkipEvent(
    eventName: string,
    context: ContactEngagementContext
  ): boolean {
    const now = this.clock.now()
    const key = `${eventName}:${context.section}:${context.pageUrl}:${context.trafficSource}`
    const lastDispatch = this.dispatchedEvents.get(key)

    if (typeof lastDispatch === 'number' && now - lastDispatch < DEDUPE_WINDOW_MS) {
      this.logger.warn(
        `[analytics] Evento "${eventName}" omitido para evitar duplicados (ultimo envio hace ${now - lastDispatch} ms).`
      )
      return true
    }

    this.dispatchedEvents.set(key, now)
    return false
  }
}
