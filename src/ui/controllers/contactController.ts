import type { ContactFormPayload } from '@/application/dto/contact'
import { useContainer } from '@/di/container'

const DEFAULT_BRAND_NAME = 'equipo técnico'
const DEFAULT_MACHINE_PLACEHOLDER = '[Tipo de Maquina]'
const WHATSAPP_BASE_DOMAIN = 'whatsapp.com'
const WA_SHORT_DOMAIN = 'wa.me'

export function getWhatsAppEnabled(): boolean {
  return Boolean(getWhatsAppHref())
}

export function getWhatsAppHref(): string | undefined {
  return buildPrefilledWhatsAppUrl(resolveWhatsAppUrl())
}

export function getContactEmail(): string | undefined {
  const value = getBrandContent().contactEmail
  return value?.trim() ? value : undefined
}

export function getContactFormActive(): boolean {
  return getBrandContent().contactFormActive
}

export function openWhatsApp(section: string = 'whatsapp', href?: string): void {
  const candidateUrl = resolveCandidateChatUrl(href)
  const whatsappUrl = buildPrefilledWhatsAppUrl(candidateUrl)
  const targetUrl = whatsappUrl ?? buildTrustedExternalUrl(candidateUrl)

  if (!targetUrl) {
    return
  }

  if (typeof window !== 'undefined') {
    window.open(targetUrl, '_blank', 'noopener,noreferrer')
  }

  const { engagementTracker } = useContainer()
  const trafficSource = getCurrentTrafficSource()
  engagementTracker.trackChat(section, trafficSource)
}

export function trackSectionScroll(sectionHref: string): void {
  const normalizedSection = normalizeSection(sectionHref)
  if (!normalizedSection) {
    return
  }

  const { engagementTracker } = useContainer()
  const trafficSource = getCurrentTrafficSource()
  engagementTracker.trackSectionScroll(normalizedSection, trafficSource)
}

export function submitContact(payload: ContactFormPayload) {
  return useContainer().useCases.submitContact.execute(payload)
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
    return undefined
  }

  if (!isTrustedWhatsAppUrl(parsedUrl)) {
    return undefined
  }

  parsedUrl.searchParams.set('text', buildDefaultWhatsAppMessage())
  return parsedUrl.toString()
}

function buildDefaultWhatsAppMessage(): string {
  const brandName = getBrandContent().brandName?.trim() || DEFAULT_BRAND_NAME
  return `Hola ${brandName}, necesito asistencia técnica para ${DEFAULT_MACHINE_PLACEHOLDER}.`
}

function getBrandContent() {
  return useContainer().content.getBrandContent()
}

function getSeoContent() {
  return useContainer().content.getSeoContent()
}

function getCurrentTrafficSource(): string {
  return getTrafficSource(useContainer().environment)
}

function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href)
}

function isWhatsAppHostname(hostname: string): boolean {
  const normalized = hostname.trim().toLowerCase()
  return hasDomain(normalized, WA_SHORT_DOMAIN) || hasDomain(normalized, WHATSAPP_BASE_DOMAIN)
}

function isTrustedWhatsAppUrl(url: URL): boolean {
  return url.protocol === 'https:' && isWhatsAppHostname(url.hostname)
}

function buildTrustedExternalUrl(href: string | undefined): string | undefined {
  const normalizedHref = normalizeHref(href)
  if (!normalizedHref) {
    return undefined
  }

  let targetUrl: URL
  try {
    targetUrl = new URL(normalizedHref)
  } catch {
    return undefined
  }

  if (targetUrl.protocol !== 'https:') {
    return undefined
  }

  const siteOrigin = getSeoContent().siteUrl?.trim()
  if (!siteOrigin) {
    return undefined
  }

  let siteUrl: URL
  try {
    siteUrl = new URL(siteOrigin)
  } catch {
    return undefined
  }

  return hasDomain(targetUrl.hostname.trim().toLowerCase(), siteUrl.hostname.trim().toLowerCase())
    ? targetUrl.toString()
    : undefined
}

function hasDomain(hostname: string, domain: string): boolean {
  return hostname === domain || hostname.endsWith(`.${domain}`)
}

function normalizeSection(sectionHref: string): string | undefined {
  const trimmed = sectionHref.trim()
  if (!trimmed) {
    return undefined
  }
  const section = trimmed.startsWith('#') ? trimmed.slice(1) : trimmed
  return section.trim() || undefined
}
