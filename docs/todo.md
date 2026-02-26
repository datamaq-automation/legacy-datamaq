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

- [x] Sin pendientes abiertos en este ciclo.

## P0 (backend como fuente unica de textos UI)

- [x] **Extender contrato de contenido remoto para cubrir textos de toda la UI**
  - [x] Alcance confirmado: incluir tambien textos de `ThanksView` y `DecisionFlowSection`.
  - [x] Estado actual confirmado: `AppContent` principal ya viene desde `GET /api/content.php` (v2) con fallback tecnico minimo.
  - [x] Definir contrato extendido para bloques UI adicionales (ej: `thanks`, `decisionFlow`) por target.
  - [x] Implementar payload extendido en `public/api/content.php` para `datamaq`, `upp`, `example`.
  - [x] Adaptar `src/ui/views/ThanksView.vue` para consumir textos desde repositorio/contenido remoto.
  - [x] Adaptar `src/ui/sections/DecisionFlowSection.vue` para consumir pasos y copy desde repositorio/contenido remoto.
  - [x] Eliminar hardcodes residuales de textos en esas vistas/sections.
  - [x] Agregar tests unitarios de contrato/consumo para `thanks` y `decisionFlow`.
