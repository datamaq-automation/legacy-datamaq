export interface HeroSectionProps {
  chatEnabled: boolean
}

export interface HeroSectionEmits {
  (e: 'primary-cta'): void
}

export interface ServiciosSectionProps {
  chatEnabled: boolean
}

export interface ServiciosSectionEmits {
  (e: 'contact', section: string): void
}
