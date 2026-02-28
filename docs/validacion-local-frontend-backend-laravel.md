# Validacion local frontend vs backend Laravel

Fecha: 2026-02-27

## Objetivo

Preparar una validacion local del frontend contra un backend paralelo/local para capturar el contrato realmente consumido por la app, sin tocar los endpoints productivos.

Endpoints foco:

- `POST /v1/contact`
- `POST /v1/mail`
- `POST /v1/quote/diagnostic`
- `GET /v1/quote/pdf?quote_id={quote_id}`

## Resumen ejecutivo

La forma soportada hoy por el repo para validar localmente contra un backend real es:

1. correr `npm run dev` o el frontend en modo `integration`
2. usar endpoints relativos `/api/v1/...`
3. dejar que Vite haga proxy al backend local/de pruebas

Eso permite capturar:

- metodo HTTP real
- path llamado por el frontend
- payload exacto
- headers del frontend
- status codes
- shape real de success/error
- `OPTIONS` manual de `contact` y `mail`
- descarga real de PDF

Matiz importante:

- Con proxy Vite, el navegador ve llamadas same-origin a `http://127.0.0.1:4173/api/v1/...`.
- El backend real recibe la URL final proxyficada, por ejemplo `http://127.0.0.1:8899/api/v1/contact`.
- Ese modo es el mas practico para validar contrato funcional.
- Si ademas quieren observar CORS/preflight real del navegador contra el backend, hace falta un segundo modo sin proxy, con endpoints absolutos apuntando al backend local.

## 1. URL base exacta del backend local/de pruebas

### Opcion recomendada

Backend disponible en:

- `http://127.0.0.1:8899`

Con rutas expuestas en:

- `http://127.0.0.1:8899/api/v1/contact`
- `http://127.0.0.1:8899/api/v1/mail`
- `http://127.0.0.1:8899/api/v1/quote/diagnostic`
- `http://127.0.0.1:8899/api/v1/quote/pdf?quote_id={quote_id}`

Esta es la misma base usada por la suite de integracion existente del repo.

### Opcion alternativa con AppServ/Apache

Si el backend local queda montado bajo:

- `http://localhost/plantilla-www/public/api/v1/...`

tambien se puede usar, dejando el proxy prefix por default.

## 2. Como configurarlo en local

### 2.1 Configuracion recomendada sin tocar codigo

Usar el perfil runtime `integration`, que ya trae endpoints relativos:

- `inquiryApiUrl: /api/v1/contact`
- `mailApiUrl: /api/v1/mail`
- `pricingApiUrl: /api/v1/pricing`
- `contentApiUrl: /api/v1/content`
- `healthApiUrl: /api/v1/health`
- `quoteDiagnosticApiUrl: /api/v1/quote/diagnostic`
- `quotePdfApiUrl: /api/v1/quote/pdf?quote_id={quote_id}`

Archivo fuente:

- `src/infrastructure/content/runtimeProfiles.json`

### 2.2 Variables y knobs disponibles hoy

Para frontend local, hoy los knobs utiles son:

- `PLAYWRIGHT_MODE=integration`
- `VITE_API_PROXY_TARGET`
- `VITE_API_PROXY_PREFIX`
- `VITE_HEALTH_ENDPOINT` solo si quieren overridear health con una ruta relativa en `integration/e2e`

No existe hoy un set de `VITE_*` por endpoint para `contact`, `mail`, `pricing`, `content`, `quote/diagnostic` y `quote/pdf`.

Esos endpoints salen del runtime profile.

### 2.3 Configuracion recomendada en PowerShell

Si el backend local responde directo en `http://127.0.0.1:8899/api/v1/...`:

```powershell
$env:VITE_API_PROXY_TARGET='http://127.0.0.1:8899'
$env:VITE_API_PROXY_PREFIX=''
npm run dev -- --host 127.0.0.1 --port 4173
```

Resultado:

- navegador: `http://127.0.0.1:4173`
- frontend llama a `/api/v1/...`
- Vite reescribe a `http://127.0.0.1:8899/api/v1/...`

Si el backend local responde bajo `http://localhost/plantilla-www/public/api/v1/...`:

```powershell
$env:VITE_API_PROXY_TARGET='http://localhost'
Remove-Item Env:VITE_API_PROXY_PREFIX -ErrorAction SilentlyContinue
npm run dev -- --mode integration --host 127.0.0.1 --port 4173
```

En ese caso Vite usa el prefix default:

- `/plantilla-www/public`

y reescribe por ejemplo:

- browser: `/api/v1/contact`
- backend final: `http://localhost/plantilla-www/public/api/v1/contact`

