# Plan Tecnico Prioritario

> Baseline operativo: `docs/dv-opsr-01.md`.
> Archivo de tareas completadas: `docs/todo.done.2026-02.md`.

## Backlog activo

### P0
- [>] (P0) Optimizar UI/UX secuencial por breakpoints (mobile-first real)
  - Contexto: optimizacion UX se ejecuta por etapas bloqueantes `XS -> SM -> MD -> LG` para evitar regresiones entre breakpoints.
  - Avance: `XS`, `SM` y `MD` completados; mejoras aplicadas en hero/nav, servicios/contacto y compactacion tipografica tablet.
  - Mitigacion interna ejecutada: ajuste de CSS budget en `MD` tras desvio puntual, recuperado a valores en verde.
  - Evidencia: `npm run test:e2e:smoke:xs|sm|md|lg` en verde (2026-02-17); `npm run quality:mobile` en verde (2026-02-17 00:43 -03:00); `npm run quality:merge` en verde (2026-02-17 00:45 -03:00); `npm run lint:todo-sync:merge-ready` en verde (2026-02-17 00:45 -03:00).
  - Bloqueador residual: ninguno interno.
  - Siguiente paso: ejecutar lote `LG` para jerarquia visual desktop y microajustes de conversion.
  - Siguiente accion interna ejecutable ahora: ajustar `src/styles/scss/sections/_hero.scss`, `src/styles/scss/sections/_services.scss` y `src/styles/scss/sections/_navbar.scss` con foco `>=992px`, luego validar `quality:responsive` (secuencial), `quality:mobile` y `quality:merge`.
  - Anexo tecnico: `docs/dv-uiux-01.md`.

- [>] (P0) Endurecer frontend a contrato backend-only para respuesta email en Chatwoot
  - Contexto: el frontend ya opera en modo backend-only para evitar falsos positivos de entrega email al usar canal API directo de Chatwoot.
  - Avance: cliente desacoplado de Chatwoot Public API; envio centralizado a endpoint backend de ingesta.
  - Decision tomada (C): resolucion funcional completa depende del backend productivo que garantice ruteo al inbox Email en Chatwoot.
  - Tipo C: C2
  - Bloqueador residual: falta URL canonica productiva del backend y evidencia de ruteo real por inbox Email.
  - Informacion faltante: `<backend_ingest_url_https>` + evidencia operativa (`SendReplyJob`/SMTP) asociada al inbox Email.
  - Mitigacion interna ejecutada: deploy gate endurecido para exigir `VITE_INQUIRY_API_URL` con esquema `https://`.
  - Evidencia: `npm run quality:merge` en verde (2026-02-17 00:20 -03:00); `npm run lint:todo-sync:merge-ready` en verde (2026-02-17 00:20 -03:00).
  - Tareas externas (solo C2 y acciones fuera del repo): desplegar/validar servicio backend (`upsert contact + ensure ContactInbox Email + create/reuse conversation Email`) y cargar secreto correcto en `GitHub Environment production`.
  - Siguiente paso: ejecutar smoke tecnico contra backend productivo al recibir URL canonica.
  - Siguiente accion interna ejecutable ahora: correr `npm run smoke:contact:backend -- <url>` y registrar evidencia en `docs/todo.md`.
  - Anexo tecnico: `docs/dv-chat-02.md`.
