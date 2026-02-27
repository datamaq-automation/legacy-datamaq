# Pricing Publico: UI + Backend

## Objetivo operativo

- La web publica no muestra montos ARS.
- Todos los bloques comerciales visibles usan el texto fijo: `Consultar al WhatsApp`.
- El backend sigue exponiendo un unico valor numerico para uso interno futuro:
  - `diagnostico_lista_2h_ars`
  - valor hardcodeado actual: `275000` (ARS)
  - fuente: `public/api/_pricing_impl.php` (clave `diagnostico_lista_2h_ars`)

## Comportamiento de frontend

- Endpoint consultado en runtime:
  - `GET /api/v1/pricing`
- Visualizacion:
  - siempre `Consultar al WhatsApp` para tarifa base, traslado, diagnostico y hora adicional.
- Parseo:
  - solo se toma `diagnostico_lista_2h_ars` (con aliases compatibles).
  - el resto de campos de pricing se ignoran.
- Fallback:
  - si falla fetch o parse, la UI permanece en `Consultar al WhatsApp`.

Archivos clave:
- `src/infrastructure/content/Appcontent.active.ts`
- `src/infrastructure/content/contentRepository.ts`

## Contrato backend

### `GET /api/v1/pricing`

Response:
```json
{
  "status": "ok",
  "request_id": "req-20260227000000-ab12cd34",
  "version": "v1",
  "currency": "ARS",
  "data": {
    "diagnostico_lista_2h_ars": 275000
  }
}
```

Headers:
- `Cache-Control: max-age=60`
- `Content-Type: application/json`

### `GET /api/v1/health` (opcional)

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
