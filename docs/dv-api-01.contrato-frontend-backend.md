# Contrato Frontend <-> Backend (`VITE_BACKEND_BASE_URL`)

## 1) Base URL y construccion de endpoints

- Variable fuente: `VITE_BACKEND_BASE_URL`
- Validacion en frontend:
  - En desarrollo (`DEV`): acepta `http://` o `https://`
  - En produccion: exige `https://`
- Convencion productiva: versionado `/v1` y recursos semanticos.
- Endpoints construidos en frontend:
  - `POST ${VITE_BACKEND_BASE_URL}/v1/contact`
  - `POST ${VITE_BACKEND_BASE_URL}/v1/mail`
  - `GET  ${VITE_BACKEND_BASE_URL}/v1/public/pricing`
- Endpoint recomendado de salud (operativo/backend):
  - `GET  ${VITE_BACKEND_BASE_URL}/v1/health`
- Alias legacy de prueba (solo compatibilidad temporal):
  - `GET  ${VITE_BACKEND_BASE_URL}/mock.php` -> misma respuesta que `/v1/public/pricing`

Referencia de implementacion:
- `src/infrastructure/config/viteConfig.ts`
- `src/infrastructure/contact/contactApiGateway.ts`
- `src/infrastructure/content/contentRepository.ts`

## 2) Endpoints de contacto comercial

### 2.1 `POST /v1/contact`
### 2.2 `POST /v1/mail`

Ambos endpoints usan el mismo contrato de payload/respuesta.

### Request

Headers esperados:
- `Content-Type: application/json`

Body JSON:
```json
{
  "name": "string",
  "email": "string",
  "message": "string",
  "custom_attributes": {
    "message": "string"
  },
  "meta": {
    "page_location": "string",
    "traffic_source": "string",
    "user_agent": "string",
    "created_at": "ISO-8601 string"
  },
  "attribution": {
    "utmSource": "string opcional",
    "utmMedium": "string opcional",
    "utmCampaign": "string opcional",
    "utmTerm": "string opcional",
    "utmContent": "string opcional",
    "gclid": "string opcional"
  }
}
```

Notas:
- `custom_attributes` se serializa como `Record<string, string>`.
- `attribution` es opcional.

Referencia:
- `src/infrastructure/contact/contactPayloadBuilder.ts`
- `src/application/dto/contact.ts`

### Response (exito y error)

El frontend considera exito cualquier `2xx`.

Campos opcionales que el frontend intenta extraer:
- `requestId` desde body o headers (`x-request-id`, `request-id`, `x-correlation-id`)
- `errorCode` desde body (`error_code`, `errorCode`, `code`, `error.code`)
- `backendMessage` desde body (`detail`, `message`, `error`, `error_message`, `description`, `error.message`) o fallback de `text`

Ejemplos validos:
```json
{
  "request_id": "abc-123",
  "message": "Contacto recibido"
}
```

```json
{
  "error_code": "VALIDATION_ERROR",
  "detail": "email inválido"
}
```

Mapeo de errores frontend:
- `status === 0` -> `NetworkError`
- `status !== 0` y no `2xx` -> `BackendError`
- URL ausente/no permitida -> `Unavailable`

Referencia:
- `src/infrastructure/contact/contactResponseFeedback.ts`
- `src/infrastructure/contact/contactSubmissionErrors.ts`
- `src/application/contact/contactEndpointPolicy.ts`

## 3) Endpoint de precios dinamicos

### 3.1 `GET /v1/public/pricing`

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

Restricción:
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

Referencia:
- `src/infrastructure/content/contentRepository.ts`
- `src/infrastructure/content/Appcontent.ts`

## 4) Endpoint de salud

### 4.1 `GET /v1/health`

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

## 5) Requisitos de infraestructura backend

- Habilitar CORS para origen/es del frontend.
- Responder `Content-Type` consistente (`application/json` recomendado).
- Garantizar TLS en produccion (`https://`).
- Evitar exponer secretos en respuestas publicas.
- Mantener cache-control acorde al recurso:
  - `health`: `no-store`
  - `pricing`: `max-age` corto o `ETag`, segun SLA.

## 6) Compatibilidad y versionado

- Este contrato corresponde al estado actual del frontend (fecha: 2026-02-21).
- Cambios breaking deben versionarse (por ejemplo `/v2/...`) o mantener alias de campos para compatibilidad.
- En este repo se mantiene `mock.php` como alias de transicion para entornos legacy.
