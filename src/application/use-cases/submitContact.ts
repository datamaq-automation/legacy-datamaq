import type { ContactGateway } from '../contact/ports/ContactGateway'
import type { ContactBackendMonitor } from '../contact/contactBackendStatus'
import type { Clock, LocationProvider, NavigatorProvider } from '../ports/Environment'
import type { ContactError } from '../types/errors'
import type { Result } from '@/domain/shared/result'
import type { ContactFormPayload, ContactSubmitSuccess } from '../dto/contact'
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
    private clock: Clock
  ) {}

  async execute(
    section: string,
    payload: ContactFormPayload
  ): Promise<Result<ContactSubmitSuccess, ContactError>> {
    const normalizedPayload = normalizeContactFormPayload(payload)
    const fullName = buildContactDisplayName(normalizedPayload)
    const contactInput = {
      id: buildContactId(this.clock.now()),
      name: fullName,
      ...(normalizedPayload.email ? { email: normalizedPayload.email } : {}),
      ...(normalizedPayload.phone ? { phone: normalizedPayload.phone } : {}),
      ...(normalizedPayload.firstName ? { firstName: normalizedPayload.firstName } : {}),
      ...(normalizedPayload.lastName ? { lastName: normalizedPayload.lastName } : {}),
      ...(normalizedPayload.company ? { company: normalizedPayload.company } : {}),
      ...(normalizedPayload.geographicLocation
        ? { geographicLocation: normalizedPayload.geographicLocation }
        : {}),
      ...(normalizedPayload.comment ? { message: normalizedPayload.comment } : {})
    }

    const contactResult = this.contactService.createContact(contactInput)

    if (!contactResult.ok) {
      return { ok: false, error: { type: 'ValidationError' } }
    }

    const backendStatus = await this.contactBackend.ensureStatus()
    if (backendStatus !== 'available') {
      return { ok: false, error: { type: 'Unavailable' } }
    }

    const submitResult = await this.contactGateway.submit(
      mapContactRequestToSubmitPayload(
        contactResult.data,
        {
          pageLocation: this.location.href(),
          trafficSource: getTrafficSource(this.location),
          userAgent: this.navigator.userAgent(),
          createdAt: new Date(this.clock.now()).toISOString()
        }
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
    return { ok: true, data: submitResult.data }
  }
}

function inferContactNameFromEmail(email: string): string {
  const localPart = email.split('@')[0]?.trim() ?? ''
  const normalizedLocalPart = localPart.replace(/[._-]+/g, ' ').trim()
  const fallback = 'Contacto Web'
  return normalizedLocalPart.length >= 2 ? normalizedLocalPart : fallback
}

function normalizeContactFormPayload(payload: ContactFormPayload): {
  firstName?: string
  lastName?: string
  company?: string
  email?: string
  phone?: string
  geographicLocation?: string
  comment?: string
} {
  const firstName = normalizeOptional(payload.firstName)
  const lastName = normalizeOptional(payload.lastName)
  const company = normalizeOptional(payload.company)
  const email = normalizeOptional(payload.email)
  const phone = normalizeOptional(payload.phone)
  const geographicLocation = normalizeOptional(payload.geographicLocation)
  const comment = normalizeOptional(payload.comment)

  return {
    ...(firstName ? { firstName } : {}),
    ...(lastName ? { lastName } : {}),
    ...(company ? { company } : {}),
    ...(email ? { email } : {}),
    ...(phone ? { phone } : {}),
    ...(geographicLocation ? { geographicLocation } : {}),
    ...(comment ? { comment } : {})
  }
}

function buildContactDisplayName(payload: {
  firstName?: string
  lastName?: string
  company?: string
  email?: string
  phone?: string
}): string {
  const fullName = [payload.firstName, payload.lastName].filter(Boolean).join(' ').trim()
  if (fullName.length >= 2) {
    return fullName
  }

  if (payload.company && payload.company.length >= 2) {
    return payload.company
  }

  if (payload.email) {
    return inferContactNameFromEmail(payload.email)
  }

  if (payload.phone) {
    return `Contacto ${payload.phone}`
  }

  return 'Contacto Web'
}

function normalizeOptional(value: string): string | undefined {
  const trimmed = value.trim()
  return trimmed || undefined
}

function buildContactId(now: number): string {
  const randomPart = globalThis.crypto?.randomUUID?.().replace(/-/g, '').slice(0, 12)
  const fallbackRandomPart = Math.random().toString(36).slice(2, 14)
  return `contact_${now}_${randomPart ?? fallbackRandomPart}`
}

function getTrafficSource(location: LocationProvider): string {
  const params = new URLSearchParams(location.search())
  const utmSource = params.get('utm_source')
  if (utmSource) {
    return utmSource
  }
  return location.referrer() || 'direct'
}
