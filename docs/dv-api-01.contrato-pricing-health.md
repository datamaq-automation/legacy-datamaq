# Contrato API: Pricing Publico + Health (endpoints runtime por target)

## 1) Base URL y endpoints

- Base URL oficial (produccion): `https://api.datamaq.com.ar/v1`
- Base URL anterior deprecada: `https://datamaq.com.ar/api/v1`
- Variables fuente en `src/infrastructure/content/runtimeProfiles.json`:
  - `pricingApiUrl`
  - (compatibilidad legacy opcional: `backendBaseUrl` + `/v1/public/pricing`)
- Validacion en frontend:
  - acepta endpoints relativos (`/api/...`) para mismo dominio
  - para endpoints absolutos, en produccion se exige `https://`
  - bypass local controlado: en no-DEV, `allowInsecureBackend=true` solo habilita `http://localhost`, `http://127.0.0.1` o `http://[::1]`
- Endpoint actual recomendado:
  - `GET https://api.datamaq.com.ar/v1/pricing`

Referencia de implementacion:
- `src/infrastructure/config/viteConfig.ts`
- `src/infrastructure/content/contentRepository.ts`
- `backend/fastapi/main.py`

## 2) Endpoint de precios publicos

### 2.1 `GET https://api.datamaq.com.ar/v1/pricing`

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

### 3.1 `GET https://api.datamaq.com.ar/v1/health` (opcional)

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

- Contrato vigente para frontend (fecha: 2026-02-26).
- Cambios breaking deben versionarse (`/v2/...`) o mantener compatibilidad temporal.
