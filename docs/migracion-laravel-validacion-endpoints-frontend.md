# Validacion de endpoints backend consumidos por el frontend

Fecha de validacion: 2026-02-27

Nota:

- Este documento refleja la observacion de produccion realizada el 2026-02-27.
- En el codigo fuente de esta rama, la sonda `health` ya fue limpiada para usar un endpoint de health desde configuracion runtime o `VITE_HEALTH_ENDPOINT`.

Alcance de esta validacion:

- Codigo fuente del frontend en este repositorio, target de build por defecto `datamaq`.
- Pruebas unitarias de configuracion y gateways del frontend.
- Inspeccion del bundle realmente desplegado en `https://datamaq.com.ar/assets/index-Bk8LQHp9.js`.
- Verificacion live no intrusiva de `GET https://api.datamaq.com.ar/v1/health`, `GET https://api.datamaq.com.ar/v1/content` y `GET https://api.datamaq.com.ar/v1/pricing`.
- No se hicieron `POST` reales a produccion para `contact`, `mail` ni `quote/diagnostic` para evitar efectos laterales.

## Resumen ejecutivo

No, el frontend actual no consume solo 4 endpoints.

Hoy consume 7 rutas backend:

1. `GET /api/v1/health.php` relativo al origin del frontend
2. `POST https://api.datamaq.com.ar/v1/contact`
3. `POST https://api.datamaq.com.ar/v1/mail`
4. `GET https://api.datamaq.com.ar/v1/pricing`
5. `GET https://api.datamaq.com.ar/v1/content`
6. `POST https://api.datamaq.com.ar/v1/quote/diagnostic`
7. `GET https://api.datamaq.com.ar/v1/quote/pdf?quote_id={quote_id}`

Ademas, antes del primer `POST` a `contact` o `mail`, el frontend hace una sonda `OPTIONS` al mismo endpoint para verificar disponibilidad.

Nota de host de produccion:

- El bundle productivo verificado el 2026-02-27 esta publicado en `https://datamaq.com.ar`.
- `https://www.datamaq.com.ar` no estaba sirviendo la SPA en esa fecha, por lo que el path relativo de health debe interpretarse sobre `https://datamaq.com.ar`.

## Validacion de la lista original

- `GET /v1/health.php`: si, pero en el frontend esta hardcodeado como `/api/v1/health.php` relativo al origin del sitio. No esta configurado hoy como `https://api.datamaq.com.ar/v1/health`.
- `POST /v1/contact.php`: no. El frontend usa `POST https://api.datamaq.com.ar/v1/contact`. El alias `.php` puede existir del lado backend, pero no es la URL configurada hoy en frontend.
- `POST /v1/mail.php`: no. El frontend usa `POST https://api.datamaq.com.ar/v1/mail`.
- `POST /v1/quote/pdf.php`: no. El frontend usa `GET https://api.datamaq.com.ar/v1/quote/pdf?quote_id={quote_id}`.

## Inventario completo

| Endpoint funcional | URL exacta usada hoy | Metodo(s) | Cuando se dispara |
| --- | --- | --- | --- |
| Health probe | `/api/v1/health.php` | `GET` | Al iniciar la app en cliente |
| Contact form | `https://api.datamaq.com.ar/v1/contact` | `OPTIONS`, luego `POST` | En el primer submit del formulario "Ingreso de contacto" |
| Mail form | `https://api.datamaq.com.ar/v1/mail` | `OPTIONS`, luego `POST` | En el primer submit del formulario "Enviar e-mail" |
| Pricing | `https://api.datamaq.com.ar/v1/pricing` | `GET` | Al iniciar la app en cliente |
| Content | `https://api.datamaq.com.ar/v1/content` | `GET` | Al iniciar la app en cliente |
| Quote diagnostic | `https://api.datamaq.com.ar/v1/quote/diagnostic` | `POST` | En `/cotizador`, al generar propuesta |
| Quote PDF | `https://api.datamaq.com.ar/v1/quote/pdf?quote_id={quote_id}` | `GET` | En `/cotizador`, al descargar PDF |

## Detalle por endpoint

### 1. Health

- URL exacta usada hoy por el codigo: `/api/v1/health.php`
- URL efectiva sobre el host productivo hoy: `https://datamaq.com.ar/api/v1/health.php`
- Metodo: `GET`
- Headers relevantes:
  - `Accept: application/json`
