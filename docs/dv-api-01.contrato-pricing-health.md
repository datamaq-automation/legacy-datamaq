# Contrato API: Pricing Publico + Health (`VITE_BACKEND_BASE_URL`)

## 1) Base URL y endpoints

- Variable fuente: `VITE_BACKEND_BASE_URL`
- Validacion en frontend:
  - En desarrollo (`DEV`): acepta `http://` o `https://`
  - En produccion: exige `https://`
- Convencion productiva: versionado `/v1` y recursos semanticos.
- Endpoints documentados en este archivo:
  - `GET ${VITE_BACKEND_BASE_URL}/v1/public/pricing`
  - `GET ${VITE_BACKEND_BASE_URL}/v1/health`
- Alias legacy temporal:
  - `GET ${VITE_BACKEND_BASE_URL}/mock.php` -> misma respuesta que `/v1/public/pricing`

Referencia de implementacion:
- `src/infrastructure/config/viteConfig.ts`
- `src/infrastructure/content/contentRepository.ts`
- `src/application/contact/contactBackendStatus.ts`

## 2) Endpoint de precios dinamicos

### 2.1 `GET /v1/public/pricing`

Uso:
- El frontend consulta en runtime (solo cliente) para hidratar precios comerciales.
- Si falla o no reconoce campos, mantiene fallback visual: `Consultar`.

Headers de request:
- `Accept: application/json, text/plain;q=0.9, */*;q=0.8`

### Campos de precio reconocidos (canonicos)

- `tarifaBaseDesdeARS`
- `trasladoMinimoARS`
- `visitaDiagnosticoHasta2hARS`
- `diagnosticoHoraAdicionalARS`

Alias aceptados por parser:
- `tarifa_base_desde_ars`, `tarifa_base_desde`, `tarifa_base_ars`, `tarifa_base`
- `traslado_minimo_ars`, `traslado_minimo`, `traslado_ars`
- `visita_diagnostico_hasta2h_ars`, `visita_diagnostico_hasta_2h_ars`, `visita_diagnostico_2h_ars`, `visita_diagnostico_2h`, `visita_diagnostico_ars`
- `diagnostico_hora_adicional_ars`, `diagnostico_hora_adicional`, `hora_adicional_diagnostico_ars`, `hora_adicional_diagnostico`

Tipos aceptados:
- Numero (`number`)
- String numerico con separadores (`"410000"`, `"410.000"`, `"410.000,00"`)

Restriccion:
- Valores negativos se descartan.

Ejemplo recomendado:
```json
{
  "tarifa_base_desde_ars": 410000,
  "traslado_minimo_ars": 15000,
  "visita_diagnostico_2h_ars": 275000,
  "diagnostico_hora_adicional_ars": 130000,
  "updated_at": "2026-02-21T00:00:00Z"
}
```

## 3) Endpoint de salud

### 3.1 `GET /v1/health`

Uso recomendado:
- Monitoreo de disponibilidad de API y edge.
- Diagnostico rapido de conectividad en frontends, CI y uptime checks.

Respuesta sugerida:
```json
{
  "status": "ok",
  "service": "datamaq-api",
  "version": "v1",
  "timestamp": "2026-02-21T00:00:00Z"
}
```

## 4) Requisitos backend para estos endpoints

- Habilitar CORS para origen/es del frontend.
- Responder `Content-Type` consistente (`application/json` recomendado).
- Garantizar TLS en produccion (`https://`).
- Evitar exponer secretos en respuestas publicas.
- Mantener cache-control acorde al recurso:
  - `health`: `no-store`
  - `pricing`: `max-age` corto o `ETag`, segun SLA.

## 5) Compatibilidad y versionado

- Este contrato corresponde al estado actual del frontend (fecha: 2026-02-21).
- Cambios breaking deben versionarse (por ejemplo `/v2/...`) o mantener alias de campos para compatibilidad.
- En este repo se mantiene `mock.php` como alias de transicion para entornos legacy.
