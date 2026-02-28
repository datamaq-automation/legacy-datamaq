# Informe Frontend -> Backend: endpoints directos y CORS local

## Contexto

El frontend ya quedo refactorizado para resolver y loguear endpoints backend de forma consistente.
En desarrollo local hoy conviven dos modos de acceso:

- acceso directo al backend real `http://127.0.0.1:8899/v1/*`
- acceso via proxy de Vite con rutas `/api/v1/*`

Frontend usa acceso directo en `integration` para `health` y `content`, y mantiene `pricing` via proxy por compatibilidad de red.

## Hallazgos

- `GET /v1/health` responde correctamente para origen `http://localhost:5173`.
- `GET /v1/content` responde correctamente para origen `http://localhost:5173`.
- `GET /v1/content` tambien responde correctamente para origen `http://127.0.0.1:4173`.
- `pricing` no pudo migrarse a acceso directo de forma segura para todos los origenes locales, por eso sigue pasando por `/api/v1/pricing`.

## Impacto en frontend

- El perfil `integration` queda asimetrico: algunos endpoints van directos y otros via proxy.
- Esa asimetria complica observabilidad, debugging y criterio uniforme por entorno.
- Para evitar regresiones E2E, frontend tuvo que mantener una excepcion especifica en `pricing` y una resolucion condicional en `health`.

## Pedido al equipo backend

- Habilitar una politica CORS uniforme para los endpoints publicos usados por frontend local:
  - `GET /v1/health`
  - `GET /v1/content`
  - `GET /v1/pricing`
- Asegurar soporte explicito para ambos origenes de desarrollo:
  - `http://localhost:5173`
  - `http://127.0.0.1:4173`
- Mantener la misma politica de cabeceras CORS entre `health`, `content` y `pricing`.
- Confirmar si el backend considera canonico `localhost` o `127.0.0.1` para desarrollo local.

## Resultado esperado

Si backend unifica CORS para esos endpoints, frontend puede converger a una sola politica por perfil:

- `integration`: todo directo al backend real, sin excepciones por endpoint
- `e2e`: todo via proxy o todo directo, pero sin mezclas ni reglas especiales

## Nota

La refactorizacion frontend ya dejo trazabilidad tecnica comun para `health`, `content` y `pricing`, incluyendo `transportMode` en logs para distinguir `direct` vs `proxy`.
