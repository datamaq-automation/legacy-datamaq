# FastAPI Router Implementation Checklist

Estado: checklist operativa para implementacion
Objetivo: convertir los contratos documentados en tareas concretas por router y por capa transversal

## Uso recomendado

Este documento no reemplaza a los contratos.

Orden de lectura:

1. `docs/fastapi-backend-migration-guide.md`
2. `docs/backend-content-brand-seo-contract.md`
3. `docs/fastapi-contact-contract.md`
4. `docs/fastapi-quote-contract.md`

Luego ejecutar esta checklist.

Suite base ya disponible en este repositorio:

- `tests/integration/fastApiContracts.test.ts`

Ejecucion:

- `FASTAPI_CONTRACT_BASE_URL=http://127.0.0.1:8000 npm run test:contracts:fastapi`

## Capas transversales

### Settings

- definir variables explicitas para `health`, `content`, `pricing`, `contact`, `mail`, `quoteDiagnostic` y `quotePdf`
- separar configuracion por ambiente: local, integration, production
- mantener `/v1/*` como contrato publico canonico
- no reintroducir rutas removidas como `/v1/public/*`

### CORS

- habilitar `GET`, `POST`, `OPTIONS`
- permitir `Content-Type` y headers de correlacion
- devolver CORS tambien en `4xx/5xx`
- validar browser cross-origin real desde `https://datamaq.com.ar`

### Request Id

- generar `request_id` si no viene en el request
- propagar `X-Request-Id` si el cliente ya lo envia
- exponer `request_id` en body cuando el frontend lo necesita
- exponer `X-Request-Id` o equivalente en headers

### Errores

- devolver `detail` legible en todos los errores
- devolver `code` estable cuando aplique
- mapear `422`, `429`, `503`, `500` de forma consistente
- no filtrar errores crudos de proveedores externos

### Observabilidad

- log estructurado por request con `request_id`
- log de router, status code y latencia
- log de fallas de dependencias externas
- log de transicion de `submission` o `quote`

## Router Health

- exponer `GET /v1/health`
- devolver `200 OK`
- incluir `status`
- incluir `service`
- incluir `brand_id`
- incluir `version`
- incluir `timestamp`
- incluir `request_id`
- validar que el frontend lo pueda consultar tanto directo como por proxy local

## Router Content

- exponer `GET /v1/site`
- devolver `200 OK`
- entregar snapshot completo dentro de `data`
- incluir `status`, `request_id`, `brand_id`, `version`, `content_revision`
- asegurar compatibilidad con `SiteSnapshotSchema`
- no usar `hero.title` parcial como contrato normal
- validar que `content_revision` cambie cuando cambia el snapshot
- validar metodo no permitido con `405`

Fuente de verdad:

- `docs/backend-content-brand-seo-contract.md`
- `src/domain/schemas/siteSchema.ts`

## Router Pricing

- exponer `GET /v1/pricing`
- devolver `200 OK`
- incluir `status`, `request_id`, `version`, `currency`
- emitir `data.diagnostico_lista_2h_ars` como clave canonica
- no exponer aliases alternativos para pricing
- validar payload numerico utilizable por frontend
- validar metodo no permitido con `405`

Fuente de verdad:

- `docs/fastapi-content-pricing-contract.md`
- `src/infrastructure/content/dynamicPricingService.ts`

## Router Contact

- exponer `POST /v1/contact`
- persistir una `submission` durable antes de responder
- devolver `201 Created`
- incluir `request_id`
- incluir `submission_id`
- incluir `status`
- incluir `processing_status`
- incluir `detail`
- incluir `code` cuando aplique
- aplicar validacion equivalente a la del frontend
- devolver `422` para validacion
- devolver `429` con `Retry-After` para rate limiting
- devolver `503` para dependencia temporalmente no disponible
- soportar `OPTIONS`

Fuente de verdad:

- `docs/fastapi-contact-contract.md`
- `src/application/validation/contactSchema.ts`

## Router Mail

- exponer `POST /v1/mail`
- persistir una `submission` durable antes de responder
- devolver `201 Created`
- reutilizar el mismo envelope canonico de `contact`
- mantener validacion diferenciada: `email` obligatorio y `comment` obligatorio
- devolver `422` para validacion
- devolver `429` con `Retry-After` para rate limiting
- devolver `503` para dependencia temporalmente no disponible
- soportar `OPTIONS`

Fuente de verdad:

- `docs/fastapi-contact-contract.md`
- `src/application/validation/contactSchema.ts`

## Router Quote

### Diagnostic

- exponer `POST /v1/quote/diagnostic`
- devolver `200 OK`
- aceptar el request canonico del cotizador
- devolver `quote_id` con patron `Q-YYYYMMDD-NNNNNN`
- devolver precios enteros en ARS
- devolver `valid_until` ISO
- devolver `whatsapp_message` y `whatsapp_url`
- mapear `422` con `detail[]` estilo FastAPI para validaciones
- mapear `429` con `Retry-After`

### PDF

- exponer `GET /v1/quote/{quote_id}/pdf`
- devolver `200 OK`
- devolver `application/pdf`
- devolver `Content-Disposition` con filename
- devolver `Cache-Control: no-store`
- devolver `X-Content-Type-Options: nosniff`
- devolver `404` si no existe
- devolver `422` si `quote_id` es invalido

Fuente de verdad:

- `docs/fastapi-quote-contract.md`
- `src/infrastructure/quote/quoteApiGateway.ts`

## Plan de validacion

### Unitarios backend

- testear validacion por router
- testear shape de response
- testear propagacion de `request_id`
- testear errores `422`, `429`, `503`, `500`

### Contratos

- usar `tests/integration/fastApiContracts.test.ts` como suite de contrato objetivo
- ejecutar la suite con `FASTAPI_CONTRACT_BASE_URL`
- mantener cualquier test unitario de frontend alineado a ese mismo contrato

### Integracion frontend

- validar `npm run test`
- validar `npm run typecheck`
- validar `npm run test:e2e:smoke`
- validar local con proxy `/api/v1/*`
- validar browser real contra entorno de integracion o staging