### 2.4 Backend local sugerido

Si hay una replica PHP/Laravel escuchando el contrato en `/api/v1`, una forma minima de levantarlo es:

```powershell
php -S 127.0.0.1:8899 -t public
```

o el equivalente Laravel si esa app ya resuelve `/api/v1/...`.

## 3. Si alcanza con build servido en localhost o si conviene `npm run dev`

Recomendacion:

- usar `npm run dev`

Motivo:

- `npm run dev` ahora resuelve el profile `integration`, que ya viene preparado con endpoints relativos `/api/v1/...`
- `vite.config.js` ya tiene proxy de desarrollo para `/api`
- es el camino que ya usa Playwright para `test:e2e:integration`

No recomiendo usar `npm run build` para esta validacion local, salvo que:

1. sirvan el build bajo un host que tambien proxyfique `/api`
2. o el backend este publicado en el mismo origin y mismo path `/api/v1/...`

Si se sirve solo el build estatico en `http://localhost`, no alcanza por si solo para reenviar `/api` al backend local.

Ademas:

- `npm run build` por default usa target `datamaq`, que apunta a endpoints productivos absolutos.
- para validacion local, el perfil correcto es `integration` o `e2e`, no `datamaq`.

## 4. Como reproducir localmente los flujos

## 4.1 Contacto

URL frontend:

- `http://127.0.0.1:4173/`

Pasos:

1. ir a la seccion `#contacto-lead`
2. completar email
3. completar mensaje
4. click en `Registrar contacto`

El frontend hace:

1. `OPTIONS /api/v1/contact` para sonda de disponibilidad
2. `POST /api/v1/contact`

Payload real:

```json
{
  "name": "ada",
  "email": "ada@example.com",
  "message": "Necesito una propuesta para mantenimiento industrial.",
  "custom_attributes": {
    "message": "Necesito una propuesta para mantenimiento industrial."
  },
  "meta": {
    "page_location": "http://127.0.0.1:4173/",
    "traffic_source": "direct",
    "user_agent": "Mozilla/5.0 ...",
    "created_at": "2026-02-27T23:00:00.000Z"
  }
}
```

Headers relevantes:

- `OPTIONS`: sin headers custom desde app; `fetch` usa `mode: cors`
- `POST`:
  - `Content-Type: application/json`

Notas:

- `name` se infiere del local-part del email.
- `attribution` solo viaja si hay UTMs/GCLID guardados en storage.

## 4.2 Mail

URL frontend:

- `http://127.0.0.1:4173/`

Pasos:

1. ir a la seccion `#contacto-mail`
2. completar email
3. completar mensaje
4. click en `Enviar consulta por correo`

El frontend hace:

1. `OPTIONS /api/v1/mail`
2. `POST /api/v1/mail`

Payload:

- misma estructura que `contact`

Headers relevantes:

- `Content-Type: application/json`

## 4.3 Generacion de cotizacion

URL frontend:

- `http://127.0.0.1:4173/cotizador`

Pasos:

1. completar `Empresa`
2. completar `Nombre de contacto`
3. completar `Localidad`
4. responder:
   - `Turno agendado`
   - `Acceso preparado`
   - `Ventana segura confirmada`
5. opcional:
   - `Burocracia`
   - `Email`
   - `Telefono`
   - `Notas`
6. click en `Generar propuesta`

El frontend hace:

- `POST /api/v1/quote/diagnostic`

Payload real:

```json
{
  "company": "ACME Test",
  "contact_name": "Ada QA",
  "locality": "Escobar",
  "scheduled": true,
  "access_ready": true,
  "safe_window_confirmed": true,
  "bureaucracy": "medium",
  "email": "ada+quote@example.com",
  "phone": "1155550000",
  "notes": "VALIDACION LOCAL SIN EFECTOS LATERALES"
}
```

Headers relevantes:

- `Content-Type: application/json`

## 4.4 Descarga de PDF

Precondicion:

- haber generado una cotizacion valida y obtener `quote_id`

Paso:

1. click en `Descargar PDF`

El frontend hace:

- `GET /api/v1/quote/pdf?quote_id={quote_id}`

Headers relevantes:

- `Accept: application/pdf, application/json`

Comportamiento esperado:

- success:
  - `200`
  - `Content-Type: application/pdf`
  - opcional `Content-Disposition`
- error:
  - JSON con `detail` o `message`
  - opcional `Retry-After`

## 5. Datos de prueba recomendados

Para evitar efectos laterales no deseados:

