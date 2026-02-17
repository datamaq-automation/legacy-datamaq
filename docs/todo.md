# Plan Tecnico Prioritario

> Baseline operativo: `docs/dv-opsr-01.md`.
> Archivo de tareas completadas: `docs/todo.done.2026-02.md`.

## Backlog activo

### P0
- [>] (P0) Endurecer frontend a contrato backend-only para respuesta email en Chatwoot
  - Contexto: el frontend ya opera en modo backend-only para evitar falsos positivos de entrega email al usar canal API directo de Chatwoot.
  - Avance: cliente desacoplado de Chatwoot Public API; envio centralizado a endpoint backend de ingesta.
  - Decision tomada (C): resolucion funcional completa depende del backend productivo que garantice ruteo al inbox Email en Chatwoot.
  - Tipo C: C2
  - Bloqueador residual: falta URL canonica productiva del backend y evidencia de ruteo real por inbox Email.
  - Informacion faltante: `<backend_ingest_url_https>` + evidencia operativa (`SendReplyJob`/SMTP) asociada al inbox Email.
  - Mitigacion interna ejecutada: deploy gate endurecido para exigir `VITE_INQUIRY_API_URL` con esquema `https://`; calidad CSS/scaffolding consolidada en turno 2026-02-17 (sin impacto en frontend funcional de contacto).
  - Evidencia:
    - Baseline turno anterior: `npm run quality:merge` en verde (2026-02-17 00:20 -03:00)
    - Validacion turno actual: `npm run quality:merge` en verde (2026-02-17 14:00 -03:00; no hay cambios en frontend contacto, consolidacion de CSS/!important)
    - `npm run lint:security` en verde (2026-02-17 14:01 -03:00)
  - Tareas externas (solo C2 y acciones fuera del repo): desplegar/validar servicio backend (`upsert contact + ensure ContactInbox Email + create/reuse conversation Email`) y cargar secreto correcto en `GitHub Environment production`.
  - Siguiente paso: ejecutar smoke tecnico contra backend productivo al recibir URL canonica.
  - Siguiente accion interna ejecutable ahora: condicionada a dato externo (backend_ingest_url_https disponible); ejecutar `npm run smoke:contact:backend -- <url>` y registrar evidencia en `docs/todo.md`.
  - Anexo tecnico: `docs/dv-chat-02.md`.
