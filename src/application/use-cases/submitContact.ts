import type { ContactGateway } from '../contact/ports/ContactGateway'
import type { ContactBackendMonitor } from '../contact/contactBackendStatus'
import type { LoggerPort } from '../ports/Logger'
import type { Clock, LocationProvider, NavigatorProvider } from '../ports/Environment'
import type { ContactError } from '../types/errors'
import type { Result } from '@/domain/shared/result'
import type { EmailContactPayload } from '../dto/contact'
import { ContactService } from '@/domain/contact/services/ContactService'
import { ContactSubmitted } from '@/application/contact/events/ContactSubmitted'
import type { EventBus } from '../ports/EventBus'
import type { LeadTracking } from '../analytics/leadTracking'
import { mapContactRequestToSubmitPayload } from '@/application/contact/mappers/contactPayloadMapper'

export class SubmitContactUseCase {
  constructor(
    private contactService: ContactService,
    private contactGateway: ContactGateway,
    private contactBackend: ContactBackendMonitor,
    private location: LocationProvider,
    private navigator: NavigatorProvider,
    private eventBus: EventBus,
    private leadTracking: LeadTracking,
    private logger: LoggerPort,
    private clock: Clock
  ) {}

  async execute(
    section: string,
    payload: EmailContactPayload
  ): Promise<Result<void, ContactError>> {
    const fullName = `${payload.firstName} ${payload.lastName}`.trim()
    const contactInput: {
      id: string
      name: string
      email: string
      company?: string
    } = {
      id: buildContactId(this.clock.now()),
      name: fullName,
      email: payload.email
    }
    if (typeof payload.company !== 'undefined') {
      contactInput.company = payload.company
    }

    const contactResult = this.contactService.createContact(contactInput)

    if (!contactResult.ok) {
      return { ok: false, error: { type: 'ValidationError' } }
    }

    const backendStatus = await this.contactBackend.ensureStatus()
    if (backendStatus !== 'available') {
      return { ok: false, error: { type: 'Unavailable' } }
    }

    const extraDetails: {
      firstName?: string
      lastName?: string
      phoneNumber?: string
      city?: string
      country?: string
    } = {}
    if (typeof payload.firstName !== 'undefined') {
      extraDetails.firstName = payload.firstName
    }
    if (typeof payload.lastName !== 'undefined') {
      extraDetails.lastName = payload.lastName
    }
    if (typeof payload.phoneNumber !== 'undefined') {
      extraDetails.phoneNumber = payload.phoneNumber
    }
    if (typeof payload.city !== 'undefined') {
      extraDetails.city = payload.city
    }
    if (typeof payload.country !== 'undefined') {
      extraDetails.country = payload.country
    }

    const submitResult = await this.contactGateway.submit(
      mapContactRequestToSubmitPayload(
        contactResult.data,
        {
        pageLocation: this.location.href(),
        trafficSource: getTrafficSource(this.location),
        userAgent: this.navigator.userAgent(),
        createdAt: new Date(this.clock.now()).toISOString()
        },
        extraDetails
      )
    )

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

function buildContactId(now: number): string {
  return `contact_${now}_${Math.random().toString(36).slice(2, 8)}`
}

function getTrafficSource(location: LocationProvider): string {
  const params = new URLSearchParams(location.search())
  const utmSource = params.get('utm_source')
  if (utmSource) {
    return utmSource
  }
  return location.referrer() || 'direct'
}
