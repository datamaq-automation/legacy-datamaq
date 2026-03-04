# FastAPI Backend Migration Guide

Estado: documento vivo
Objetivo: servir como referencia principal para migrar el backend actual a FastAPI sin romper el frontend

## Nombre recomendado del archivo

El nombre recomendado para este documento maestro es:

`docs/fastapi-backend-migration-guide.md`

Motivo:

- es estable
- describe claramente el objetivo
- no depende de una fecha
- funciona mejor como documento vivo que se va actualizando durante la migracion

Convencion recomendada:

- usar nombres sin fecha para documentos vivos
- usar sufijo con fecha solo para snapshots o informes puntuales

Ejemplos:

- documento vivo: `docs/fastapi-backend-migration-guide.md`
- snapshot puntual: `docs/frontend-to-backend-verification-2026-03-01.md`

Documento complementario ya creado:

- contrato objetivo de sitio `GET /v1/site`: `docs/backend-content-brand-seo-contract.md`
- contrato canonico de `contact`: `docs/fastapi-contact-contract.md`
- referencia parcial de `pricing`: `docs/fastapi-content-pricing-contract.md`
- contrato canonico de `quote`: `docs/fastapi-quote-contract.md`
- checklist operativa por router: `docs/fastapi-router-implementation-checklist.md`
- suite base de contratos para FastAPI: `tests/integration/fastApiContracts.test.ts`

## Decision recomendada de paths

La recomendacion de buenas practicas para esta migracion es:

- tomar `/v1/*` como contrato publico canonico
- considerar `/v1/public/*` eliminado del frontend y fuera del contrato objetivo

Contrato objetivo recomendado:

- `/v1/health`
- `/v1/site`
- `/v1/pricing`
- `/v1/contact`
- `/v1/quote/diagnostic`
- `/v1/quote/{quote_id}/pdf`

Motivo:

- `public` es redundante si el host ya representa la API publica
- el path debe describir el recurso o caso de uso, no el nivel de exposicion
- una convencion corta y estable reduce friccion en frontend, tests, proxies y documentacion

Regla recomendada:

- publico: `/v1/*`
- interno o administrativo, si alguna vez existe: `/v1/internal/*` o `/v1/admin/*`

## Decisiones ya tomadas

Quedan fijadas estas decisiones para la migracion:

1. se acepta normalizar contratos backend y adaptar el frontend en consecuencia
2. el corte a FastAPI sera directo, sin mantener rutas viejas
3. se aprovecha la migracion para redefinir la semantica del submit de `contact`

Impacto directo:

- `/v1/*` pasa a ser el contrato objetivo
- `/v1/public/*` fue eliminado del frontend y no debe reaparecer
- el frontend ya no se considera congelado respecto del contrato actual de Laravel

## Normalizacion ya decidida para frontend

Con las decisiones tomadas, el frontend debe normalizarse en estos puntos:

1. usar solo `/v1/*` como contrato backend objetivo
2. exigir endpoints explicitos en configuracion, sin `backendBaseUrl` ni fallbacks por path
3. derivar el PDF del cotizador desde `/v1/quote/diagnostic` hacia `/v1/quote/{quote_id}/pdf`
4. alinear fixtures, tests y configuracion a los paths canonicos
5. consumir `contact` con el envelope canonical `request_id`, `submission_id`, `status`, `processing_status`, `detail` y `code`

Lo que ya se puede cambiar con certeza:

- resolucion de endpoints en `ViteConfig`
- derivacion de endpoint PDF en `QuoteApiGateway`
- tests y fixtures alineados solo a `/v1/*`

Lo que todavia depende de decision backend:

- si `processing_status` representa aceptacion, completitud real o estado de job
- el mecanismo interno para llevar una `submission` de `queued` a `completed` o `failed`

## Resumen del repositorio

Este repositorio es un frontend Vue 3 + Vite multi-target.

Targets declarados en `README.md`:

- `datamaq`
- `upp`
- `example`
- `e2e`

La configuracion runtime centralizada vive en:

- `src/infrastructure/content/runtimeProfiles.json`

El frontend resuelve dependencias de backend principalmente desde:

- `src/infrastructure/config/publicConfig.ts`
- `src/infrastructure/config/viteConfig.ts`
- `src/di/container.ts`

## Superficie actual de backend consumida por el frontend

El frontend depende hoy de estas capacidades backend:

- `GET /v1/health`
- `GET /v1/site`
- `GET /v1/pricing`
- `POST /v1/contact`
- `POST /v1/quote/diagnostic`
- `GET /v1/quote/{quote_id}/pdf`

