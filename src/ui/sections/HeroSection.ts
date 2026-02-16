import { useContainer } from '@/di/container'
import type { HeroSectionProps } from '@/ui/types/sections'

export function useHeroSection(_props: HeroSectionProps) {
  const { content } = useContainer()
  const hero = content.getHeroContent()
  const heroChips = [
    'Checklist + verificacion final',
    'Documentacion tecnica de cierre',
    'Respuesta en menos de 24 horas',
    'Cobertura GBA Norte / AMBA'
  ]

  return {
    hero,
    heroChips
  }
}
