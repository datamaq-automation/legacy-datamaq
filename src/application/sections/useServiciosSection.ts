/*
Path: src/application/sections/useServiciosSection.ts
*/

import type { ServicesContentPort } from '@/application/ports/Content'
import type { ServiceCardContent, ServicesContent } from '@/domain/types/content'

interface ServiciosSectionState {
  services: ServicesContent
  cards: ServiceCardContent[]
}

export function useServiciosSection(contentPort: ServicesContentPort): ServiciosSectionState {
  const services = contentPort.getServicesContent()
  const cards = services.cards

  return {
    services,
    cards
  }
}
