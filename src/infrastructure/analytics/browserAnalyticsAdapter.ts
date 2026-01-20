import type { AnalyticsPort, PageViewPayload } from '@/application/ports/Analytics'
import { trackEvent, trackPageView } from './index'

export class BrowserAnalyticsAdapter implements AnalyticsPort {
  trackEvent(name: string, params: Record<string, unknown> = {}): void {
    trackEvent(name, params)
  }

  trackPageView(payload: PageViewPayload): void {
    trackPageView(payload)
  }
}
