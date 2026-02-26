# TODO - Backlog activo

## Leyenda de estado

- `[x]` tarea finalizada
- `[>]` tarea en proceso
- `[ ]` tarea pendiente

## Referencia

- Tareas finalizadas: `docs/todo.done.md`

## Estado

- [x] Bloques completados migrados a `docs/todo.done.md`.

## Backlog

## P1 (compatibilidad con Laravel)

- [ ] **Desacoplar frontend de detalles de transporte**
  - [ ] Centralizar fetch/reintentos/timeout/errores en un cliente HTTP de infraestructura.
  - [ ] Exponer solo repositorios/casos de uso hacia UI (sin endpoints hardcodeados en capas superiores).

- [ ] **Normalizar mapeo de datos**
  - [ ] Definir convención estable backend `snake_case` -> frontend `camelCase` mediante mappers.
  - [ ] Eliminar transformaciones ad-hoc dispersas en componentes/servicios.

- [ ] **Refactor backend por capas (alineado a Laravel)**
  - [ ] Mantener endpoints como adaptadores delgados HTTP.
  - [ ] Extraer reglas de negocio a servicios reutilizables.
  - [ ] Aislar serialización de respuesta en DTO/Resource equivalente.

- [ ] **Config, seguridad y operación**
  - [x] Unificar CORS por entorno (producción + desarrollo) en configuración central.
  - [x] Consolidar validación de entrada para `contact/mail` con reglas formales y respuestas homogéneas.
  - [ ] Revisar middleware transversal esperado en Laravel: rate limit, request-id, logging estructurado.
