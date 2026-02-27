# Contrato API Canonico v1 (agnostico de framework)

Fecha de actualizacion: 2026-02-26.

## Base y versionado

- Base URL oficial (produccion): `https://api.datamaq.com.ar/v1`
- Base URL anterior deprecada: `https://datamaq.com.ar/api/v1`
- Base funcional canonica: `/api/v1/...`
- Endpoints canonicos:
  - `GET /api/v1/content`
  - `GET /api/v1/pricing`
  - `GET /api/v1/health`
  - `POST /api/v1/contact`
  - `POST /api/v1/mail`

## Formato de exito

- `2xx` indica exito.
- Campo comun recomendado: `request_id` (string).

## Formato de error comun (congelado)

Todos los errores funcionales deben incluir:

```json
{
  "status": "error",
  "request_id": "req-20260226000000-ab12cd34",
  "code": "VALIDATION_ERROR",
  "message": "email format is invalid.",
  "details": []
}
```

Compatibilidad transitoria legacy permitida:

- `error_code` (alias de `code`)
- `detail` (alias de `message`)

## Contrato por endpoint

### `GET /api/v1/content`

- `200`: payload de contenido UI por target:
  - metadatos: `status`, `request_id`, `brand_id`, `version`
  - cuerpo: `data` (AppContent)
- `405`: error comun

### `GET /api/v1/pricing`

- `200`: metadatos + `currency` + `data`
- `data` incluye al menos `diagnostico_lista_2h_ars` (number)
- valor backend hardcodeado actual: `275000` (ARS)
- fuente backend actual: `public/api/_pricing_impl.php` (clave `diagnostico_lista_2h_ars`)
- `405`: error comun

### `GET /api/v1/health`

- `200`: `status`, `request_id`, `service`, `brand_id`, `version`, `timestamp`
- `405`: error comun
- Compatibilidad transitoria permitida: alias legacy `GET /api/v1/health.php`

### `POST /api/v1/contact`

- Request JSON: `email`, `message` (minimo requerido), resto opcional.
- `202`: aceptado, con `request_id`.
- `422`: validacion/json invalido (error comun).
- `429`: rate limit (error comun + `Retry-After`).
- `405`: error comun.

### `POST /api/v1/mail`

- Mismo contrato que `contact`.

## Compatibilidad legacy durante transicion

- Se mantienen aliases por archivo (`/api/v1/*.php`) en ventana transitoria.
- El frontend debe consumir exclusivamente rutas canonicas sin extension.
- Criterio de salida de legacy: remover aliases solo cuando no existan consumidores activos.

## Nota operativa sobre `quote/pdf`

- `GET /api/v1/quote/pdf` se mantiene como endpoint **mock transitorio** en esta etapa.
- Alcance actual del mock:
  - valida `quote_id`
  - retorna `application/pdf` sintético
  - propaga `request_id` via header `X-Request-Id`

## Configuración operativa por entorno

- Límite de payload JSON (bytes):
  - `API_MAX_BODY_BYTES` (default: `32768`)
- Rate limit por bucket (`contact`, `mail`, `quote_diagnostic`):
  - `API_RL_<BUCKET>_LIMIT`
  - `API_RL_<BUCKET>_WINDOW_SECONDS`
  - Ejemplo: `API_RL_CONTACT_LIMIT`, `API_RL_CONTACT_WINDOW_SECONDS`
- Nivel de logging estructurado:
  - `API_LOG_LEVEL` en `debug|info|warn|error` (default: `info`)
