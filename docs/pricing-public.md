# Pricing Publico: UI + Backend

## Objetivo operativo

- La web publica no muestra montos ARS.
- Todos los bloques comerciales visibles usan el texto fijo: `Consultar al WhatsApp`.
- El backend sigue exponiendo un unico valor numerico para uso interno futuro:
  - `visita_diagnostico_hasta_2h_ars`

## Comportamiento de frontend

- Endpoint consultado en runtime:
  - `GET ${backendBaseUrl}/v1/public/pricing`
- Visualizacion:
  - siempre `Consultar al WhatsApp` para tarifa base, traslado, diagnostico y hora adicional.
- Parseo:
  - solo se toma `visita_diagnostico_hasta_2h_ars` (con aliases compatibles).
  - el resto de campos de pricing se ignoran.
- Fallback:
  - si falla fetch o parse, la UI permanece en `Consultar al WhatsApp`.

Archivos clave:
- `src/infrastructure/content/Appcontent.ts`
- `src/infrastructure/content/contentRepository.ts`

## Contrato backend

### `GET /v1/public/pricing`

Response:
```json
{
  "visita_diagnostico_hasta_2h_ars": 275000,
  "updated_at": "2026-02-21T00:00:00Z"
}
```

Headers:
- `Cache-Control: max-age=60`
- `Content-Type: application/json`

### `GET /v1/health`

Response ejemplo:
```json
{
  "status": "ok",
  "service": "datamaq-api",
  "version": "v1",
  "timestamp": "2026-02-21T00:00:00Z"
}
```

Headers:
- `Cache-Control: no-store`
- `Content-Type: application/json`

### CORS

- Configurar via variable de entorno backend:
  - `ALLOWED_ORIGINS=https://www.datamaq.com.ar,https://datamaq.com.ar`
