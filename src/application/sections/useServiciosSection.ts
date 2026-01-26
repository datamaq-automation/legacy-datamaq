/*
Path: src/application/sections/useServiciosSection.ts
*/

import type { ComputedRef } from 'vue'
import type { ServicesContentPort } from '@/application/ports/Content'
import type { ServiceCardContent, ServicesContent } from '@/domain/types/content'

interface ServiciosSectionState {
  chatEnabled: ComputedRef<boolean>
  services: ServicesContent
  cards: ServiceCardContent[]
}

export function useServiciosSection(
  contentPort: ServicesContentPort,
  chatEnabled: ComputedRef<boolean>
): ServiciosSectionState {
  const services = contentPort.getServicesContent()
  const cards = services.cards

  return {
    chatEnabled,
    services,
    cards
  }
}
