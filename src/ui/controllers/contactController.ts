import type { ContactFormPayload } from '@/application/dto/contact'
import { useContainer } from '@/di/container'
import { useContactFacade } from '@/ui/features/contact/useContactFacade'

const DEFAULT_BRAND_NAME = 'DataMaq'
const DEFAULT_MACHINE_PLACEHOLDER = '[Tipo de Maquina]'

export function getWhatsAppEnabled(): boolean {
  return Boolean(resolveWhatsAppUrl())
}

export function getWhatsAppHref(): string | undefined {
  return buildPrefilledWhatsAppUrl(resolveWhatsAppUrl())
}

export function getContactEmail(): string | undefined {
  const value = useContainer().content.getBrandContent().contactEmail
  return value?.trim() ? value : undefined
}

export function getContactFormActive(): boolean {
  return useContainer().content.getBrandContent().contactFormActive
}

export function openWhatsApp(section: string = 'whatsapp', href?: string): void {
  const whatsappUrl = buildPrefilledWhatsAppUrl(resolveCandidateChatUrl(href))
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

export function submitContact(payload: ContactFormPayload) {
  return useContactFacade().submitContact(payload)
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

function resolveCandidateChatUrl(href: string | undefined): string | undefined {
  const normalizedHref = normalizeHref(href)
  if (normalizedHref && isExternalHref(normalizedHref)) {
    return normalizedHref
  }

  return resolveWhatsAppUrl()
}

function normalizeHref(href: string | undefined): string | undefined {
  if (!href) {
    return undefined
  }
  const trimmedHref = href.trim()
  return trimmedHref ? trimmedHref : undefined
}

function buildPrefilledWhatsAppUrl(href: string | undefined): string | undefined {
  const normalizedHref = normalizeHref(href)
  if (!normalizedHref) {
    return undefined
  }

  let parsedUrl: URL
  try {
    parsedUrl = new URL(normalizedHref)
  } catch {
    return normalizedHref
  }

  if (!isWhatsAppHostname(parsedUrl.hostname)) {
    return normalizedHref
  }

  parsedUrl.searchParams.set('text', buildDefaultWhatsAppMessage())
  return parsedUrl.toString()
}

function buildDefaultWhatsAppMessage(): string {
  const brandName = useContainer().content.getBrandContent().brandName?.trim() || DEFAULT_BRAND_NAME
  return `Hola ${brandName}, necesito asistencia tecnica para ${DEFAULT_MACHINE_PLACEHOLDER}.`
}

function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href)
}

function isWhatsAppHostname(hostname: string): boolean {
  const normalized = hostname.trim().toLowerCase()
  return normalized === 'wa.me' || normalized.endsWith('.wa.me') || normalized.endsWith('whatsapp.com')
}

function normalizeSection(sectionHref: string): string | undefined {
  const trimmed = sectionHref.trim()
  if (!trimmed) {
    return undefined
  }
  const section = trimmed.startsWith('#') ? trimmed.slice(1) : trimmed
  return section.trim() || undefined
}
