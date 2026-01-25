/*
Path: src/application/sections/useServiciosSection.ts
*/

import type { ComputedRef } from 'vue'
import type { ServicesContentPort } from '@/application/ports/Content'
import type { ServiceCardContent, ServicesContent } from '@/domain/types/content'

interface ServiciosSectionState {
  chatEnabled: ComputedRef<boolean>
  services: ServicesContent
  primaryCard: ServiceCardContent
  secondaryCard: ServiceCardContent
}

export function useServiciosSection(
  contentPort: ServicesContentPort,
  chatEnabled: ComputedRef<boolean>
): ServiciosSectionState {
  const services = contentPort.getServicesContent()
  const primaryCard = services.cards[0]!
  const secondaryCard = services.cards[1]!

  return {
    chatEnabled,
    services,
    primaryCard,
    secondaryCard
  }
}