- Parametros enviados: ninguno
- Forma esperada de la respuesta:
  - Cualquier `2xx` se considera saludable.
  - Si la respuesta es JSON, el frontend intenta leer opcionalmente:
    - `status`
    - `service`
    - `brand_id` o `brandId`
    - `version`
    - `timestamp`
  - Si falla, solo loguea warning; no bloquea la UX.
- Ejemplo live validado:

```json
{
  "status": "ok",
  "request_id": "57941702-0aa8-4a0a-8ef0-2dd6cd6dd403",
  "service": "datamaq-api",
  "brand_id": "datamaq",
  "version": "v1",
  "timestamp": "2026-02-27T23:06:44+00:00"
}
```

- Variante sin `.php`:
  - Existe evidencia documental/test de `/api/v1/health`, pero el frontend hoy no la usa salvo que se inyecte `VITE_HEALTH_ENDPOINT`.

### 2. Contact

- URL exacta usada hoy: `https://api.datamaq.com.ar/v1/contact`
- Metodos:
  - `OPTIONS` como sonda de disponibilidad antes del primer submit
  - `POST` para el envio real
- Headers relevantes:
  - `OPTIONS`: sin headers explicitos del frontend
  - `POST`: `Content-Type: application/json`
- Parametros enviados en `POST`:

```json
{
  "name": "juan",
  "email": "juan@example.com",
  "message": "Necesito una propuesta para mantenimiento electrico.",
  "custom_attributes": {
    "message": "Necesito una propuesta para mantenimiento electrico."
  },
  "meta": {
    "page_location": "https://www.datamaq.com.ar/contacto",
    "traffic_source": "organic",
    "user_agent": "Mozilla/5.0 ...",
    "created_at": "2026-02-14T10:00:00.000Z"
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

Notas:

- `name` no lo ingresa el usuario en este formulario; el frontend lo infiere desde el local-part del email o usa fallback `Contacto Web`.
- `attribution` es opcional y solo viaja si el sitio habia guardado UTMs/GCLID en storage.

- Forma esperada de la respuesta:
  - `OPTIONS`:
    - Si devuelve `200`, `400` o `405`, el frontend considera el backend disponible.
  - `POST` success:
    - Cualquier `2xx`/`202` con cuerpo JSON o vacio.
    - El frontend solo necesita `ok === true`.
    - Si existe, extrae `request_id` desde body o `x-request-id` desde headers.
  - `POST` error:
    - El frontend lee opcionalmente:
      - request id: `x-request-id`, `request-id`, `x-correlation-id`, `request_id`, `request.id`, `meta.request_id`
      - error code: `error_code`, `code`, `error.code`
      - mensaje: `detail`, `message`, `error`, `errorMessage`, `description`, `error.message`

- Respuesta tipica compatible:

```json
{
  "status": "ok",
  "request_id": "req_123"
}
```

- Error tipico compatible:

```json
{
  "status": "error",
  "request_id": "req_123",
  "error_code": "VALIDATION_ERROR",
  "detail": "Email invalido"
}
```

- Variante `.php`:
  - El frontend no usa `contact.php`.
  - El alias legacy sigue vivo del lado backend y respondio `204` a `OPTIONS` y `405` a `GET` el 2026-02-27, pero no es la ruta consumida hoy por la SPA.

### 3. Mail

- URL exacta usada hoy: `https://api.datamaq.com.ar/v1/mail`
- Metodos:
  - `OPTIONS` como sonda de disponibilidad antes del primer submit
  - `POST` para el envio real
- Headers relevantes:
  - `OPTIONS`: sin headers explicitos del frontend
  - `POST`: `Content-Type: application/json`
- Parametros enviados:
  - Exactamente la misma estructura JSON que en `contact`
- Forma esperada de la respuesta:
  - Exactamente la misma tolerancia que en `contact`
- Variante `.php`:
  - El frontend no usa `mail.php`.
  - El alias legacy sigue vivo del lado backend y respondio `204` a `OPTIONS` y `405` a `GET` el 2026-02-27, pero no es la ruta consumida hoy por la SPA.

### 4. Pricing

- URL exacta usada hoy: `https://api.datamaq.com.ar/v1/pricing`
- Metodo: `GET`
- Headers relevantes:
  - `Accept: application/json, text/plain;q=0.9, */*;q=0.8`
