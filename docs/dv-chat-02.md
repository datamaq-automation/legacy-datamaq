# DV-05 - Frontend backend-only para respuesta email en Chatwoot

## Objetivo
Documentar el detalle tecnico e historial de decisiones del item P0 "Endurecer frontend a contrato backend-only para respuesta email en Chatwoot", manteniendo `docs/todo.md` con solo estado operativo minimo.

## Resumen ejecutivo
- El frontend ya no debe depender del endpoint publico de Chatwoot para modelar entrega por email.
- El envio se centraliza en backend propio para garantizar vinculacion al inbox de email antes de abrir/reusar conversacion.
- El cierre completo sigue bloqueado por operacion externa (backend productivo + evidencia SMTP/SendReplyJob).

## Decisiones tecnicas clave
- `B-Arquitectura`: forzar contrato backend-only en cliente para reducir acoplamiento al canal API y evitar falsos positivos de entrega email.
- `B-Deploy`: endurecer validacion de `VITE_INQUIRY_API_URL` en pipeline para fallar si no inicia con `https://`.
- `C2`: el resultado funcional final depende de despliegue y validacion fuera del repo.

## Evidencia interna relevante
- Cliente desacoplado del patron Chatwoot Public API:
  - `src/infrastructure/contact/contactApiGateway.ts`
  - `src/application/contact/contactBackendStatus.ts`
  - `tests/unit/application/contactBackendStatus.test.ts`
- Validaciones locales historicas en verde:
  - `npm run lint:security` (2026-02-16 20:31 -03:00)
  - `npm run lint:test-coverage` (2026-02-16 20:34 -03:00)
  - `npm run quality:merge` (2026-02-16 20:36 -03:00)
  - `npm run lint:todo-sync:merge-ready` (2026-02-16 20:36 -03:00)
  - `npm run typecheck` (2026-02-17 00:15 -03:00)
  - `npm run quality:merge` (2026-02-17 00:20 -03:00)
  - `npm run lint:todo-sync:merge-ready` (2026-02-17 00:20 -03:00)

## Bloqueador externo vigente (C2)
- Dato faltante: URL canonica HTTPS del backend de ingesta productivo.
- Verificacion faltante: evidencia de ruteo real a inbox Email (trazas `SendReplyJob` + salida SMTP/Exim).

## Proximo chequeo tecnico al destrabarse C2
- Ejecutar: `npm run smoke:contact:backend -- <url>`
- Registrar en `docs/todo.md`: request/response del smoke + referencia de trazas operativas del backend.
