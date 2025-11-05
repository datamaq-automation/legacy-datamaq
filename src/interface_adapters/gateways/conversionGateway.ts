/*
Path: src/interface_adapters/gateways/conversionGateway.ts
*/

import { config } from '../../infrastructure/config'

export async function registrarConversion(payload: {
  tipo: string
  timestamp: string
  seccion: string
  web: string
  tiempo_navegacion: number
  fuente_trafico?: string
}) {
  // Agrega console.info antes de llamar a la API
  console.info(`Usando API_BASE_URL en registrarConversion: ${config.API_BASE_URL}/registrar_conversion.php`)
  const response = await fetch(`${config.API_BASE_URL}/registrar_conversion.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  return response
}