- Parametros enviados: ninguno
- Forma esperada de la respuesta:
  - Cualquier `2xx` habilita parsing.
  - El frontend busca un precio numerico usando aliases tolerantes.
  - Contrato preferido hoy:

```json
{
  "status": "ok",
  "request_id": "faa95ef5-f759-4b34-87c7-f97cb5cb1a86",
  "version": "v1",
  "currency": "ARS",
  "data": {
    "diagnostico_lista_2h_ars": 275000
  }
}
```

  - Si ese valor no aparece, el frontend soporta aliases como:
    - `visitaDiagnosticoHasta2hARS`
    - `visita_diagnostico_hasta2h_ars`
    - `visita_diagnostico_hasta_2h_ars`
    - `visita_diagnostico_2h_ars`
    - `visita_diagnostico_2h`
    - `visita_diagnostico_ars`
  - Si no encuentra un valor util, mantiene el fallback local de contenido.

- Endpoint adicional:
  - Si, este endpoint se consume hoy en produccion aunque no estaba en la lista original.

### 5. Content

- URL exacta usada hoy: `https://api.datamaq.com.ar/v1/content`
- Metodo: `GET`
- Headers relevantes:
  - `Accept: application/json, text/plain;q=0.9, */*;q=0.8`
- Parametros enviados: ninguno
- Forma esperada de la respuesta:
  - Preferido: JSON con un objeto `data` que cumpla el schema completo de `AppContent`.
  - Minimo tolerado: `data.hero.title` o `hero.title`.
  - Contrato preferido hoy:

```json
{
  "status": "ok",
  "request_id": "b99de777-988a-4d93-b920-ee6855df494e",
  "brand_id": "datamaq",
  "version": "v2",
  "content_revision": "eb006eeb1454cbe83edf89c0be37b6be50008421330aa8a1afd0174787a965d0",
  "data": {
    "hero": {
      "title": "..."
    }
  }
}
```

  - Si el snapshot completo no valida, el frontend intenta al menos rescatar `hero.title`.
  - Si tampoco existe un `hero.title` usable, mantiene el contenido local embebido.

- Endpoint adicional:
  - Si, este endpoint se consume hoy en produccion aunque no estaba en la lista original.

### 6. Quote diagnostic

- URL exacta usada hoy: `https://api.datamaq.com.ar/v1/quote/diagnostic`
- Metodo: `POST`
- Headers relevantes:
  - `Content-Type: application/json`
- Parametros enviados:

```json
{
  "company": "ACME",
  "contact_name": "Juan",
  "locality": "Escobar",
  "scheduled": true,
  "access_ready": true,
  "safe_window_confirmed": true,
  "bureaucracy": "medium",
  "email": "juan@example.com",
  "phone": "1155555555",
  "notes": "Texto opcional"
}
```

Notas:

- `bureaucracy` es opcional y puede ser `low`, `medium` o `high`.
- `email`, `phone` y `notes` son opcionales.

- Forma esperada de la respuesta:

```json
{
  "quote_id": "Q-20260222-000111",
  "list_price_ars": 280000,
  "discounts": [
    {
      "code": "DISC1",
      "label": "Turno",
      "amount_ars": 14000
    }
  ],
  "discount_pct": 5,
  "discount_total_ars": 14000,
  "final_price_ars": 266000,
  "deposit_pct": 50,
  "deposit_ars": 133000,
  "valid_until": "2026-03-01T00:00:00Z",
  "whatsapp_message": "Hola DataMaq...",
  "whatsapp_url": "https://wa.me/5491168758623?text=Hola"
}
```

- Respuesta de error tolerada:
  - `detail` string
  - o `detail` array de errores de validacion con `loc`, `msg`, `type`
  - `Retry-After` si hay `429`

Nota:

- El frontend no hace una sonda manual `OPTIONS` para este endpoint.
- Aun asi, al ser un `POST` cross-origin con `Content-Type: application/json`, el navegador puede realizar preflight CORS automaticamente. El backend productivo respondio `204` a `OPTIONS` el 2026-02-27.

- Endpoint adicional:
  - Si, este endpoint se consume hoy en produccion aunque no estaba en la lista original.

### 7. Quote PDF

