# Listado de Tareas

Fecha de actualizacion: 2026-02-28

## Prioridad Alta

- Extender el uso del resolver compartido de endpoints backend a diagnostico y gateways que todavia no consumen contexto comun.
  `ViteConfig` ya resuelve `inquiry`, `mail`, `pricing`, `content`, `quoteDiagnostic` y `quotePdf` desde un helper compartido, pero todavia quedan consumidores con normalizacion local.

- Mantener `integration` y `e2e` con politica unica `proxy + /api/v1/*`.
  No deben reintroducirse endpoints directos en esos perfiles salvo excepcion documentada y testeada.

- Agregar tests de regresion del resolver compartido para todos los endpoints publicos.
  Deben cubrir `localhost:5173`, `127.0.0.1:4173`, endpoints relativos y endpoints absolutos.

## Prioridad Media

- Consolidar el helper comun de diagnostico backend como API unica para `console.info()` de integracion.
  Debe seguir manteniendo un shape estable con `resource`, `endpoint`, `pathname`, `transportMode`, `status`, metadatos comunes y `details`.

- Revisar si conviene agregar tambien `upstreamEndpoint` al diagnostico de desarrollo.
  El objetivo es poder ver, cuando el transporte es `proxy`, tanto la URL del navegador como el destino real esperado de Laravel sin romper la politica de no exponer informacion sensible en produccion.

- Estandarizar el contrato de metadatos backend consumidos por frontend.
  El shape objetivo para respuestas JSON, cuando aplique, es:
  - `status`
  - `request_id`
  - `version`
  - `brand_id`
  - `timestamp`

## Prioridad Baja

- Definir la estrategia final para logs tecnicos de desarrollo.
  Evaluar si `console.info()` de integracion debe seguir como helper de infraestructura o migrar a `LoggerPort.info(...)` cuando exista una implementacion real de logger en desarrollo.

- Documentar la convencion definitiva de transporte por entorno.
  Debe quedar explicito:
  - backend canonico: `/v1/*`
  - frontend dev/e2e: `/api/v1/*` via proxy
  - produccion: endpoint canonico configurado por perfil

- Si negocio pide operacion real en bandeja de Chatwoot desde el formulario, alinear con backend una segunda fase de:
  - deduplicacion
  - `identifier` canonico
  - politica de conversaciones por submit
  - creacion de `conversation` y `message`

## Hecho

- `ViteConfig` ya resuelve endpoints backend desde un helper compartido en `src/infrastructure/backend/backendConfigEndpoint.ts`.
- `integration` y `e2e` ya tienen blindaje por tests para mantener `health`, `content`, `pricing`, `contact`, `mail` y `quote` detras de `/api/v1/*`.
- `integration` ya no mezcla `direct` y `proxy` entre `health`, `content` y `pricing`.
- `console.info()` de `health`, `content` y `pricing` ya comparte un contrato base comun.
- `warn/error` ya salen sanitizados para no exponer host, query ni contexto sensible en produccion.
- CORS local para pruebas directas contra Laravel fue corregido por backend.
- Backend confirmo que `POST /v1/contact` ya integra internamente con Chatwoot Account API sin cambiar el contrato frontend y que la fase actual es solo captura de contacto.
