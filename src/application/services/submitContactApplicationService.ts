import type { ContactGateway } from '../ports/ContactGateway'
import type { ContactBackendMonitor } from './contactBackendStatus'
import type { EngagementTracker } from './engagementTracker'
import type { LoggerPort } from '../ports/Logger'
import type { LocationProvider, NavigatorProvider } from '../ports/Environment'
import type { ContactError } from '../types/errors'
import type { Result } from '../types/result'
import type { EmailContactPayload } from '../dto/contact'
import { ContactService } from '@/domain/contact/services/ContactService'
import { ContactSubmitted } from '@/domain/contact/events/ContactSubmitted'
import type { EventBus } from '../ports/EventBus'

export class SubmitContactApplicationService {
  constructor(
    private contactService: ContactService,
    private contactGateway: ContactGateway,
    private contactBackend: ContactBackendMonitor,
    private engagementTracker: EngagementTracker,
    private location: LocationProvider,
    private navigator: NavigatorProvider,
    private eventBus: EventBus,
    private logger: LoggerPort
  ) {}

  async execute(
    section: string,
    payload: EmailContactPayload
  ): Promise<Result<void, ContactError>> {
    const contactResult = this.contactService.createContact({
      id: buildContactId(),
      name: payload.name,
      email: payload.email,
      company: payload.company,
      message: payload.message
    })

    if (!contactResult.ok) {
      return { ok: false, error: { type: 'ValidationError' } }
    }

    const backendStatus = await this.contactBackend.ensureStatus()
    if (backendStatus !== 'available') {
      return { ok: false, error: { type: 'Unavailable' } }
    }

    const submitResult = await this.contactGateway.submit({
      name: contactResult.data.name.value,
      email: contactResult.data.email.value,
      company: contactResult.data.company ?? undefined,
      message: contactResult.data.message ?? undefined,
      pageLocation: this.location.href(),
      trafficSource: getTrafficSource(this.location),
      userAgent: this.navigator.userAgent(),
      createdAt: new Date().toISOString()
    })

    if (!submitResult.ok) {
      if (submitResult.error.type === 'BackendError' && submitResult.error.status >= 500) {
        this.contactBackend.markUnavailable()
      } else if (submitResult.error.type !== 'NetworkError') {
        this.contactBackend.markAvailable()
      }
      return submitResult
    }

    this.contactBackend.markAvailable()
    this.engagementTracker.trackEmail(section, getTrafficSource(this.location))
    this.eventBus.publish(new ContactSubmitted(contactResult.data.id))
    return { ok: true, data: undefined }
  }
}

function buildContactId(): string {
  return `contact_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

function getTrafficSource(location: LocationProvider): string {
  const params = new URLSearchParams(location.search())
  const utmSource = params.get('utm_source')
  if (utmSource) {
    return utmSource
  }
  return location.referrer() || 'direct'
}
