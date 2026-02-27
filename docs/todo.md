# TODO - Backlog activo

## Estado

- Este archivo contiene solo tareas pendientes o en curso.
- Historial de tareas cerradas: `docs/todo.done.md`.

## P1 (arquitectura y contratos)

- [ ] Definir puertos/interfaces explicitos entre capas y reforzar reglas de dependencia.
- [ ] Formalizar DTOs request/response por endpoint (`contact`, `mail`, `quote/diagnostic`, `quote/pdf`).
- [ ] Reducir dependencias implicitas globales de runtime HTTP.

## P1 (`/api/v1/content`)

- [ ] Separar construccion de contenido por responsabilidades (`hero`, `services`, `about`, `contact`, `decisionFlow`, `thanks`).
- [ ] Formalizar contrato de salida con validacion de shape server-side.
- [ ] Alinear flujo a clean architecture con puertos explicitos.

## P2 (`/api/v1/content`)

- [ ] Agregar observabilidad basica para errores 5xx y contrato invalido.
- [ ] Aumentar cobertura de contrato por marca (`datamaq`, `upp`, `example`).
- [ ] Diferenciar en cliente estado "no disponible" vs "degradado".

## P1 (`/api/v1/contact` + Chatwoot)

- [ ] Cubrir en tests errores de integracion (`401/403`, timeout/network) y reintentos controlados.
