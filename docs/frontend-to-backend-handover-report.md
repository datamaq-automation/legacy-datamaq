# Informe Frontend -> Backend

Fecha: 2026-03-01
Estado: vigente
Destinatario: equipo backend

## Resumen ejecutivo

El frontend ya fue migrado para consumir un contrato unico de sitio:

- `GET /v1/site`

No existe compatibilidad temporal con el contrato remoto anterior de contenido.

Decision ya implementada:

- sin duplicacion de contratos
- sin adaptadores de transicion
- sin soporte para `GET /v1/content` como fuente remota principal del sitio

El frontend sigue consumiendo ademas:

- `GET /v1/health`
- `GET /v1/pricing`
- `POST /v1/contact`
- `POST /v1/mail`
- `POST /v1/quote/diagnostic`
- `GET /v1/quote/{quote_id}/pdf`

## Situacion actual del frontend

### 1. Contrato de sitio ya asumido por frontend

El frontend espera un snapshot remoto con esta forma:

```json
{
  "status": "ok",
  "request_id": "req_123",
  "brand_id": "datamaq",
  "version": "v1",
  "content_revision": "rev_x",
  "data": {
    "content": {},
    "brand": {},
    "seo": {}
  }
}
```

El frontend valida `data` contra un schema fuerte de sitio y aplica el snapshot completo.

Implicacion:

- si `data` no cumple el schema esperado, el frontend descarta el snapshot y cae a fallback local
- ya no existe el modo de degradacion remota basado solo en `hero.title`

### 2. `content`

`content` gobierna ya no solo hero/services/about/contact/faq/thanks, sino tambien copy de paginas activas:

- `HomePage.vue`
- `ContactPage.vue`
- `ThanksView.vue`

Esto incluye:

- labels de CTA
- eyebrow titles
- titulos de FAQ
- copy de formularios
- labels de navegacion rapida
- topbar de gracias

### 3. `brand`

`brand` paso a ser la fuente activa para:

- identidad de marca
- email de contacto
- habilitacion de canales
- WhatsApp
- QR de WhatsApp
- `TecnicoACargo`
- nombres comerciales de equipos

Implicacion:

- backend ya no deberia considerar `TecnicoACargo` como detalle local de frontend
- nombre, rol, foto y labels de ese bloque forman parte del contrato

### 4. `seo`

`seo` paso a ser la fuente activa para:

- `siteUrl`
- `siteName`
- `siteDescription`
- `siteOgImage`
- `siteLocale`
- `gscVerification`
- datos de negocio para JSON-LD

Implicacion:

- el frontend ya no toma SEO productivo desde configuracion local como fuente de verdad primaria

### 5. Fallbacks locales

Siguen locales en frontend y no forman parte del contrato backend principal:

- mensajes tecnicos de carga
- mensajes tecnicos de indisponibilidad
- banner de desarrollo sin backend

Esto es deliberado.

## Requerimientos concretos para backend

### 1. Implementar `GET /v1/site`

Backend debe emitir:

- `200 OK`
- envelope con metadata superior
- snapshot dentro de `data`

Campos de metadata que el frontend ya observa o registra:

- `status`
- `request_id`
- `brand_id`
- `version`
- `content_revision`

### 2. Mantener `pricing` separado

El precio dinamico sigue cargando por:

- `GET /v1/pricing`

Motivo:

- el frontend hoy sigue tratando pricing como flujo independiente del snapshot del sitio

### 3. Mantener `health` separado

El estado de disponibilidad backend sigue dependiendo de:

- `GET /v1/health`

### 4. Mantener `contact` y `mail` con envelope estable

El frontend espera para ambos:

- `request_id`
- `submission_id`
- `status`
- `processing_status`
- `detail`
- `code`

### 5. Mantener `quote` sin cambios funcionales

El frontend sigue esperando:

- `POST /v1/quote/diagnostic`
- `GET /v1/quote/{quote_id}/pdf`

## Riesgos operativos a evitar

- no devolver `data.content` sin `data.brand` o sin `data.seo`
- no emitir un contrato parcial esperando que frontend lo complete localmente
- no reintroducir `GET /v1/content` como contrato paralelo
- no mover mensajes tecnicos de resiliencia al backend como dependencia obligatoria
- no romper `pricing`, `contact`, `mail` o `quote` mientras se implementa `site`

## Documentacion de referencia en `docs/`

Documento principal para backend de sitio:

- [backend-content-brand-seo-contract.md](/C:/AppServ/www/plantilla-www/docs/backend-content-brand-seo-contract.md)

Documento maestro de migracion backend:

- [fastapi-backend-migration-guide.md](/C:/AppServ/www/plantilla-www/docs/fastapi-backend-migration-guide.md)

Contratos HTTP complementarios:

- [fastapi-contact-contract.md](/C:/AppServ/www/plantilla-www/docs/fastapi-contact-contract.md)
- [fastapi-content-pricing-contract.md](/C:/AppServ/www/plantilla-www/docs/fastapi-content-pricing-contract.md) solo para `pricing`
- [fastapi-quote-contract.md](/C:/AppServ/www/plantilla-www/docs/fastapi-quote-contract.md)

Checklist backend:

- [fastapi-router-implementation-checklist.md](/C:/AppServ/www/plantilla-www/docs/fastapi-router-implementation-checklist.md)

Contexto de origen del trabajo:

- [frontend-hardcoded-content-audit.md](/C:/AppServ/www/plantilla-www/docs/frontend-hardcoded-content-audit.md)

Estado operativo de tareas:

- [todo.md](/C:/AppServ/www/plantilla-www/docs/todo.md)

## Pedido concreto del equipo frontend al equipo backend

1. Implementar `GET /v1/site` como contrato canonico unico.
2. Emitir `content`, `brand` y `seo` completos en el mismo snapshot.
3. No planificar compatibilidad con `GET /v1/content` para el sitio.
4. Avisar cuando exista un endpoint funcional para correr validacion end-to-end desde frontend.