- URL exacta usada hoy: `https://api.datamaq.com.ar/v1/quote/pdf?quote_id={quote_id}`
- Metodo: `GET`
- Headers relevantes:
  - `Accept: application/pdf, application/json`
- Parametros enviados:
  - Query string `quote_id`
  - El frontend valida localmente formato `Q-YYYYMMDD-######` antes de llamar
- Forma esperada de la respuesta:
  - Success:
    - `200`
    - `Content-Type: application/pdf`
    - opcional `Content-Disposition` con `filename=` o `filename*=UTF-8''...`
    - el frontend descarga el blob PDF
  - Error:
    - JSON con `detail` o `message`
    - opcional `Retry-After` en `429`

- Contrato backend verificado por tests:
  - `x-request-id` presente
  - `cache-control: no-store`
  - `x-content-type-options: nosniff`

- Variante `.php`:
  - El frontend no usa `quote/pdf.php`.
  - Tampoco usa `POST`.
  - La llamada actual es `GET` con `quote_id` por query string.
  - El alias legacy `https://api.datamaq.com.ar/v1/quote/pdf.php?quote_id=...` sigue vivo del lado backend y respondio `200 application/pdf` el 2026-02-27, pero no es la URL embebida en el bundle productivo.

## Variantes y fallbacks que NO estan activos hoy en produccion

- `backendBaseUrl` esta en `null` para `datamaq`, asi que no hay fallback activo construyendo rutas legacy tipo `/v1/public/...`.
- El frontend no usa hoy estas URLs legacy:
  - `https://api.datamaq.com.ar/v1/contact.php`
  - `https://api.datamaq.com.ar/v1/mail.php`
  - `https://api.datamaq.com.ar/v1/quote/pdf.php`
  - `https://api.datamaq.com.ar/v1/public/pricing`
  - `https://api.datamaq.com.ar/v1/public/content`
  - `https://api.datamaq.com.ar/v1/public/quote/diagnostic`

## Implicancia para la migracion a Laravel

Si se quiere migrar a Laravel sin tocar el frontend actual, el contrato minimo a preservar hoy es:

1. Mantener `POST https://api.datamaq.com.ar/v1/contact`
2. Mantener `POST https://api.datamaq.com.ar/v1/mail`
3. Mantener `GET https://api.datamaq.com.ar/v1/pricing`
4. Mantener `GET https://api.datamaq.com.ar/v1/content`
5. Mantener `POST https://api.datamaq.com.ar/v1/quote/diagnostic`
6. Mantener `GET https://api.datamaq.com.ar/v1/quote/pdf?quote_id={quote_id}`
7. Mantener respuesta valida a `OPTIONS` sobre `contact` y `mail`
8. Mantener `/api/v1/health.php` mientras no se cambie el frontend o se configure `VITE_HEALTH_ENDPOINT`

Si Laravel expone solo rutas sin `.php`, eso ya coincide con todo excepto health. El unico punto donde el frontend todavia depende explicitamente de `.php` es la sonda de salud.

## Evidencia en el codigo

- Perfil runtime `datamaq`: `src/infrastructure/content/runtimeProfiles.json`
- Resolucion de endpoints activos: `src/infrastructure/config/publicConfig.ts`, `src/infrastructure/config/viteConfig.ts`
- Health probe: `src/infrastructure/health/probeBackendHealth.ts`, `src/main.ts`
- Contact y mail: `src/infrastructure/contact/contactApiGateway.ts`, `src/infrastructure/contact/contactPayloadBuilder.ts`, `src/application/use-cases/submitContact.ts`, `src/application/contact/contactBackendStatus.ts`
- Content y pricing: `src/infrastructure/content/dynamicContentService.ts`, `src/infrastructure/content/dynamicPricingService.ts`, `src/infrastructure/content/contentRepository.ts`
- Cotizador: `src/infrastructure/quote/quoteApiGateway.ts`, `src/ui/pages/QuotePage.vue`
- Tests de soporte: `tests/unit/infrastructure/publicConfig.test.ts`, `tests/unit/infrastructure/viteConfig.test.ts`, `tests/unit/infrastructure/contactApiGateway.test.ts`, `tests/unit/infrastructure/quoteApiGateway.test.ts`, `tests/unit/infrastructure/probeBackendHealth.test.ts`
