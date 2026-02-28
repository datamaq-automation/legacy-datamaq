# Contrato Tecnico Frontend -> Laravel -> Chatwoot

Fecha: 2026-02-28

## Objetivo

Documentar el estado actual confirmado por backend y separar claramente que pertenece a la fase actual y que quedaria para una fase futura.

## Estado Actual Confirmado

### 1. El frontend no integra Chatwoot directo

El contrato frontend vigente se mantiene:

- `OPTIONS /v1/contact`
- `POST /v1/contact`

El frontend no debe conocer ni enviar:

- `api_access_token`
- `account_id`
- `inbox_id`
- `inbox_identifier`
- `source_id`
- `pubsub_token`

### 2. Backend ya usa Chatwoot Account API

Backend confirmo que hoy la integracion real usa:

- `POST /api/v1/accounts/{account_id}/contacts`
- autenticacion via `api_access_token`

Configuracion de entorno definida en backend:

- `CHATWOOT_BASE_URL`
- `CHATWOOT_ACCOUNT_ID`
- `CHATWOOT_API_ACCESS_TOKEN`
- `CHATWOOT_CONTACT_INBOX_ID`

No se usa hoy la Client/Public API basada en `inbox_identifier`.

### 3. Alcance actual implementado

La fase actual hace solo:

- captura de contacto en Chatwoot

No hace hoy:

- creacion de conversacion
- creacion de mensaje
- deduplicacion fuerte propia
- `identifier` canonico propio
- persistencia acordada de `conversation_id`

### 4. Tolerancia actual a fallo interno de Chatwoot

Si la validacion del formulario pasa pero Chatwoot falla o esta mal configurado:

- backend mantiene la respuesta HTTP legacy exitosa
- backend registra warning interno con `request_id`

Eso significa que hoy el frontend puede recibir:

```json
{
  "status": "ok",
  "request_id": "req-..."
}
```

incluso si Chatwoot fallo aguas abajo.

## Contrato Frontend que se Mantiene

### Request

Frontend sigue enviando el mismo payload:

```json
{
  "name": "juan",
  "email": "juan@example.com",
  "message": "Necesito una propuesta para mantenimiento electrico.",
  "custom_attributes": {
    "message": "Necesito una propuesta para mantenimiento electrico."
  },
  "meta": {
    "page_location": "https://datamaq.com.ar/contacto",
    "traffic_source": "organic",
    "user_agent": "Mozilla/5.0 ...",
    "created_at": "2026-02-28T00:00:00.000Z"
  },
  "attribution": {
    "utmSource": "google",
    "utmMedium": "cpc"
  }
}
```

### Response success

Backend mantiene:

- `202`
- `status: "ok"`
- `request_id`

Ejemplo:

```json
{
  "status": "ok",
  "request_id": "req_123"
}
```

### Response error

Backend mantiene contrato compatible con:

```json
{
  "status": "error",
  "request_id": "req_123",
  "error_code": "VALIDATION_ERROR",
  "detail": "Email invalido"
}
```

Frontend sigue leyendo:

- `request_id`
- `error_code | code`
- `detail | message`

## Mapping Actual Confirmado en Backend

### Laravel -> Chatwoot Contact

Backend confirmo que hoy envia:

- `inbox_id`
- `name`
- `email`
- `additional_attributes`

Mapeo actual implementado:

- `datamaq_request_id`
- `datamaq_form=contact`
- `message`
- `meta.*` -> `additional_attributes.meta_{clave}`
- `custom_attributes.*` -> `additional_attributes.custom_{clave}`
- `attribution.*` -> `additional_attributes.attribution_{clave}`

### Razon del mapping actual

Backend eligio esto para:

- preservar el payload actual del frontend
- evitar depender todavia de un catalogo administrado de `custom_attributes` en Chatwoot
- dejar trazabilidad operativa sin abrir aun la capa de conversaciones

## Recomendacion Frontend sobre la Fase Actual

La arquitectura correcta hoy es:

- frontend sin cambios
- Laravel como fachada estable
- Chatwoot via Account API
- metadata libre en `additional_attributes`
- solo captura de contacto
- tolerancia a fallo interno de Chatwoot sin romper la UX del formulario

## Fase Futura Opcional

Solo si negocio lo pide, backend propuso una segunda fase para:

- definir deduplicacion
- definir `identifier` canonico
- decidir si cada submit crea conversacion nueva
- crear `conversation`
- crear `message`
- definir schema de atributos de contacto y conversacion

Si esa fase se abre, frontend recomienda seguir con:

- frontend sin cambios de contrato
- `POST /v1/contact` como unica fachada publica
- Chatwoot completamente encapsulado en Laravel

## Dudas que Siguen Abiertas

1. ¿Cual sera la politica futura de deduplicacion en Chatwoot?
2. ¿El `identifier` futuro sera email normalizado, UUID propio u otra clave?
3. ¿Si llega el mismo email dos veces se reutiliza contacto, se actualiza o se crea uno nuevo?
4. ¿Que atributos, si alguno, deberian pasar de `additional_attributes` a `custom_attributes` formales?
5. ¿Laravel persistira relaciones internas como `contact_id`, `source_id` o `conversation_id`?
6. ¿Si negocio pide conversaciones, cada submit debe crear una nueva o reusar una existente?

## Preguntas Pendientes para Backend

1. ¿El objetivo actual se considera cerrado con captura de contacto o ya hay roadmap concreto para `conversation + message`?
2. ¿Cual sera el `identifier` canonico si se implementa deduplicacion?
3. ¿Van a persistir `conversation_id` y relaciones internas en Laravel para trazabilidad futura?
4. ¿Que campos quieren promover de `additional_attributes` a `custom_attributes` formales de Chatwoot, si alguno?

## Referencias Oficiales

- Chatwoot Account API - Create Contact:
  - https://developers.chatwoot.com/api-reference/contacts/create-contact
- Chatwoot Account API - Create New Conversation:
  - https://developers.chatwoot.com/api-reference/conversations/create-new-conversation
- Chatwoot Account API - Create New Message:
  - https://developers.chatwoot.com/api-reference/messages/create-new-message
- Chatwoot User Guide - API Channel Inbox:
  - https://www.chatwoot.com/hc/user-guide/articles/1677839703-how-to-create-an-api-channel-inbox
- Chatwoot Client/Public API - Create Contact:
  - https://developers.chatwoot.com/api-reference/contacts-api/create-a-contact
