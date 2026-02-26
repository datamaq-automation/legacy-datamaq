# TODO - Backlog activo

## Leyenda de estado

- `[x]` tarea finalizada
- `[>]` tarea en proceso
- `[ ]` tarea pendiente

## Referencia

- Tareas finalizadas: `docs/todo.done.md`

## Estado

- [>] Nuevo bloque activo: `hero.title` dinamico desde backend PHP.

## P0 (contenido dinamico minimo)

- [>] **Obtener `hero.title` desde `GET /api/content.php` con fallback local**
  - [x] Decision tomada: endpoint dedicado `GET /api/content.php` (no anexar a `pricing.php`).
  - [ ] Crear `public/api/content.php` con contrato JSON y errores estandarizados (`request_id`, `error_code`, `detail`).
  - [ ] Definir payload minimo versionado (ej: `data.hero.title`) y mantener compatibilidad hacia adelante.
  - [ ] Incorporar `contentApiUrl` en configuracion runtime (`runtimeProfiles.json` + `viteConfig`).
  - [ ] Implementar servicio de sync de contenido separado de pricing (SRP) en infraestructura frontend.
  - [ ] Actualizar `ContentRepository` para aplicar parche reactivo solo en campos soportados (`hero.title`).
  - [ ] Mantener fallback deterministico al valor local de `landingContentBuilder.ts` si backend falla.
  - [ ] Agregar tests unitarios frontend (config + sync + fallback).
  - [ ] Agregar tests de contrato PHP para `GET /api/content.php`.
