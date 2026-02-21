# Contrato API: Pricing Publico + Health (`VITE_BACKEND_BASE_URL`)

## 1) Base URL y endpoints

- Variable fuente: `VITE_BACKEND_BASE_URL`
- Validacion en frontend:
  - En desarrollo (`DEV`): acepta `http://` o `https://`
  - En produccion: exige `https://`
- Endpoints de este contrato:
  - `GET ${VITE_BACKEND_BASE_URL}/v1/public/pricing`
  - `GET ${VITE_BACKEND_BASE_URL}/v1/health`
- Alias legacy de compatibilidad:
  - `GET ${VITE_BACKEND_BASE_URL}/mock.php` -> misma respuesta que `/v1/public/pricing`

Referencia de implementacion:
- `src/infrastructure/config/viteConfig.ts`
- `src/infrastructure/content/contentRepository.ts`
- `backend/fastapi/main.py`
- `v1/public/pricing/index.php`
- `v1/health/index.php`

## 2) Endpoint de precios publicos

### 2.1 `GET /v1/public/pricing`

Uso:
- El frontend consulta este endpoint en runtime.
- El frontend no publica montos en la web: muestra `Consultar al WhatsApp`.
- El frontend solo conserva en memoria `visita_diagnostico_hasta_2h_ars` para logica interna futura.

Headers recomendados de response:
- `Content-Type: application/json`
- `Cache-Control: max-age=60`

Payload canonico:
```json
{
  "visita_diagnostico_hasta_2h_ars": 275000,
  "updated_at": "2026-02-21T00:00:00Z"
}
```

Alias aceptados por parser frontend para el mismo dato:
- `visita_diagnostico_hasta2h_ars`
- `visita_diagnostico_hasta_2h_ars`
- `visita_diagnostico_2h_ars`
- `visita_diagnostico_2h`
- `visita_diagnostico_ars`
- `visitaDiagnosticoHasta2hARS`

Validacion frontend:
- acepta `number` o `string` numerico
- descarta valores negativos
- si no hay valor usable, mantiene fallback visual `Consultar al WhatsApp`

## 3) Endpoint de salud

### 3.1 `GET /v1/health`

Uso recomendado:
- monitoreo de disponibilidad de API y edge
- chequeos de conectividad en frontend, CI y uptime checks

Headers recomendados de response:
- `Content-Type: application/json`
- `Cache-Control: no-store`

Response sugerida:
```json
{
  "status": "ok",
  "service": "datamaq-api",
  "version": "v1",
  "timestamp": "2026-02-21T00:00:00Z"
}
```

## 4) Requisitos backend

- Habilitar CORS para origen/es del frontend (en FastAPI via `ALLOWED_ORIGINS`).
- Mantener TLS en produccion (`https://`).
- No exponer secretos en endpoints publicos.

## 5) Compatibilidad

- Contrato vigente para frontend (fecha: 2026-02-21).
- Cambios breaking deben versionarse (`/v2/...`) o mantener compatibilidad temporal.
