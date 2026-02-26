import type { CommercialConfig } from '@/domain/types/content'
import { buildAppContent } from '@/infrastructure/content/Appcontent.shared'

export const commercialConfig: CommercialConfig = {
  brandName: 'Marca Example',
  brandAriaLabel: 'Marca Example, inicio',
  baseOperativa: 'Base Operativa',
  tarifaBaseDesdeARS: null,
  trasladoMinimoARS: null,
  whatsappUrl: 'https://wa.me/5491100000000',
  visitaDiagnosticoHasta2hARS: null,
  diagnosticoHoraAdicionalARS: null,
  descuentos: {
    cooperativasPct: 0,
    pymeGraficaPct: 0
  },
  equipos: {
    medidorNombre: 'Powermeter',
    automateNombre: 'Automate'
  }
}

export { buildAppContent }
