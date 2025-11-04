/*
Path: src/interface_adapters/gateways/conversionGateway.ts
*/

import { API_BASE_URL } from '../../infrastructure/config'

export async function registrarConversion(payload: {
  tipo: string
  timestamp: string
  seccion: string
  web: string
  tiempo_navegacion: number
}) {
  const response = await fetch(`${API_BASE_URL}/registrar_conversion.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  return response
}
