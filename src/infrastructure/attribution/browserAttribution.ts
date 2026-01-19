import type { Attribution, AttributionProvider } from '@/application/ports/Attribution'
import { getAttribution } from './utm'

export class BrowserAttribution implements AttributionProvider {
  getAttribution(): Attribution | null {
    return getAttribution()
  }
}
