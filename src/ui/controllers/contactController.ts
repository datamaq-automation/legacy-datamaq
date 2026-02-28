import type { ContactFormPayload } from '@/application/dto/contact'
import { useContainer } from '@/di/container'
import { useContactFacade } from '@/ui/features/contact/useContactFacade'

export function getWhatsAppEnabled(): boolean {
  return Boolean(resolveWhatsAppUrl())
}

export function getWhatsAppHref(): string | undefined {
  return resolveWhatsAppUrl()
}

export function getContactEmail(): string | undefined {
  const value = useContainer().config.contactEmail
  return value?.trim() ? value : undefined
}

export function getContactFormActive(): boolean {
  return useContainer().config.contactFormActive
}

export function getEmailFormActive(): boolean {
  return useContainer().config.emailFormActive
}

export function openWhatsApp(section: string = 'whatsapp', href?: string): void {
  const whatsappUrl = normalizeHref(href) ?? resolveWhatsAppUrl()
  if (!whatsappUrl) {
    return
  }

  if (typeof window !== 'undefined') {
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
  }

  const { engagementTracker, environment } = useContainer()
  const trafficSource = getTrafficSource(environment)
  engagementTracker.trackChat(section, trafficSource)
}

export function trackSectionScroll(sectionHref: string): void {
  const normalizedSection = normalizeSection(sectionHref)
  if (!normalizedSection) {
    return
  }

  const { engagementTracker, environment } = useContainer()
  const trafficSource = getTrafficSource(environment)
  engagementTracker.trackSectionScroll(normalizedSection, trafficSource)
}

export function submitContact(section: string, payload: ContactFormPayload) {
  return useContactFacade().submitContact(section, payload)
}

export function submitMail(section: string, payload: ContactFormPayload) {
  return useContactFacade().submitMail(section, payload)
}

function getTrafficSource(location: { search(): string; referrer(): string }): string {
  const params = new URLSearchParams(location.search())
  const utmSource = params.get('utm_source')
  if (utmSource) {
    return utmSource
  }
  return location.referrer() || 'direct'
}

function resolveWhatsAppUrl(): string | undefined {
  const href = useContainer().content.getHeroContent().primaryCta.href
  return normalizeHref(href)
}

function normalizeHref(href: string | undefined): string | undefined {
  if (!href) {
    return undefined
  }
  const trimmedHref = href.trim()
  return trimmedHref ? trimmedHref : undefined
}

function normalizeSection(sectionHref: string): string | undefined {
  const trimmed = sectionHref.trim()
  if (!trimmed) {
    return undefined
  }
  const section = trimmed.startsWith('#') ? trimmed.slice(1) : trimmed
  return section.trim() || undefined
}
