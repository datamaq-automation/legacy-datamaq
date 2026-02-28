# Informe Frontend -> Backend sobre verificacion publica de `https://api.datamaq.com.ar`

Fecha: 2026-02-28
Emisor: equipo frontend
Destinatario: equipo backend
Estado: verificacion publica parcial realizada por frontend; validacion funcional profunda pendiente de backend

## Resumen ejecutivo

Frontend pudo verificar correctamente el contrato publico observable de `https://api.datamaq.com.ar`.

Resultado:

- `GET /v1/health` responde `200 OK`
- `GET /v1/content` responde `200 OK`
- `GET /v1/pricing` responde `200 OK`
- `OPTIONS /v1/contact` responde `204 No Content` con CORS valido para `https://datamaq.com.ar`
- `OPTIONS /v1/mail` responde `204 No Content` con CORS valido para `https://datamaq.com.ar`
- `POST /v1/contact` con payload vacio responde `422` con shape de error compatible
- `POST /v1/mail` con payload vacio responde `422` con shape de error compatible

Conclusion:

- frontend si puede probar la respuesta publica del backend
- backend sigue siendo responsable de validar comportamiento interno, side effects y aceptacion real del contrato nuevo de `contact`

## Evidencia observada por frontend

## 1. Health

Request:

`GET https://api.datamaq.com.ar/v1/health`

Resultado:

- HTTP `200 OK`
- `Content-Type: application/json; charset=utf-8`
- `X-Request-Id` presente

Body observado:

```json
{
  "status": "ok",
  "request_id": "req-20260228175425-57287722",
  "service": "datamaq-api",
  "brand_id": "datamaq",
  "version": "v1",
  "timestamp": "2026-02-28T17:54:25+00:00"
}
```

## 2. Content

Request:

`GET https://api.datamaq.com.ar/v1/content`

Resultado:

- HTTP `200 OK`
- `X-Request-Id` presente
- payload estructurado y utilizable por frontend

Observacion:

- el payload incluye `hero`, `services`, `about`, `contact`, `decisionFlow`, `thanks`
- desde el contrato publico, `content` se ve disponible

## 3. Pricing

Request:

`GET https://api.datamaq.com.ar/v1/pricing`

Resultado:

- HTTP `200 OK`

Body observado:

```json
{
  "status": "ok",
  "request_id": "req-20260228175435-88d4ec82",
  "version": "v1",
  "currency": "ARS",
  "data": {
    "diagnostico_lista_2h_ars": 275000
  }
}
```

## 4. CORS / Preflight

Requests:

- `OPTIONS https://api.datamaq.com.ar/v1/contact`
- `OPTIONS https://api.datamaq.com.ar/v1/mail`

Con headers:

- `Origin: https://datamaq.com.ar`
- `Access-Control-Request-Method: POST`
- `Access-Control-Request-Headers: content-type`

Resultado observado en ambos:

- HTTP `204 No Content`
- `Access-Control-Allow-Origin: https://datamaq.com.ar`
- `Access-Control-Allow-Methods: GET, POST, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type, X-Request-Id, Request-Id, X-Correlation-Id`
- `Access-Control-Expose-Headers: X-Request-Id`

Conclusion:

- el preflight observable desde frontend esta correctamente habilitado para produccion

## 5. Shape de error publico

Requests:

- `POST https://api.datamaq.com.ar/v1/contact` con `{}` como body
- `POST https://api.datamaq.com.ar/v1/mail` con `{}` como body

Resultado observado en ambos:

- HTTP `422`
- `X-Request-Id` presente
- body compatible con el contrato esperado por frontend

Body observado:

```json
{
  "status": "error",
  "request_id": "req-20260228175444-90a044ec",
  "code": "VALIDATION_ERROR",
  "message": "email and message are required.",
  "details": [],
  "error_code": "VALIDATION_ERROR",
  "detail": "email and message are required."
}
```

Conclusion:

- frontend puede confirmar que el shape de error sigue siendo compatible
- esto no alcanza para confirmar que el contrato nuevo de `contact` ya este activo en produccion

## Lo que frontend SI puede verificar

Frontend puede verificar:

- disponibilidad publica de endpoints
- status HTTP
- headers publicos
- CORS observable
- shape de respuestas exitosas y de error
- consistencia del contrato publico consumido por la SPA

## Lo que backend DEBE verificar

Backend debe verificar:

- si `POST /v1/contact` en produccion ya acepta `email` o `phone` como regla efectiva
- si `message` / `comment` ya es opcional en produccion
- si el mapping nuevo a Laravel y Chatwoot esta desplegado en produccion
- si un submit valido genera side effects correctos y no duplicados
- logs internos, trazabilidad, retries y warnings de integracion
- configuracion efectiva de entorno (`CHATWOOT_*`, validaciones, rate limits, colas si aplica)

## Riesgo actual

Hoy frontend no deberia validar en produccion, contra datos reales, el nuevo contrato completo de `contact` porque eso implicaria potencialmente:

- crear contactos reales
- disparar integracion con Chatwoot
- contaminar datos operativos

Por ese motivo, la confirmacion final del nuevo contrato de `contact` en produccion debe hacerla backend en un entorno controlado o con una estrategia de prueba segura.

## Pedido concreto a backend

Solicitamos confirmar explicitamente en `api.datamaq.com.ar`:

1. si `POST /v1/contact` ya acepta `phone` sin `email`
2. si `message` vacio ya no produce `422`
3. si el contrato nuevo del formulario ya esta desplegado en produccion
4. si la integracion aguas abajo mantiene tolerancia a fallos sin romper el `202`

## Cierre

Desde frontend, la API publica de produccion responde correctamente en lo observable.

La validacion final del comportamiento funcional del nuevo formulario de contacto en produccion corresponde a backend, porque involucra side effects e integraciones internas que frontend no debe forzar con datos reales.
