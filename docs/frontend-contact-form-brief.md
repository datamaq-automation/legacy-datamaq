# Frontend Contact Form Brief

Fecha: 2026-02-28

## Objetivo

Explicar al equipo frontend como funciona hoy el formulario de ingreso de contacto y que debe seguir estable con la integracion actual de Laravel hacia Chatwoot.

## Resumen ejecutivo

El frontend no debe integrar Chatwoot directo.

Debe seguir enviando el formulario exactamente a:

- `POST https://api.datamaq.com.ar/v1/contact`

La integracion con Chatwoot ocurre solo dentro del backend para no romper:

- URL publica
- metodo
- payload
- manejo de errores
- CORS y `OPTIONS`

Estado actual confirmado por backend:

- Laravel ya integra internamente con Chatwoot Account API
- la fase actual solo captura contacto en Chatwoot
- no crea conversacion ni mensaje
- si Chatwoot falla aguas abajo, el formulario mantiene la respuesta HTTP legacy exitosa

## Flujo actual del formulario

### Endpoint consumido

- `OPTIONS https://api.datamaq.com.ar/v1/contact`
- `POST https://api.datamaq.com.ar/v1/contact`

### Comportamiento actual

1. Antes del primer submit, el frontend hace una sonda `OPTIONS`
2. Si el backend se considera disponible, envia `POST`
3. El `POST` se manda como JSON con `Content-Type: application/json`
4. En success, el frontend tolera cualquier `2xx` o `202`
5. En error, el frontend intenta leer `request_id`, `error_code|code` y `detail|message`
6. Hoy backend puede devolver `202 { "status": "ok", "request_id": "req-..." }` aunque la sincronizacion interna con Chatwoot falle

## Payload actual del formulario

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
    "utmMedium": "cpc",
    "utmCampaign": "spring",
    "utmTerm": "medicion",
    "utmContent": "hero",
    "gclid": "abc123"
  }
}
```

## Campos visibles para usuario

Segun el snapshot actual del contenido:

- `email`
- `message`

Labels actuales:

- `Email`
- `Mensaje`

Texto de submit actual:

- `Enviar`

## Campos inferidos por frontend

Con base en la validacion funcional ya documentada:

- `name` no lo escribe el usuario en este formulario
- el frontend lo infiere desde el local-part del email
- si no puede inferirlo, usa un fallback tipo `Contacto Web`
- `attribution` solo viaja si habia datos de UTM o GCLID guardados

## Contrato de respuesta que frontend espera

### Success

El frontend funciona con:

- cualquier `2xx` o `202`
- body JSON o body vacio

Si existe informacion adicional, intenta leer:

- `request_id` desde body
- o `x-request-id` desde headers

Ejemplo compatible:

```json
{
  "status": "ok",
  "request_id": "req_123"
}
```

### Error

El frontend intenta leer:

- request id: `x-request-id`, `request-id`, `x-correlation-id`, `request_id`, `request.id`, `meta.request_id`
- error code: `error_code`, `code`, `error.code`
- mensaje: `detail`, `message`, `error`, `errorMessage`, `description`, `error.message`

Ejemplo compatible:

```json
{
  "status": "error",
  "request_id": "req_123",
  "error_code": "VALIDATION_ERROR",
  "detail": "Email invalido"
}
```

## Que no debe cambiar con la integracion actual

- La URL publica debe seguir siendo `https://api.datamaq.com.ar/v1/contact`
- El metodo debe seguir siendo `OPTIONS` + `POST`
- El payload debe seguir teniendo `name`, `email`, `message`, `custom_attributes`, `meta`, `attribution`
- El frontend no debe enviar tokens ni identificadores de Chatwoot
- El shape de success y error debe seguir siendo compatible con el contrato actual
- El frontend no debe asumir que exista hoy una conversacion o mensaje creado en Chatwoot por cada submit

## Recomendacion para frontend

No cambiar el formulario por Chatwoot.

El frontend no deberia:

- llamar `app.chatwoot.com`
- conocer `account_id`, `inbox_id`, `inbox_identifier` ni `api_access_token`
- acoplarse al estado interno de Chatwoot

La version correcta hoy es:

- `frontend -> POST /v1/contact -> Laravel -> Chatwoot Account API`
- con captura de contacto solamente
- con tolerancia a fallo interno de Chatwoot sin romper la UX actual del formulario

## Fuentes internas usadas para este brief

- `docs/migracion-laravel-validacion-endpoints-frontend.md`
- `docs/laravel-parallel-route-matrix.md`
- respuesta backend del 2026-02-28 sobre `POST /v1/contact` y Chatwoot
