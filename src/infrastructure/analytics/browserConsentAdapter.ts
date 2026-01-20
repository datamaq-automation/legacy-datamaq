import type { AnalyticsConsent, ConsentPort } from '@/application/ports/Consent'
import { getAnalyticsConsent, setAnalyticsConsent } from './consent'

export class BrowserConsentAdapter implements ConsentPort {
  getAnalyticsConsent(): AnalyticsConsent {
    return getAnalyticsConsent()
  }

  setAnalyticsConsent(value: AnalyticsConsent): void {
    setAnalyticsConsent(value)
  }
}