- usar una instancia de backend local o de staging que no envie emails reales ni cree leads reales
- si el backend dispara integraciones, desactivarlas en su `.env`
- usar dominios de ejemplo para email:
  - `ada@example.com`
  - `ada+mail@example.com`
  - `ada+quote@example.com`
- usar mensajes claramente marcados:
  - `VALIDACION LOCAL SIN EFECTOS LATERALES`
  - `Prueba de contrato frontend-backend`

Datos recomendados:

### Contact y mail

- email: `ada@example.com`
- message: `Prueba de contrato frontend-backend sin efectos laterales.`

### Quote

- company: `ACME Test`
- contact_name: `Ada QA`
- locality: `Escobar`
- scheduled: `true`
- access_ready: `true`
- safe_window_confirmed: `true`
- bureaucracy: `medium`
- email: `ada+quote@example.com`
- phone: `1155550000`
- notes: `VALIDACION LOCAL SIN EFECTOS LATERALES`

## 6. Flags, mocks y diferencias entre `build` y `dev`

### 6.1 Modo recomendado para backend real

- `integration`

Porque:

- usa endpoints relativos `/api/v1/...`
- no pega a produccion
- ya existe en `runtimeProfiles.json`

### 6.2 Modo con mocks

- `e2e`
- se usa en `tests/e2e/smoke.spec.ts`
- ahi Playwright mockea `health`, `pricing`, `content`, `contact` y `mail`

No sirve para capturar backend real.

### 6.3 Diferencia clave `dev` vs `build`

En `dev`:

- hay proxy Vite para `/api`
- es el camino mas simple para un backend local en otro puerto

En `build`:

- no hay proxy automatico equivalente en este repo
- si sirven estatico puro, `/api` debe resolverlo el servidor web que sirve el build

### 6.4 Diferencia clave proxy vs sin proxy

Con proxy:

- browser ve same-origin a `127.0.0.1:4173`
- backend final se deduce por `VITE_API_PROXY_TARGET` + `VITE_API_PROXY_PREFIX`
- sirve para validar contrato funcional

Sin proxy:

- browser pega directo al backend local
- permite observar CORS/preflight real
- requiere editar temporalmente el profile `integration` para usar URLs absolutas `http://127.0.0.1:8899/...`

## 7. Que capturar exactamente

Para cada endpoint, guardar:

1. metodo HTTP
2. URL visible en browser
3. URL final backend
4. request headers
5. request body
6. response status
7. response headers
8. response body o preview de body

Para `contact` y `mail`, adicionalmente:

1. request `OPTIONS`
2. response a `OPTIONS`
3. request `POST`
4. response a `POST`

Para `quote/pdf`, adicionalmente:

1. `Content-Type`
2. `Content-Disposition`
3. `Cache-Control`
4. `X-Request-Id`
5. `X-Content-Type-Options`

## 8. Recomendacion practica de captura

### Opcion A: browser + logs backend

1. abrir DevTools Network en el browser
2. activar `Preserve log`
3. filtrar por `/api/v1/`
4. ejecutar los 4 flujos
5. guardar HAR o screenshots
6. complementar con logs del backend local para ver URL final despues del proxy

### Opcion B: Playwright contra backend real

Ya existe:

- `npm run test:e2e:integration`

Hoy cubre:

- submit de contacto
- submit de mail

No cubre aun:

- quote diagnostic
- quote pdf

Para esos dos, hoy la reproduccion es manual en `/cotizador`.

## 9. Respuesta corta a las 6 preguntas

1. URL base recomendada: `http://127.0.0.1:8899`
2. Configuracion recomendada:
   - frontend en modo `integration`
   - `VITE_API_PROXY_TARGET=http://127.0.0.1:8899`
   - `VITE_API_PROXY_PREFIX=`
   - sin tocar `.env` del frontend
3. Recomendacion: `npm run dev`, no build
4. Flujos:
   - home `#contacto-lead`
   - home `#contacto-mail`
   - `/cotizador` generar propuesta
   - `/cotizador` descargar PDF
5. Datos de prueba:
   - `example.com`
   - mensajes marcados como prueba sin efectos laterales
6. Diferencias:
   - `e2e` usa mocks
   - `integration` usa backend real
   - `dev` tiene proxy
   - `build` no lo resuelve por si solo

## Evidencia en el repo

- `vite.config.js`
- `src/infrastructure/content/runtimeProfiles.json`
- `playwright.config.ts`
- `tests/e2e/integration.backend.spec.ts`
- `tests/e2e/smoke.spec.ts`
- `src/infrastructure/contact/contactPayloadBuilder.ts`
- `src/infrastructure/quote/quoteApiGateway.ts`
- `src/ui/pages/QuotePage.vue`
