# Informe Frontend -> Backend

Fecha: 2026-02-28

## Resumen

Detectamos una inconsistencia de CORS entre dos orígenes de desarrollo que hoy usamos en frontend:

- `http://localhost:5173`
- `http://127.0.0.1:4173`

Para el backend local en `http://127.0.0.1:8899`, los endpoints `GET /v1/health` y `GET /v1/pricing` responden `200 OK` en ambos casos, pero solo devuelven cabeceras CORS para `http://localhost:5173`.

## Impacto en frontend

- En `http://localhost:5173`, el frontend puede consultar directo:
  - `http://127.0.0.1:8899/v1/health`
  - `http://127.0.0.1:8899/v1/pricing`
- En `http://127.0.0.1:4173`, esas mismas consultas directas quedan bloqueadas por navegador por falta de `Access-Control-Allow-Origin`.
- Como mitigacion, frontend vuelve a usar el proxy de Vite para `health` en `127.0.0.1:4173` y mantiene acceso directo solo para `http://localhost:5173`.

## Evidencia

### `GET /v1/health`

Origen: `http://localhost:5173`

Respuesta observada:

```http
HTTP/1.1 200 OK
Access-Control-Allow-Origin: http://localhost:5173
Vary: Origin
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, X-Request-Id
```

Origen: `http://127.0.0.1:4173`

Respuesta observada:

```http
HTTP/1.1 200 OK
```

Sin `Access-Control-Allow-Origin`.

### `GET /v1/pricing`

Origen: `http://localhost:5173`

Respuesta observada:

```http
HTTP/1.1 200 OK
Access-Control-Allow-Origin: http://localhost:5173
Vary: Origin
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, X-Request-Id
```

Origen: `http://127.0.0.1:4173`

Respuesta observada:

```http
HTTP/1.1 200 OK
```

Sin `Access-Control-Allow-Origin`.

## Comportamiento esperado

Para entorno local, backend deberia permitir ambos orígenes:

- `http://localhost:5173`
- `http://127.0.0.1:4173`

al menos para:

- `GET /v1/health`
- `GET /v1/pricing`

Si la politica de CORS depende de lista blanca, pedimos agregar ambos orígenes al entorno local.

## Nota adicional

El endpoint real de health del backend local hoy responde en:

- `http://127.0.0.1:8899/v1/health`

No en:

- `http://127.0.0.1:8899/api/v1/health`

Frontend ya corrigio sus checks directos de CI/E2E para usar `/v1/health`.
