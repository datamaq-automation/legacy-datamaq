# FastAPI Contact Contract

Estado: contrato recomendado para migracion a FastAPI
Objetivo: fijar el contrato canonico de `contact` y `mail` que el frontend debe consumir

## Decision

La recomendacion para esta migracion es:

- persistir una `submission` durable antes de responder
- responder `201 Created` para `POST /v1/contact`
- responder `201 Created` para `POST /v1/mail`
- continuar el procesamiento de mail, CRM o automatizaciones fuera de banda si hace falta

Esta decision evita un `202` ambiguo cuando el sistema ya puede afirmar que la solicitud fue registrada.

## Endpoints

- `POST /v1/contact`
- `POST /v1/mail`

## Response de exito

Status code canonico:

- `201 Created`

Body canonico:

```json
{
  "request_id": "req_01HQY8Y5P5Y3L7Y2QW4A1H3M9N",
  "submission_id": "sub_01HQY8Y5P5Y3L7Y2QW4A1H3M9N",
  "status": "accepted",
  "processing_status": "queued",
  "detail": "Submission created",
  "code": "CONTACT_CREATED"
}
```

Semantica:

- `request_id`: correlacion tecnica del request HTTP
- `submission_id`: identificador durable de negocio para la solicitud creada
- `status`: estado de aceptacion de la submission
- `processing_status`: estado del trabajo posterior
- `detail`: mensaje legible para logs y debugging
- `code`: codigo estable para clientes y observabilidad

Valores recomendados:

- `status`: `accepted | completed | rejected`
- `processing_status`: `queued | processing | completed | failed`

## Response de error

Status codes recomendados:

- `422 Unprocessable Entity` para validacion
- `429 Too Many Requests` para rate limiting
- `503 Service Unavailable` para dependencia temporalmente caida
- `500 Internal Server Error` solo para fallo inesperado

Body minimo recomendado:

```json
{
  "request_id": "req_01HQY8Y5P5Y3L7Y2QW4A1H3M9N",
  "status": "rejected",
  "processing_status": "failed",
  "detail": "Email is invalid",
  "code": "VALIDATION_ERROR"
}
```

## CORS y trazabilidad

FastAPI debe devolver:

- `Access-Control-Allow-Origin`
- `Access-Control-Allow-Methods`
- `Access-Control-Allow-Headers`

Eso debe estar presente tambien en respuestas `4xx/5xx`.

Tambien debe exponer correlacion por:

- header `X-Request-Id`, `Request-Id` o `X-Correlation-Id`
- body `request_id`

## Compatibilidad frontend

El frontend ya esta preparado para:

- aceptar cualquier `2xx`
- parsear `request_id`
- parsear `submission_id`
- parsear `status`
- parsear `processing_status`
- mostrar trazabilidad en logs sin exponer datos sensibles

El frontend ya consume solo el envelope canonico de FastAPI y no debe reintroducir aliases alternativos.
