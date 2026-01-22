import { computed } from 'vue'
import { useContent } from '@/ui/composables/useContent'
import type { ServiciosSectionProps } from '@/ui/types/sections'

export function useServiciosSection(props: ServiciosSectionProps) {
  const chatEnabled = computed(() => props.chatEnabled)
  const { services } = useContent()
  const primaryCard = services.cards[0]
  const secondaryCard = services.cards[1]

  return {
    chatEnabled,
    services,
    primaryCard,
    secondaryCard
  }
}
