import { computed } from 'vue'
import { useContainer } from '@/di/container'
import type { HeroSectionProps } from '@/ui/types/sections'

export function useHeroSection(props: HeroSectionProps) {
  const chatEnabled = computed(() => props.chatEnabled)
  const { content } = useContainer()
  const hero = content.getHeroContent()
  const benefit1 = hero.benefits[0]!
  const benefit2 = hero.benefits[1]!
  const benefit3 = hero.benefits[2]!
  const heroChips = [
    'Industria',
    'GBA Norte prioritario',
    'Equipo provisto por el cliente',
    'Instalacion tipica ~4h'
  ]

  return {
    chatEnabled,
    hero,
    benefit1,
    benefit2,
    benefit3,
    heroChips
  }
}
