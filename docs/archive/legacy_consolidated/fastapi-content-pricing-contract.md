# FastAPI Content And Pricing Contract

Estado: contrato recomendado para migracion a FastAPI
Objetivo: fijar el contrato canonico de `content` y `pricing` que el frontend consume

## Endpoints

- `GET /v1/content`
- `GET /v1/pricing`

## Content

### Response de exito

Status code canonico:

- `200 OK`

Body canonico recomendado:

```json
{
  "status": "ok",
  "request_id": "req_01HQY8Y5P5Y3L7Y2QW4A1H3M9N",
  "brand_id": "datamaq",
  "version": "v2",
  "content_revision": "sha256-hex",
  "data": {
    "hero": {},
    "services": {},
    "about": {},
    "profile": {},
    "navbar": {},
    "footer": {},
    "legal": {},
    "contact": {},
    "consent": {},
    "decisionFlow": {},
    "thanks": {}
  }
}
```

Metadata que el frontend ya observa:

- `status`
- `request_id`
- `brand_id`
- `version`
- `content_revision`

Regla recomendada:

- FastAPI debe devolver siempre el snapshot completo dentro de `data`
- no conviene usar el modo parcial `hero.title` como contrato normal

Compatibilidad actual del frontend:

- si `data` contiene un snapshot utilizable, aplica el contenido completo
- si no hay snapshot completo pero existe `hero.title`, puede aplicar solo ese titulo como fallback

### Snapshot minimo requerido por frontend

El frontend valida el shape contra `AppContentSchema`.

Secciones requeridas:

- `hero`
- `services`
- `about`
- `profile`
- `navbar`
- `footer`
- `legal`
- `contact`
- `consent`
- `decisionFlow`
- `thanks`

Referencia de schema:

- `src/domain/schemas/contentSchema.ts`

### Headers y transporte

Request enviado por frontend:

- `Accept: application/json, text/plain;q=0.9, */*;q=0.8`

### Errores

Recomendacion:

- `405` para metodo no permitido
- `500` o `503` segun corresponda
- body con `request_id`, `status`, `code` y `detail`

El frontend puede degradar a fallback local si el contenido remoto no es utilizable.

## Pricing

### Response de exito

Status code canonico:

- `200 OK`

Body canonico recomendado:

```json
{
  "status": "ok",
  "request_id": "req_01HQY8Y5P5Y3L7Y2QW4A1H3M9N",
  "version": "v1",
  "currency": "ARS",
  "data": {
    "diagnostico_lista_2h_ars": 275000
  }
}
```

Metadata que el frontend ya observa:

- `status`
- `request_id`
- `version`
- `currency`

Clave canonica recomendada:

- `data.diagnostico_lista_2h_ars`

Aliases que el frontend todavia tolera:

- `diagnostico_lista_2h_ars`
- `visitaDiagnosticoHasta2hARS`
- `visita_diagnostico_hasta2h_ars`
- `visita_diagnostico_hasta_2h_ars`
- `visita_diagnostico_2h_ars`
- `visita_diagnostico_2h`
- `visita_diagnostico_ars`

Regla recomendada:

- FastAPI debe emitir una sola clave canonica
- el frontend ya consume solo esa clave canonica

### Headers y transporte

Request enviado por frontend:

- `Accept: application/json, text/plain;q=0.9, */*;q=0.8`

### Errores

Recomendacion:

- `405` para metodo no permitido
- `500` o `503` segun corresponda
- body con `request_id`, `status`, `code` y `detail`

Si el payload no contiene una clave reconocible, el frontend mantiene el fallback comercial.

## Observabilidad

El frontend ya emite trazas estructuradas para ambos endpoints:

- `[backend:content]`
- `[backend:pricing]`

Campos visibles en logs:

- `endpoint`
- `pathname`
- `transportMode`
- `status`
- `requestId`
- `version`
- `brandId` o `currency`

## Fuente de verdad en el repositorio

- schema de contenido: `src/domain/schemas/contentSchema.ts`
- cliente de contenido: `src/infrastructure/content/dynamicContentService.ts`
- cliente de pricing: `src/infrastructure/content/dynamicPricingService.ts`
- tests de contrato FastAPI: se ejecutan en backend
