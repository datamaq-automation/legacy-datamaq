export interface HeroSectionProps {
  contactCtaEnabled: boolean
}

export interface HeroSectionEmits {
  (e: 'primary-cta', href?: string): void
}

export interface ServiciosSectionProps {
  contactCtaEnabled: boolean
}

export interface ContactCtaPayload {
  section: string
  href?: string
}

export interface ServiciosSectionEmits {
  (e: 'contact', payload: ContactCtaPayload): void
}
