import { useContainer } from '@/di/container'
import type { HeroSectionProps } from '@/ui/types/sections'

export function useHeroSection(_props: HeroSectionProps) {
  const { content } = useContainer()
  const hero = content.getHeroContent()
  const heroChips = [
    'Respuesta en menos de 24 horas',
    'Checklist + verificacion final',
    'Documentacion tecnica de cierre',
    'Cobertura GBA Norte / AMBA'
  ]
  const heroConditions = hero.responseNote
    .split(/\s+[·]\s+/)
    .map((condition) => condition.trim())
    .filter((condition) => condition.length > 0)

  if (heroConditions.length === 0) {
    heroConditions.push(hero.responseNote)
  }

  return {
    hero,
    heroChips,
    heroConditions
  }
}
