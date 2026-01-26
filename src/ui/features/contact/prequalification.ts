import { commercialConfig } from '@/infrastructure/content/content'

export type NetworkType = 'Monofasica' | 'Trifasica'
export type MeasurementPoints = '1' | '2-3' | '4+'
export type CanCutPower = 'Si' | 'No'
export type UrgencyLevel = 'Hoy' | 'Esta semana' | 'Planificado'

export interface PrequalificationPayload {
  location: string
  networkType: NetworkType
  measurementPoints: MeasurementPoints
  canCutPower: CanCutPower
  urgency: UrgencyLevel
}

const formatARS = (value: number) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
  }).format(value)

export function buildPrequalificationMessage(payload: PrequalificationPayload): string {
  const tariff = formatARS(commercialConfig.tarifaBaseDesdeARS)
  const baseOperativa = commercialConfig.baseOperativa
  const medidor = commercialConfig.equipos.medidorNombre

  return [
    'Hola, quiero coordinar una visita.',
    `Servicio: Instalacion ${medidor} (equipo provisto por el cliente)`,
    `Tarifa base publicada: ${tariff}`,
    `Base operativa: ${baseOperativa}`,
    `Ubicacion: ${payload.location}`,
    `Tipo de red: ${payload.networkType}`,
    `Puntos de medicion: ${payload.measurementPoints}`,
    `Se puede cortar energia: ${payload.canCutPower}`,
    `Urgencia: ${payload.urgency}`
  ].join('\n')
}
