# Contrato API: Contacto + Mail (`VITE_BACKEND_BASE_URL`)

## 1) Base URL y endpoints

- Variable fuente: `VITE_BACKEND_BASE_URL`
- Validacion en frontend:
  - En desarrollo (`DEV`): acepta `http://` o `https://`
  - En produccion: exige `https://`
- Convencion productiva: versionado `/v1` y recursos semanticos.
- Endpoints documentados en este archivo:
  - `POST ${VITE_BACKEND_BASE_URL}/v1/contact`
  - `POST ${VITE_BACKEND_BASE_URL}/v1/mail`

Referencia de implementacion:
- `src/infrastructure/config/viteConfig.ts`
- `src/infrastructure/contact/contactApiGateway.ts`
- `src/infrastructure/contact/contactPayloadBuilder.ts`
- `src/infrastructure/contact/contactResponseFeedback.ts`
- `src/infrastructure/contact/contactSubmissionErrors.ts`
- `src/application/contact/contactEndpointPolicy.ts`

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

Referencia de DTO:
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
  "detail": "email invalido"
}
```

Mapeo de errores frontend:
- `status === 0` -> `NetworkError`
- `status !== 0` y no `2xx` -> `BackendError`
- URL ausente/no permitida -> `Unavailable`

## 3) Requisitos backend para estos endpoints

- Habilitar CORS para origen/es del frontend.
- Responder `Content-Type` consistente (`application/json` recomendado).
- Garantizar TLS en produccion (`https://`).
- Evitar exponer secretos en respuestas publicas.
- Entregar codigos HTTP consistentes con validaciones de negocio.

## 4) Compatibilidad y versionado

- Este contrato corresponde al estado actual del frontend (fecha: 2026-02-21).
- Cambios breaking deben versionarse (por ejemplo `/v2/...`) o sostener compatibilidad temporal.
