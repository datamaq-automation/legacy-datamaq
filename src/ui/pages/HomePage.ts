import { useContainer } from '@/di/container'
import {
  getContactFormActive,
  getEmailFormActive,
  getWhatsAppEnabled,
  getWhatsAppHref,
  openWhatsApp,
  submitContact,
  submitMail,
  trackSectionScroll
} from '@/ui/controllers/contactController'
import { computed, onMounted, onUnmounted } from 'vue'

const HOME_SECTION_ORDER = ['#servicios', '#perfil', '#faq', '#contacto']
const SERVICE_ICON_BY_KEYWORD: Array<{ keyword: string; icon: string }> = [
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

export function useHomePage() {
  const { content } = useContainer()
  const navbar = content.getNavbarContent()
  const hero = content.getHeroContent()
  const services = content.getServicesContent()
  const about = content.getAboutContent()
  const profile = content.getProfileContent()
  const decisionFlow = content.getContent().decisionFlow
  const footer = content.getFooterContent()
  const legal = content.getLegalContent()
  const contactCtaEnabled = getWhatsAppEnabled()
  const isContactFormActive = getContactFormActive()
  const isEmailFormActive = getEmailFormActive()
  const whatsappHref = computed(() => getWhatsAppHref() ?? '#contacto')
  const isExternalWhatsappHref = computed(() => /^https?:\/\//.test(whatsappHref.value))
  const heroConditions = buildHeroConditions(hero.responseNote)
  const headerLinks = navbar.links.filter((link) => HOME_SECTION_ORDER.includes(link.href)).slice(0, 4)
  const quickLinks = [
    {
      href: '#servicios',
      label: 'Explorar servicios',
      shortLabel: 'Servicios',
      icon: 'bi-search'
    },
    {
      href: '#perfil',
      label: 'Ver perfil tecnico',
      shortLabel: 'Perfil',
      icon: 'bi-person-circle'
    }
  ] as const
  const dockLinks = [
    { href: '#top', label: 'Inicio' },
    { href: '#servicios', label: 'Servicios' },
    { href: '#perfil', label: 'Perfil' },
    { href: '#contacto', label: 'Contacto' }
  ].map((link) => ({
    ...link,
    icon: DOCK_ICON_BY_HREF[link.href] ?? 'bi-circle-fill'
  }))
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
  const footerYear = new Date().getFullYear()

  function handleChat(section: string, href?: string) {
    openWhatsApp(section, href)
  }

  function getServiceIcon(cardId: string, title: string): string {
    const key = `${cardId} ${title}`.toLowerCase()
    return SERVICE_ICON_BY_KEYWORD.find((entry) => key.includes(entry.keyword))?.icon ?? 'bi-gear-wide-connected'
  }

  function handleEmailSubmit(payload: Parameters<typeof submitMail>[0]) {
    return submitMail(payload)
  }

  function handleContactSubmit(payload: Parameters<typeof submitContact>[0]) {
    return submitContact(payload)
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
    decisionFlow,
    footer,
    legal,
    contactCtaEnabled,
    isContactFormActive,
    isEmailFormActive,
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
    footerYear,
    handleChat,
    getServiceIcon,
    handleContactSubmit,
    handleEmailSubmit
  }
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
