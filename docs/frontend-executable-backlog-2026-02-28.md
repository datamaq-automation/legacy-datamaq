# Backlog Tecnico Frontend Ejecutable

Fecha: 2026-02-28

## Objetivo

Cerrar la capa de integracion frontend con Laravel bajo una politica unica:

- backend canonico: `/v1/*`
- frontend en `dev` y `e2e`: `/api/v1/*` via proxy
- observabilidad tecnica consistente para `health`, `content`, `pricing` y demas endpoints publicos

## Sprint 1

### 1. Resolver compartido para todos los endpoints backend

Alcance:

- llevar `content`, `pricing`, `contact`, `mail` y `quote` al mismo criterio de resolucion que ya se usa para `health`
- evitar decisiones de transporte repartidas entre servicios

Criterio de cierre:

- todos los servicios remotos de frontend obtienen `browserUrl`, `pathname` y `transportMode` desde infraestructura compartida

### 2. Cobertura unitaria del transporte por perfil

Alcance:

- agregar pruebas para `integration`
- agregar pruebas para `e2e`
- cubrir origenes `localhost:5173` y `127.0.0.1:4173`

Criterio de cierre:

- ningun endpoint publico de frontend queda sin test sobre su modo `proxy/direct`

### 3. Blindaje contra regresion de endpoints directos en `integration`

Alcance:

- reforzar pruebas del perfil runtime
- detectar rapido si reaparece una URL absoluta en `integration` o `e2e`

Criterio de cierre:

- si alguien vuelve a poner `http://127.0.0.1:8899/...` en `integration`, la suite falla

## Sprint 2

### 4. Terminar de consolidar el helper comun de diagnostico

Alcance:

- mantener el mismo shape de `console.info()` para todos los endpoints backend
- evitar payloads armados a mano por servicio

Criterio de cierre:

- `health`, `content`, `pricing` y los nuevos consumidores usan un helper unico de infraestructura

### 5. Evaluar campo `upstreamEndpoint` solo para desarrollo

Alcance:

- estudiar si conviene mostrar en dev el destino real esperado del proxy
- no exponerlo en produccion

Criterio de cierre:

- decision documentada y, si aplica, implementacion testeada

## Sprint 3

### 6. Definir estrategia final de logging tecnico

Opciones a resolver:

- mantener helper de diagnostico con `console.info()` en desarrollo
- extender `LoggerPort` con `info(...)`
- postergar un `DiagnosticsPort` hasta que haya una necesidad real distinta

Criterio de cierre:

- decision documentada y aplicada sin degradar DX ni producir ruido inesperado en tests

### 7. Documentacion operativa final

Alcance:

- documentar contrato de desarrollo
- documentar contrato canonico backend
- documentar politica de logs de frontend

Criterio de cierre:

- onboarding tecnico claro para dev, build, preview y E2E

## Dependencias Externas

- Backend ya confirmo:
  - `/v1/*` como contrato canonico
  - CORS local corregido para origenes de desarrollo

- Backend recomendado:
  - mantener metadatos JSON consistentes cuando aplique:
    - `status`
    - `request_id`
    - `version`
    - `brand_id`
    - `timestamp`

## No Hacer

- No volver a mezclar `direct` y `proxy` en `integration`.
- No mover `dev` a URLs absolutas al backend como regla general.
- No exponer host, query o detalles sensibles en `warn/error` de produccion.
