import { commercialConfig } from '@/infrastructure/content/content'

export type NetworkType = 'Monofasica' | 'Trifasica'
export type ServiceInquiry =
  | 'Instalacion powermeter/automate'
  | 'Diagnostico y reparacion de falla electronica/electrica'
export type MeasurementPoints = '1' | '2-3' | '4+'
export type CanCutPower = 'Si' | 'No'
export type UrgencyLevel = 'Hoy' | 'Esta semana' | 'Planificado'

export interface PrequalificationPayload {
  location: string
  networkType: NetworkType
  serviceInquiry: ServiceInquiry
  measurementPoints?: MeasurementPoints
  canCutPower?: CanCutPower
  urgency?: UrgencyLevel
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
  const automate = commercialConfig.equipos.automateNombre

  const lines = [
    'Hola, quiero coordinar una visita.',
    `Servicio: Instalacion ${medidor}/${automate} (equipo provisto por el cliente)`,
    `Tarifa base publicada: ${tariff}`,
    `Base operativa: ${baseOperativa}`,
    `Motivo de la consulta: ${payload.serviceInquiry}`,
    `Ubicacion: ${payload.location}`,
    `Tipo de red: ${payload.networkType}`
  ]

  if (payload.measurementPoints) {
    lines.push(`Puntos de medicion: ${payload.measurementPoints}`)
  }
  if (payload.canCutPower) {
    lines.push(`Se puede cortar energia: ${payload.canCutPower}`)
  }
  if (payload.urgency) {
    lines.push(`Urgencia: ${payload.urgency}`)
  }

  return lines.join('\n')
}
