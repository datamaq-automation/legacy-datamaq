import type { ComputedRef } from 'vue'
import { computed } from 'vue'
import { useContent } from '@/ui/composables/useContent'
import type { ServiceCardContent, ServicesContent } from '@/domain/types/content'
import type { ServiciosSectionProps } from '@/ui/types/sections'

interface ServiciosSectionState {
  chatEnabled: ComputedRef<boolean>
  services: ServicesContent
  primaryCard: ServiceCardContent
  secondaryCard: ServiceCardContent
}

export function useServiciosSection(props: ServiciosSectionProps): ServiciosSectionState {
  const chatEnabled = computed(() => props.chatEnabled)
  const { services } = useContent()
  const primaryCard = services.cards[0]!
  const secondaryCard = services.cards[1]!

  return {
    chatEnabled,
    services,
    primaryCard,
    secondaryCard
  }
}
