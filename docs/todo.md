# TODO - Backlog activo

## Leyenda de estado

- `[x]` tarea finalizada
- `[>]` tarea en proceso
- `[ ]` tarea pendiente

## Referencia

- Tareas finalizadas: `docs/todo.done.md`

## Estado

- [x] Bloque `hero.title` dinamico desde backend PHP implementado y validado.

## P0 (contenido dinamico minimo)

- [x] **Obtener `hero.title` desde `GET /api/content.php` con fallback local**
  - [x] Decision tomada: endpoint dedicado `GET /api/content.php` (no anexar a `pricing.php`).
  - [x] Crear `public/api/content.php` con contrato JSON y errores estandarizados (`request_id`, `error_code`, `detail`).
  - [x] Definir payload minimo versionado (ej: `data.hero.title`) y mantener compatibilidad hacia adelante.
  - [x] Incorporar `contentApiUrl` en configuracion runtime (`runtimeProfiles.json` + `viteConfig`).
  - [x] Implementar servicio de sync de contenido separado de pricing (SRP) en infraestructura frontend.
  - [x] Actualizar `ContentRepository` para aplicar parche reactivo solo en campos soportados (`hero.title`).
  - [x] Mantener fallback deterministico al valor local de `landingContentBuilder.ts` si backend falla.
  - [x] Agregar tests unitarios frontend (config + sync + fallback).
  - [x] Agregar tests de contrato PHP para `GET /api/content.php`.

## P0 (backend como fuente unica de contenido)

- [>] **Eliminar hardcode de contenido en frontend (`landingContentBuilder.ts`)**
  - [x] Frontend preparado para aplicar snapshot completo remoto (`data`) cuando el backend lo provee.
  - [x] Compatibilidad temporal: fallback por `hero.title` para contratos parciales.
  - [ ] Definir contrato final completo de `GET /api/content.php` por target (`datamaq`, `upp`, `example`) con `AppContent` completo.
  - [ ] Implementar payload completo en PHP por marca/target.
  - [ ] Retirar contenido textual hardcodeado de `landingContentBuilder.ts` y dejar fallback tecnico minimo.