En entornos locales de integracion tambien consume equivalentes same-origin:

- `/api/v1/health`
- `/api/v1/site`
- `/api/v1/pricing`
- `/api/v1/contact`
- `/api/v1/quote/diagnostic`
- `/api/v1/quote/{quote_id}/pdf`

## Configuracion runtime que debe preservarse

Las claves backend que el frontend ya usa hoy son:

- `inquiryApiUrl`
- `pricingApiUrl`
- `siteApiUrl`
- `healthApiUrl`
- `quoteDiagnosticApiUrl`
- `quotePdfApiUrl`
- `requireRemoteContent`

Puertos de configuracion relevantes:

- `src/application/ports/Config.ts`
- `src/infrastructure/config/publicConfig.ts`
- `src/infrastructure/config/viteConfig.ts`

Conclusion operativa:

- cambiar Laravel por FastAPI no exige cambiar el wiring base del frontend si se preservan estas claves
- los contratos HTTP si pueden normalizarse, porque ya esta aceptada la adaptacion del frontend

## Contratos backend que el frontend ya espera

## 1. Health

Fuente principal:

- `src/infrastructure/health/probeBackendHealth.ts`

Endpoint esperado:

- `healthApiUrl`

Headers enviados:

- `Accept: application/json`

Campos de respuesta utilizados por frontend:

- `status`
- `service`
- `brand_id` o `brandId`
- `version`
- `timestamp`

Comportamiento esperado:

- `200` indica backend disponible
- `status: "ok"` se usa como metadata observable
- si falla, frontend registra `network-error` o `http-error`

## 2. Site

Fuentes principales:

- `src/infrastructure/content/contentRepository.ts`
- `src/infrastructure/content/dynamicContentService.ts`
- `src/domain/schemas/siteSchema.ts`

Endpoint esperado:

- `siteApiUrl`

Headers enviados:

- `Accept: application/json, text/plain;q=0.9, */*;q=0.8`

Contrato minimo:

- respuesta HTTP `200`
- payload JSON utilizable

Contrato ideal:

- objeto con metadata superior
- snapshot real dentro de `data`

Forma de `data` que el frontend valida:

- `content`
- `brand`
- `seo`

Forma de `data.content` que el frontend valida:

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
- `homePage`
- `contactPage`

## 3. Pricing

Fuentes principales:

- `src/infrastructure/content/dynamicPricingService.ts`

Endpoint esperado:

- `pricingApiUrl`

Headers enviados:

- `Accept: application/json, text/plain;q=0.9, */*;q=0.8`

Contrato minimo util:

- payload que contenga algun valor reconocible para precio comercial

Alias de clave que hoy reconoce frontend:

- `diagnostico_lista_2h_ars`
- `visitaDiagnosticoHasta2hARS`
- `visita_diagnostico_hasta2h_ars`
- `visita_diagnostico_hasta_2h_ars`
- `visita_diagnostico_2h_ars`
- `visita_diagnostico_2h`
- `visita_diagnostico_ars`

Observacion:

- FastAPI no necesita mantener todos esos aliases si el contrato se estabiliza
- mientras dure la migracion conviene mantener al menos `diagnostico_lista_2h_ars`

## 4. Contact

Fuentes principales:

- `src/application/dto/contact.ts`
- `src/application/validation/contactSchema.ts`
- `src/application/contact/mappers/contactPayloadMapper.ts`
- `src/infrastructure/contact/contactPayloadBuilder.ts`
- `src/infrastructure/contact/contactResponseFeedback.ts`
- `src/infrastructure/contact/contactApiGateway.ts`

Endpoint esperado:

- `inquiryApiUrl`

Validacion funcional en frontend para canal `contact`:

- requiere `email` o `phone`
- `comment` es opcional

Payload de dominio previo al backend:

