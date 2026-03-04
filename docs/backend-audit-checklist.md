# Checklist de Auditoria Backend

Fecha: 2026-03-01
Destinatario: frontend + backend
Objetivo: verificar que los cambios backend sean correctos contra el estado actual del frontend

## Criterio general

No alcanza con revisar la UI ni con abrir `F12`.

La auditoria correcta combina:

1. tests de contrato
2. inspeccion de `Network` en navegador
3. inspeccion de `Console` con logs estructurados
4. smoke manual de flujos criticos

## 1. Tests de contrato

Fuente principal:

- [fastApiContracts.test.ts](/C:/AppServ/www/plantilla-www/tests/integration/fastApiContracts.test.ts)

Comando:

```powershell
$env:FASTAPI_CONTRACT_BASE_URL='https://backend.example.com'; npm run test:contracts:fastapi
```

Validar como minimo:

- `GET /v1/health`
- `GET /v1/site`
- `GET /v1/pricing`
- `POST /v1/contact`
- `POST /v1/quote/diagnostic`
- `GET /v1/quote/{quote_id}/pdf`

La auditoria falla si:

- algun endpoint devuelve shape distinto al contrato
- falta `request_id` donde el frontend lo espera
- `site` no devuelve `content`, `brand` y `seo` completos

## 2. Network en F12

Abrir:

- DevTools
- tab `Network`
- filtrar por `Fetch/XHR`

### `GET /v1/site`

Verificar:

- status `200`
- `status: "ok"`
- `request_id`
- `brand_id`
- `version`
- `content_revision`
- `data.content`
- `data.brand`
- `data.seo`

Validar especialmente:

- `data.content.homePage`
- `data.content.contactPage`
- `data.content.thanks`
- `data.brand.technician`
- `data.brand.whatsappQr`

### `GET /v1/pricing`

Verificar:

- status `200`
- `currency: "ARS"`
- `data.diagnostico_lista_2h_ars`

### `POST /v1/contact`

Verificar:

- status `201` en exito
- `request_id`
- `submission_id`
- `status`
- `processing_status`
- `detail`

### `GET /v1/quote/{quote_id}/pdf`

Verificar:

- `content-type: application/pdf`
- `content-disposition`
- `x-request-id`

## 3. Console en F12

El frontend ya emite logs estructurados utiles.

Buscar:

- `[backend:site]`
- `[backend:pricing]`
- `[quote:gateway]`
- `[quote:ui]`

Interpretacion esperada:

- `conexion OK` en `site` y `pricing`
- `endpoint` correcto
- `pathname` correcto
- `transportMode` correcto
- `status` correcto

## 4. Smoke manual funcional

### Home

Verificar:

- renderiza con `content` remoto
- textos de hero/home/faq vienen del payload
- CTA y navegacion rapida no muestran copy viejo local

### Contact

Verificar:

- `ContactPage` usa copy remoto
- formularios usan labels y submit labels remotos
- canales se habilitan segun `brand.contactFormActive` y `brand.emailFormActive`

### Thanks

Verificar:

- topbar y botones usan `content.thanks`

### Tecnico a cargo

Verificar:

- nombre, rol, foto y labels salen de `brand.technician`

### SEO

Verificar:

- `<title>`
- meta description
- Open Graph
- JSON-LD

Todos deben reflejar `seo`

## 5. Logs recomendados para backend

Si backend necesita trazabilidad, recomendamos loguear por request:

- `request_id`
- endpoint
- status code
- `brand_id`
- `version`
- `content_revision`
- tiempo de respuesta

No recomendamos:

- loguear PII completa de formularios
- loguear snapshots completos de `site` en produccion

## 6. Referencias en `docs/`

- [frontend-to-backend-handover-report.md](/C:/AppServ/www/plantilla-www/docs/frontend-to-backend-handover-report.md)
- [backend-content-brand-seo-contract.md](/C:/AppServ/www/plantilla-www/docs/backend-content-brand-seo-contract.md)
- [fastapi-backend-migration-guide.md](/C:/AppServ/www/plantilla-www/docs/fastapi-backend-migration-guide.md)
- [fastapi-contact-contract.md](/C:/AppServ/www/plantilla-www/docs/fastapi-contact-contract.md)
- [fastapi-content-pricing-contract.md](/C:/AppServ/www/plantilla-www/docs/fastapi-content-pricing-contract.md) solo para `pricing`
- [fastapi-quote-contract.md](/C:/AppServ/www/plantilla-www/docs/fastapi-quote-contract.md)
- [fastapi-router-implementation-checklist.md](/C:/AppServ/www/plantilla-www/docs/fastapi-router-implementation-checklist.md)

## Resultado esperado de una auditoria sana

La auditoria se considera correcta si:

- los tests de contrato pasan
- `Network` confirma el shape correcto de cada endpoint
- `Console` muestra conexion estructurada sin descartes de snapshot
- los flujos visuales criticos renderizan con datos remotos
