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

- [x] Hardening backend PHP posterior a auditoria (ciberseguridad + arquitectura + SOLID) completado en este ciclo.

## P0 (migracion de endpoints sin `.php`)

- [x] **Plan de deprecacion controlada**
  - Estado: retiro de endpoints legacy `*.php` completado.
  - Estado final: endpoints canónicos exclusivos en `/api/v1/...`.

## P0 (seguridad y operacion)

- [x] **Corregir exposicion de codigo fuente PHP en entorno dev/proxy**
  - Estado: resuelto via proxy unificado `/api` en Vite y migracion a endpoints canónicos `/api/v1/*`.

- [x] **Agregar rate limit basico por IP/request-id en `contact.php`, `mail.php`, `quote/diagnostic.php`**
  - Estado: implementado (ventana fija en archivo temporal + respuesta `429` y header `Retry-After`).

## P1 (arquitectura limpia, SOLID, mantenibilidad)

- [x] **Separar contenido de `content.php` en proveedor/repositorio dedicado**
  - Estado: `dmq_build_app_content` movido a `public/api/content_provider.php`; endpoint queda como adaptador HTTP.

## P2 (calidad de dominio y contratos)

- [x] **Agregar rate limit tests de contrato (429)**
  - Estado: agregado test de contrato para `contact` con validación de `429` + `Retry-After`.

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
