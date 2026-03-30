import type { CommercialConfig } from '@/domain/types/content'
import type { AppContent } from '@/domain/types/content'
import type { BrandContent, SeoContent } from '@/domain/types/site'
import { datamaqSiteSnapshot } from '@/infrastructure/content/siteSnapshot.datamaq'

const { brand } = datamaqSiteSnapshot

export const commercialConfig: CommercialConfig = {
  brandName: brand.brandName,
  brandAriaLabel: brand.brandAriaLabel,
  baseOperativa: brand.baseOperativa,
  whatsappUrl: brand.whatsappUrl ?? 'https://wa.me/5491100000000',
  tarifaBaseDesdeARS: null,
  trasladoMinimoARS: null,
  visitaDiagnosticoHasta2hARS: null,
  diagnosticoHoraAdicionalARS: null,
  descuentos: {
    cooperativasPct: 0,
    pymeGraficaPct: 0
  },
  equipos: {
    medidorNombre: brand.equipmentNames.medidorNombre,
    automateNombre: brand.equipmentNames.automateNombre
  }
}

export function buildAppContent(_config: CommercialConfig): AppContent {
  return datamaqSiteSnapshot.content
}

export function buildBrandContent(_config: CommercialConfig): BrandContent {
  return datamaqSiteSnapshot.brand
}

export function buildSeoContent(): SeoContent {
  return datamaqSiteSnapshot.seo
}
