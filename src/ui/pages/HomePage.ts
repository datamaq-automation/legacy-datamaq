import { useContainer } from '@/di/container'
import { trackSectionScroll } from '@/ui/controllers/contactController'
import type { HomePageContent } from '@/domain/types/content'
import { onMounted, onUnmounted } from 'vue'
import { mapNavbarLinks, toHomeSectionRoute } from './landingNavigation'
import { useContactPageActions } from './useContactPageActions'

type HomeVariant = 'direct' | 'authority'
// SOLID-DEBATE: Si aparece una tercera variante, evaluar estrategia inyectable por variante en lugar de branching local.

const HOME_SECTION_ORDER = ['#servicios', '#perfil', '#faq', '#contacto']
const SERVICE_ICON_BY_KEYWORD: Array<{ keyword: string; icon: string }> = [
  { keyword: 'python', icon: 'bi-bar-chart-line-fill' },
  { keyword: 'datos', icon: 'bi-bar-chart-line-fill' },
  { keyword: 'base de datos', icon: 'bi-database-fill' },
  { keyword: 'api', icon: 'bi-diagram-3-fill' },
  { keyword: 'mantenimiento', icon: 'bi-tools' },
  { keyword: 'repar', icon: 'bi-wrench-adjustable-circle-fill' },
  { keyword: 'consult', icon: 'bi-graph-up-arrow' },
  { keyword: 'instal', icon: 'bi-lightning-charge-fill' },
  { keyword: 'medic', icon: 'bi-speedometer2' },
  { keyword: 'diag', icon: 'bi-cpu-fill' }
]
const DOCK_ICON_BY_HREF: Record<string, string> = {
  '#top': 'bi-house-door-fill',
  '#servicios': 'bi-grid-1x2-fill',
  '#perfil': 'bi-person-badge-fill',
  '#faq': 'bi-patch-question-fill',
  '#contacto': 'bi-envelope-fill'
}
const PROFILE_ICON_BY_KEYWORD: Array<{ keyword: string; icon: string }> = [
  { keyword: 'ahorro', icon: 'bi-cash-coin' },
  { keyword: 'prevent', icon: 'bi-shield-check' },
  { keyword: 'diagn', icon: 'bi-activity' },
  { keyword: 'tiempo', icon: 'bi-stopwatch' },
  { keyword: 'parada', icon: 'bi-lightning-charge-fill' },
  { keyword: 'repuesto', icon: 'bi-box-seam' }
]

export function useHomePage() {
  const { content } = useContainer()
  const navbar = content.getNavbarContent()
  const hero = content.getHeroContent()
  const services = content.getServicesContent()
  const about = content.getAboutContent()
  const profile = content.getProfileContent()
  const decisionFlow = content.getContent().decisionFlow
  const homePage = content.getHomePageContent()
  const footer = content.getFooterContent()
  const legal = content.getLegalContent()
  const {
    contactCtaEnabled,
    isContactFormActive,
    footerYear,
    whatsappHref,
    isExternalWhatsappHref,
    handleChat,
    handleContactSubmit
  } = useContactPageActions()
  const homeVariant = resolveHomeVariant()
  const isDirectVariant = homeVariant === 'direct'
  const isAuthorityVariant = homeVariant === 'authority'
  const heroConditions = buildHeroConditions(hero.responseNote)
  const headerLinks = mapNavbarLinks(navbar)
    .filter((link) => HOME_SECTION_ORDER.includes(link.href))
    .slice(0, isDirectVariant ? 2 : 4)
  const quickLinks = buildQuickLinks(homePage, isDirectVariant)
  const dockLinks = buildDockLinks(homePage, isDirectVariant)
  const trustSignals = dedupeSignals([
    ...heroConditions,
    ...services.cards.map((card) => card.title),
    ...profile.bullets
  ]).slice(0, 6)
  const faqItems = decisionFlow.faqItems.slice(0, 4)
  const profileLead = about.paragraphs.find((paragraph) => paragraph.trim().length > 0) ?? hero.subtitle
  const profileDetail =
    about.paragraphs.find((paragraph) => paragraph.trim().length > 0 && paragraph !== profileLead) ??
    profile.bullets[0] ??
    hero.responseNote
  const profileBenefits = profile.bullets.map((bullet) => ({
    text: bullet,
    icon: getProfileBenefitIcon(bullet)
  }))
  const authorityHighlights = dedupeSignals([...heroConditions, ...profile.bullets, ...services.cards.map((card) => card.title)]).slice(0, 3)
  const urgencyBadge = hero.responseNote

  function getServiceIcon(cardId: string, title: string): string {
    const key = `${cardId} ${title}`.toLowerCase()
    return SERVICE_ICON_BY_KEYWORD.find((entry) => key.includes(entry.keyword))?.icon ?? 'bi-gear-wide-connected'
  }

  function handleHashChange() {
    if (typeof window === 'undefined') {
      return
    }
    if (!window.location.hash) {
      return
    }
    trackSectionScroll(window.location.hash)
  }

  onMounted(() => {
    if (typeof window === 'undefined') {
      return
    }
    window.addEventListener('hashchange', handleHashChange)
  })

  onUnmounted(() => {
    if (typeof window === 'undefined') {
      return
    }
    window.removeEventListener('hashchange', handleHashChange)
  })

  return {
    navbar,
    hero,
    services,
    about,
    profile,
    homeVariant,
    isDirectVariant,
    isAuthorityVariant,
    decisionFlow,
    homePage,
    footer,
    legal,
    contactCtaEnabled,
    isContactFormActive,
    whatsappHref,
    isExternalWhatsappHref,
    heroConditions,
    headerLinks,
    quickLinks,
    dockLinks,
    trustSignals,
    faqItems,
    profileLead,
    profileDetail,
    profileBenefits,
    authorityHighlights,
    urgencyBadge,
    footerYear,
    handleChat,
    getServiceIcon,
    handleContactSubmit
  }
}

