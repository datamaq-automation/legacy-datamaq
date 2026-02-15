import { useContainer } from '@/di/container'
import type { HeroSectionProps } from '@/ui/types/sections'

export function useHeroSection(_props: HeroSectionProps) {
  const { content } = useContainer()
  const hero = content.getHeroContent()
  const benefit1 = hero.benefits[0]!
  const benefit2 = hero.benefits[1]!
  const benefit3 = hero.benefits[2]!
  const heroChips = [
    'Checklist + verificacion final',
    'Documentacion tecnica de cierre',
    'Respuesta en menos de 24 horas',
    'Cobertura GBA Norte / AMBA'
  ]

  return {
    hero,
    benefit1,
    benefit2,
    benefit3,
    heroChips
  }
}
