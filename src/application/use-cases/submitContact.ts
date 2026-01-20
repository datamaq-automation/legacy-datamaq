import type { ContactGateway } from '../contact/ports/ContactGateway'
import type { ContactBackendMonitor } from '../contact/contactBackendStatus'
import type { LoggerPort } from '../ports/Logger'
import type { LocationProvider, NavigatorProvider } from '../ports/Environment'
import type { ContactError } from '../types/errors'
import type { Result } from '@/domain/shared/result'
import type { EmailContactPayload } from '../dto/contact'
import { ContactService } from '@/domain/contact/services/ContactService'
import { ContactSubmitted } from '@/domain/contact/events/ContactSubmitted'
import type { EventBus } from '../ports/EventBus'
import type { LeadTracking } from '../analytics/leadTracking'

export class SubmitContactUseCase {
  constructor(
    private contactService: ContactService,
    private contactGateway: ContactGateway,
    private contactBackend: ContactBackendMonitor,
    private location: LocationProvider,
    private navigator: NavigatorProvider,
    private eventBus: EventBus,
    private leadTracking: LeadTracking,
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
    this.leadTracking.registerLeadForThanksPage()
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