```json
{
  "name": "string",
  "email": "string opcional",
  "phone": "string opcional",
  "company": "string opcional",
  "firstName": "string opcional",
  "lastName": "string opcional",
  "geographicLocation": "string opcional",
  "comment": "string",
  "pageLocation": "string",
  "trafficSource": "string",
  "userAgent": "string",
  "createdAt": "string ISO",
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

Payload backend efectivo que hoy se envia:

```json
{
  "name": "string",
  "email": "string opcional",
  "message": "string",
  "custom_attributes": {
    "first_name": "string opcional",
    "last_name": "string opcional",
    "company": "string opcional",
    "phone": "string opcional",
    "geographic_location": "string opcional",
    "comment": "string opcional",
    "message": "string opcional"
  },
  "meta": {
    "page_location": "string",
    "traffic_source": "string",
    "user_agent": "string",
    "created_at": "string ISO"
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

Headers y metadata que frontend intenta leer de la respuesta:

- `x-request-id`
- `request-id`
- `x-correlation-id`

Claves de body que frontend consume hoy:

- `request_id`
- `submission_id`
- `status`
- `processing_status`
- `detail`
- `code`

Claves canonical recomendadas para FastAPI:

- `request_id`
- `submission_id`
- `status`
- `processing_status`
- `detail`
- `code`

Contrato minimo de exito:

- status HTTP `2xx`
- idealmente `request_id` o header equivalente

Contrato minimo de error:

- status HTTP correcto
- `detail`
- `code`

Contrato objetivo recomendado para FastAPI:

```json
{
  "request_id": "string",
  "submission_id": "string",
  "status": "accepted | completed | rejected",
  "processing_status": "queued | processing | completed | failed",
  "detail": "string opcional",
  "code": "string opcional"
}
```

## 5. Quote

Fuentes principales:

- `src/application/dto/quote.ts`
- `src/infrastructure/quote/quoteApiGateway.ts`
- `src/ui/pages/QuotePage.vue`

Endpoints esperados:

- `quoteDiagnosticApiUrl`
- `quotePdfApiUrl`

Request para generar propuesta:

```json
{
  "company": "string",
  "contact_name": "string",
  "locality": "string",
  "scheduled": true,
  "access_ready": true,
  "safe_window_confirmed": true,
  "bureaucracy": "low | medium | high",
  "email": "string opcional",
  "phone": "string opcional",
  "notes": "string opcional"
}
```

Response esperada para generar propuesta:

```json
{
  "quote_id": "string",
  "list_price_ars": 0,
  "discounts": [
    {
      "code": "string",
      "label": "string",
      "amount_ars": 0
    }
  ],
  "discount_pct": 0,
  "discount_total_ars": 0,
  "final_price_ars": 0,
  "deposit_pct": 0,
  "deposit_ars": 0,
  "valid_until": "string ISO",
  "whatsapp_message": "string",
  "whatsapp_url": "string"
}
```

PDF:

- frontend admite `quotePdfApiUrl` explicito con template `{quote_id}`
- contrato canonical recomendado: `/v1/quote/{quote_id}/pdf`
- si no existe `quotePdfApiUrl`, deriva el endpoint a partir de `quoteDiagnosticApiUrl`
- intenta leer `Content-Disposition` para el nombre de archivo
- acepta `filename*` en UTF-8

## Puntos de integracion frontend que no deben romperse

Los puntos de consumo backend se instancian desde:

- `src/di/container.ts`

La logica principal esta distribuida asi:

- salud backend: `src/infrastructure/health/probeBackendHealth.ts`
- contenido remoto: `src/infrastructure/content/dynamicContentService.ts`
- pricing remoto: `src/infrastructure/content/dynamicPricingService.ts`
- submit contacto: `src/application/use-cases/submitContact.ts`
- gateway contacto: `src/infrastructure/contact/contactApiGateway.ts`
- gateway cotizador: `src/infrastructure/quote/quoteApiGateway.ts`

Vistas que dependen directamente del backend:

- `src/ui/pages/HomePage.vue`
- `src/ui/pages/MedicionConsumoEscobar.vue`
- `src/ui/pages/QuotePage.vue`
- `src/ui/views/ThanksView.vue`

## Decision importante ya cerrada en frontend

Habia una inconsistencia real entre runtime profiles y fallbacks construidos desde `backendBaseUrl`.

Estado actual:

- el frontend ya fue normalizado para converger a `/v1/*`
- `/v1/public/*` fue removido del runtime del frontend
- tests y configuracion deben seguir consolidando esa misma convencion

Contrato objetivo:

- `/v1/site`
- `/v1/pricing`
- `/v1/quote/diagnostic`
- `/v1/quote/{quote_id}/pdf`

## Requisitos no negociables para FastAPI

## 1. CORS de navegador

Para entornos browser cross-origin, FastAPI debe responder correctamente con CORS en:

- `GET`
- `POST`
- `OPTIONS`

En especial para:

- `/v1/contact`

## 2. Correlacion por request id

FastAPI deberia emitir y exponer un `request id` consistente.

Opciones compatibles con el frontend actual:

- header `X-Request-Id`
- header `Request-Id`
- header `X-Correlation-Id`
- body `request_id` o equivalente legible

## 3. Contratos JSON estables

El frontend ya tolera cierta variacion de nombres en `contact`, pero no conviene ampliar esa variacion.

Recomendacion:

- definir una sola forma canonical por endpoint
- no mantener compatibilidad temporal innecesaria si el corte sera directo
- adaptar frontend y tests al contrato canonical nuevo

Decision operativa en frontend:

- `contact` debe converger al envelope canonical `request_id` + `submission_id` + `status` + `processing_status` + `detail` + `code`
- el frontend ya fue normalizado para consumir solo ese envelope

## 4. Respuestas de error legibles

Para que el frontend pueda mostrar errores utiles, FastAPI deberia devolver al menos:

- status HTTP correcto
- `detail`
- `code` cuando aplique
- `request_id` si existe

## 5. Semantica del submit de `contact`

Decision recomendada para esta migracion:

- `POST /v1/contact` debe crear una `submission` durable
- si esa persistencia se completa antes de responder, el status canonical debe ser `201 Created`
- el procesamiento posterior de mail, CRM o automatizaciones puede continuar fuera de banda
- no usar `202` como respuesta canonical si ya existe una persistencia durable al momento de responder

Response canonical recomendada:

- `request_id`
- `submission_id`
- `status`
- `processing_status`

Interpretacion sugerida:

- `status: accepted` significa que la submission fue creada y aceptada por el sistema
- `processing_status: queued` significa que el trabajo posterior todavia no termino
- `processing_status: completed` o `failed` queda reservado para seguimiento interno o futuros endpoints de estado

## Recomendacion de estructura FastAPI

Una estructura razonable para reemplazar Laravel sin romper el frontend seria:

- router `health`
- router `site`
- router `pricing`
- router `contact`
- router `quote`
- middleware de CORS
- middleware de request id
- capa de settings para mapear variables de entorno
- capa de servicios para integraciones externas

## Checklist de migracion backend

Antes de cambiar el endpoint productivo a FastAPI, validar:

1. que todos los endpoints configurados en `runtimeProfiles.json` sigan respondiendo
2. que la convencion final de paths quede definida y reflejada en `ViteConfig`
3. que `contact` preserve CORS, `OPTIONS`, request id y shape de error
4. que `mail` preserve validacion diferenciada respecto de `contact`
5. que `site` siga entregando un `data` compatible con `SiteSnapshotSchema`
6. que `pricing` siga entregando al menos una clave reconocible para precio
7. que `quote` preserve response JSON y descarga PDF con filename
8. que `integration` y `e2e` queden alineados con el backend local de FastAPI
9. que `contact` y `mail` usen el nuevo status code de forma consistente con su modelo real
10. que `contact` y `mail` respondan `201 Created` cuando la `submission` ya fue persistida

## Cobertura de este documento

Este documento contiene la mayor parte de la informacion funcional y contractual que el frontend necesita del backend.

Pero no reemplaza por completo a las fuentes de verdad del repositorio.

Para una migracion segura, tambien hay que mirar:

- configuracion runtime: `src/infrastructure/content/runtimeProfiles.json`
- configuracion expuesta al frontend: `src/infrastructure/config/publicConfig.ts`
- resolucion final de endpoints: `src/infrastructure/config/viteConfig.ts`
- DTOs de `contact`: `src/application/dto/contact.ts`
- validacion frontend de `contact` y `mail`: `src/application/validation/contactSchema.ts`
- gateway de `contact` y parsing de respuestas: `src/infrastructure/contact/*.ts`
- DTOs de `quote`: `src/application/dto/quote.ts`
- gateway de `quote`: `src/infrastructure/quote/quoteApiGateway.ts`
- shape del snapshot remoto: `src/domain/schemas/siteSchema.ts`
- tests que fijan contrato observable: `tests/unit/infrastructure/*.test.ts`

Nota importante sobre tests actuales:

- `tests/integration/fastApiContracts.test.ts` es la suite base de contrato para FastAPI
- se ejecuta con `FASTAPI_CONTRACT_BASE_URL`
- cualquier suite anterior de PHP debe considerarse retirada y fuera del contrato objetivo

Conclusion:

- este archivo ya sirve como documento maestro para la migracion
- pero el source of truth final sigue siendo codigo + tests
- si la migracion avanza, conviene seguir enriqueciendo este documento en lugar de duplicar informacion dispersa

## Preguntas abiertas

## 1. Estrategia documental futura

La division ya adoptada es:

- `docs/fastapi-backend-migration-guide.md`
- `docs/fastapi-contact-contract.md`
- `docs/fastapi-content-pricing-contract.md`
- `docs/fastapi-quote-contract.md`
- `docs/fastapi-router-implementation-checklist.md`

Por ahora no hace falta abrir mas documentos especializados.