function buildQuickLinks(
  homePage: HomePageContent,
  isDirectVariant: boolean
) {
  if (isDirectVariant) {
    return [
      {
        href: '#contacto',
        to: { path: '/contact' },
        label: homePage.headerContactLabel,
        shortLabel: homePage.dockLabels.contact,
        icon: 'bi-telephone-forward-fill'
      }
    ] as const
  }

  return [
    {
      href: '#servicios',
      to: toHomeSectionRoute('#servicios'),
      label: homePage.quickLinks.services,
      shortLabel: 'Servicios',
      icon: 'bi-search'
    },
    {
      href: '#perfil',
      to: toHomeSectionRoute('#perfil'),
      label: homePage.quickLinks.profile,
      shortLabel: 'Perfil',
      icon: 'bi-person-circle'
    }
  ] as const
}

function buildDockLinks(
  homePage: HomePageContent,
  isDirectVariant: boolean
) {
  const baseLinks: Array<{ href: string; label: string; to?: { path: string }; icon?: string }> = isDirectVariant
    ? [
        { href: '#top', label: homePage.dockLabels.home },
        {
          href: '#contacto',
          label: homePage.dockLabels.contact,
          to: { path: '/contact' },
          icon: 'bi-telephone-forward-fill'
        }
      ]
    : [
        { href: '#top', label: homePage.dockLabels.home },
        { href: '#servicios', label: homePage.dockLabels.services },
        { href: '#perfil', label: homePage.dockLabels.profile },
        { href: '#contacto', label: homePage.dockLabels.contact, to: { path: '/contact' } }
      ]

  return baseLinks.map((link) => ({
    ...link,
    to: link.to ?? toHomeSectionRoute(link.href),
    icon: link.icon ?? DOCK_ICON_BY_HREF[link.href] ?? 'bi-circle-fill'
  }))
}

function getProfileBenefitIcon(text: string): string {
  const normalizedText = text.toLowerCase()
  return PROFILE_ICON_BY_KEYWORD.find((entry) => normalizedText.includes(entry.keyword))?.icon ?? 'bi-check2-circle'
}

function resolveHomeVariant(): HomeVariant {
  if (typeof window === 'undefined') {
    return 'direct'
  }

  const rawVariant = new URLSearchParams(window.location.search).get('variant')?.trim().toLowerCase()
  if (!rawVariant) {
    return 'direct'
  }

  if (rawVariant === 'authority' || rawVariant === 'trust' || rawVariant === 'confianza') {
    return 'authority'
  }

  return 'direct'
}

function buildHeroConditions(responseNote: string): string[] {
  const separator = /\s+(?:\u00B7|\u00C2\u00B7)\s+/
  const parts = responseNote
    .split(separator)
    .map((condition) => condition.trim())
    .filter((condition) => condition.length > 0)

  return parts.length > 0 ? parts : [responseNote]
}

function dedupeSignals(signals: string[]): string[] {
  const seen = new Set<string>()

  return signals.filter((signal) => {
    const normalized = signal.trim()
    if (!normalized || seen.has(normalized)) {
      return false
    }
    seen.add(normalized)
    return true
  })
}
