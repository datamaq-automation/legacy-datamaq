import type { AnalyticsConsent, ConsentPort } from '@/application/ports/Consent'
import { getAnalyticsConsent } from './consent'

export class BrowserConsentAdapter implements ConsentPort {
  getAnalyticsConsent(): AnalyticsConsent {
    return getAnalyticsConsent()
  }
}
