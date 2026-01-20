import type { Attribution, AttributionProvider } from '@/application/ports/Attribution'
import type { StoragePort } from '@/application/ports/Storage'
import { getAttribution } from './utm'

export class BrowserAttribution implements AttributionProvider {
  constructor(private storage: StoragePort) {}

  getAttribution(): Attribution | null {
    return getAttribution(this.storage)
  }
}
