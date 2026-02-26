import type { CommercialConfig } from '@/domain/types/content'

export const appcontentUpp: CommercialConfig = {
  brandName: 'UPP',
  brandAriaLabel: 'UPP, inicio',
  baseOperativa: 'Base Operativa UPP',
  tarifaBaseDesdeARS: null,
  trasladoMinimoARS: null,
  whatsappUrl: 'https://wa.me/5491100000002',
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
