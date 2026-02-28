/*
Path: src/domain/types/content.ts
*/

export type CTAAction = 'whatsapp' | 'contact' | 'services'

export interface CTAContent {
  label: string
  href?: string
  action?: CTAAction
}

export interface HeroBenefit {
  title: string
  text: string
  variant: 'success' | 'primary' | 'warning'
}

export interface ImageContent {
  src: string
  alt: string
  width?: number
  height?: number
}

export interface HeroContent {
  badge: string
  title: string
  subtitle: string
  responseNote: string
  primaryCta: CTAContent
  secondaryCta: CTAContent
  benefits: HeroBenefit[]
  image: ImageContent
}

export interface ServiceCardContent {
  id: string
  title: string
  description: string
  subtitle: string
  media: ImageContent
  items: string[]
  figure?: ImageContent & { caption?: string }
  note?: string
  cta: CTAContent & { section: string }
}

export interface ServicesContent {
  title: string
  cards: ServiceCardContent[]
}

export interface AboutContent {
  title: string
  paragraphs: string[]
  image: ImageContent
}

export interface NavbarContent {
  brand: string
  brandAriaLabel: string
  links: Array<{ label: string; href: string }>
  contactLabel: string
}

export interface FooterContent {
  note: string
}

export interface LegalContent {
  text: string
}

export interface ContactContent {
  title: string
  subtitle: string
  labels: {
    firstName?: string
    lastName?: string
    company?: string
    email?: string
    phone?: string
    geographicLocation?: string
    comment?: string
    message?: string
  }
  submitLabel: string
  checkingMessage: string
  unavailableMessage: string
  successMessage: string
  errorMessage: string
  unexpectedErrorMessage: string
}

export interface ConsentContent {
  title: string
  description: string
  acceptLabel: string
  rejectLabel: string
}

export interface DecisionFlowStepContent {
  order: number
  title: string
  description: string
}

export interface DecisionFlowFaqContent {
  question: string
  answer: string
}

export interface DecisionFlowContent {
  processTitle: string
  processStepPrefixLabel: string
  pricingTitle: string
  pricingSummaryFallback: string
  pricingIncludesTitle: string
  pricingIncludes: string[]
  pricingExcludesTitle: string
  pricingExcludes: string[]
  pricingVariablesTitle: string
  pricingVariables: string[]
  coverageTitle: string
  coverageAreasTitle: string
  coverageAreas: string[]
  responseTimesTitle: string
  responseTimes: string[]
  whatsappLabel: string
  contactFormLabel: string
  faqTitle: string
  processSteps: DecisionFlowStepContent[]
  faqItems: DecisionFlowFaqContent[]
}

export interface ThanksContent {
  badge: string
  title: string
  subtitle: string
  whatsappButtonLabel: string
  goHomeButtonLabel: string
}

/**
 * Perfil tecnico y enfoque de trabajo.
 */
export interface ProfileContent {
  title: string
  bullets: string[]
}

export interface AppContent {
  hero: HeroContent
  services: ServicesContent
  about: AboutContent
  profile: ProfileContent

  navbar: NavbarContent
  footer: FooterContent
  legal: LegalContent
  contact: ContactContent
  consent: ConsentContent
  decisionFlow: DecisionFlowContent
  thanks: ThanksContent
}

export interface CommercialConfig {
  brandName: string
  brandAriaLabel: string
  baseOperativa: string
  tarifaBaseDesdeARS: number | null
  trasladoMinimoARS: number | null
  whatsappUrl: string

  // Diagnóstico (publicado)
  visitaDiagnosticoHasta2hARS: number | null
  diagnosticoHoraAdicionalARS: number | null

  descuentos: {
    cooperativasPct: number
    pymeGraficaPct: number
  }

  equipos: {
    medidorNombre: string // "Powermeter"
    automateNombre: string // "Automate"
  }
}
