# Informe Frontend -> Backend Laravel

Fecha: 2026-02-28

## Resumen Ejecutivo

Frontend ya quedo unificado para desarrollo local con un unico criterio de transporte:

- `health` -> `/api/v1/health`
- `content` -> `/api/v1/content`
- `pricing` -> `/api/v1/pricing`

En desarrollo, Vite hace proxy a Laravel local en `http://127.0.0.1:8899` y reescribe `/api/v1/*` hacia `/v1/*`.

Con esto, el flujo actual funciona y no depende de cambios inmediatos en backend para desarrollo local.

Igualmente, recomendamos solicitar cambios en Laravel para reducir excepciones, evitar drift entre endpoints y dejar una politica de integracion mas estable.

## Estado Actual

- Frontend ya no mezcla acceso directo y acceso via proxy dentro del perfil `integration`.
- `npm run dev`, `npm run build` y `npm run test:e2e:integration` estan pasando con el contrato actual.
- El backend local real sigue exponiendo sus endpoints publicos bajo `/v1/*`.
- El prefijo `/api/v1/*` en desarrollo es hoy un contrato del frontend + proxy de Vite, no del backend real.

## Cambios Recomendados al Backend

### 1. Unificar politica CORS para endpoints publicos usados por frontend

Solicitamos la misma politica CORS, al menos en entorno local, para:

- `GET /v1/health`
- `GET /v1/content`
- `GET /v1/pricing`
- idealmente tambien:
  - `POST /v1/contact`
  - `POST /v1/mail`
  - `POST /v1/quote/diagnostic`
  - `GET /v1/quote/pdf`

Origenes locales a permitir:

- `http://localhost:5173`
- `http://127.0.0.1:4173`

Implementacion esperada en Laravel:

- revisar `config/cors.php`
- asegurar `allowed_origins` y `allowed_methods` consistentes
- asegurar `allowed_headers` consistentes
- asegurar respuestas correctas a `OPTIONS` si aplica

### 2. Evitar redirecciones innecesarias en endpoints API

Solicitamos que los endpoints publicos respondan directamente sin depender de redirecciones tipo:

- `/v1/health` -> `/v1/health/`
- `/v1/content` -> `/v1/content/`
- `/v1/pricing` -> `/v1/pricing/`

Motivo:

- los redirects sobre API complican CORS
- hacen mas ruidoso el debugging
- fuerzan excepciones innecesarias en frontend/proxy

### 3. Estandarizar metadatos de respuesta

Hoy frontend ya consume y loguea metadatos tecnicos de backend. Para mejorar trazabilidad, sugerimos un contrato uniforme cuando la respuesta sea JSON:

- `status`
- `request_id`
- `version`
- `brand_id`
- `timestamp`

No es bloqueante que todos los endpoints devuelvan todos los campos, pero si seria conveniente que:

- `health`
- `content`
- `pricing`

mantengan el mismo criterio de naming y presencia.

### 4. Documentar el contrato canonico del backend

Necesitamos confirmar formalmente que el contrato canonico del backend Laravel es:

- `/v1/*`

y que `/api/v1/*` no es una ruta del backend sino una convencion del frontend/proxy en desarrollo.

Esto evita drift entre:

- CI
- E2E
- Vite dev server
- entornos manuales con AppServ o artisan serve

## Prioridad

### No bloqueante

El frontend actual ya funciona sin estos cambios porque el proxy de Vite absorbe la diferencia entre `/api/v1/*` y `/v1/*`.

### Recomendado

Estos cambios si valen la pena porque:

- reducen problemas de CORS cuando se hagan pruebas directas contra Laravel
- simplifican observabilidad y soporte
- facilitan converger a una politica de integracion mas simple
- disminuyen la necesidad de excepciones de entorno

## Criterios de Aceptacion Sugeridos

1. `GET /v1/health`, `GET /v1/content` y `GET /v1/pricing` responden sin redirect.
2. Los tres endpoints responden con la misma politica CORS para:
   - `http://localhost:5173`
   - `http://127.0.0.1:4173`
3. `OPTIONS` responde correctamente donde corresponda.
4. Los endpoints JSON mencionados exponen, cuando aplique, metadatos consistentes:
   - `status`
   - `request_id`
   - `version`
   - `brand_id`
   - `timestamp`
5. Backend confirma por escrito que el namespace canonico es `/v1/*`.

## Nota Final

Desde frontend, el pedido no apunta a cambiar logica funcional de negocio.
Apunta a estabilizar la capa de integracion HTTP entre Vue/Vite y Laravel para que el contrato de desarrollo y debugging sea mas predecible.
