# Plan Tecnico Prioritario

> Archivo de tareas completadas: `docs/todo.done.2026-02.md`.

## 1) Contexto y objetivo
El objetivo operativo es mantener un baseline estable para evolucionar UI/UX sin deuda critica y sin romper cumplimiento.
`docs/todo.md` queda como tablero vivo (solo estado actual + siguiente accion), mientras el historial detallado se archiva en `docs/todo.done.2026-02.md`.

## 2) Alcance
Incluye:
- Estabilizacion tecnica frontend en este repositorio (`src`, `scripts`, `docs`, `tests`).
- Correcciones de tipado TypeScript, guardrails de CSS/a11y, y flujo de consentimiento/analytics.
- Mejoras UI/UX incrementales orientadas a conversion y claridad sin romper baseline.

No incluye:
- Rediseno visual completo de marca.
- Implementacion backend completa fuera de la integracion necesaria desde frontend.
- Configuracion externa no versionada en este repositorio.

## 3) Prioridades
- `P0`: bloquea cambios grandes de UI/UX o expone riesgo alto.
- `P1`: reduce deuda relevante y riesgo de regresion.
- `P2`: optimizaciones no criticas para iniciar UI/UX.

## 4) Backlog activo

### P0
- [>] (P0) Definir y habilitar endpoint operativo de ingesta de consultas
  - Contexto: el secreto frontend ya fue eliminado; el pendiente critico actual es operativo/arquitectonico sobre `VITE_INQUIRY_API_URL`.
  - Accion: mantener frontend sin secretos y cerrar el contrato final de ingesta (URL operativa y canal Chatwoot compatible).
  - DoD (criterio de aceptacion): frontend sin `VITE_ORIGIN_VERIFY_SECRET`/`X-Origin-Verify`, endpoint de ingesta responde `POST 2xx`, y flujo de consulta queda validado end-to-end.
  - Avance: secreto y header sensible removidos del frontend; contrato de envio consolidado a `POST VITE_INQUIRY_API_URL` (frontend agnostico de proveedor).
  - Evidencia: `src/infrastructure/contact/contactApiGateway.ts`, `src/infrastructure/contact/backendContactChannel.ts`, `src/application/contact/contactBackendStatus.ts`, `src/infrastructure/config/viteConfig.ts`, `src/env.d.ts`, `.env.example`.
  - Evidencia: `docs/dv-02-chatwoot-contract.md` (contrato vigente `frontend -> backend`).
  - Evidencia: `scripts/check-origin-verify-leaks.mjs`, `scripts/check-client-secrets.mjs`, `package.json` (`lint:security` integrado a `quality:gate`).
  - Evidencia: `npm run test -- tests/unit/infrastructure/contactApiGateway.test.ts tests/unit/application/contactBackendStatus.test.ts tests/unit/application/submitContact.test.ts` en verde (2026-02-16 17:43 -03:00), `3 files / 11 tests`.
  - Evidencia: `npm run smoke:contact:backend -- https://chatwoot.datamaq.com.ar/public/api/v1/inboxes/QYovgpgLB6t8tQwLBzP5UXkD/contacts` (2026-02-16 17:35 -03:00) falla con `404 Not Found`.
  - Evidencia: documentacion oficial Chatwoot (consulta 2026-02-16) confirma `Create Contact` en Client API bajo ruta `/public/api/v1/inboxes/{inbox_identifier}/contacts` y alternativa Application API con `inbox_id` + `api_access_token` server-side.
  - Evidencia: `npm run lint:todo-sync` en verde (2026-02-16 17:36 -03:00).
  - Decision tomada (B): para evitar ruido de consola por `OPTIONS 404` en endpoints Chatwoot Public API se evaluo mantener probe `OPTIONS` universal vs omision selectiva por patron de URL; se elige omision selectiva para Chatwoot y probe `OPTIONS` para endpoints genericos.
  - Avance: `ContactBackendMonitor` ahora omite `OPTIONS` en rutas `.../public/api/v1/inboxes/{id}/contacts`, marca canal disponible y conserva probe para endpoint backend generico.
  - Evidencia: `src/application/contact/contactBackendStatus.ts` agrega deteccion `CHATWOOT_PUBLIC_CONTACTS_PATTERN` y short-circuit de probe.
  - Evidencia: `tests/unit/application/contactBackendStatus.test.ts` cubre ambos escenarios (Chatwoot sin `OPTIONS` y backend generico con `OPTIONS`).
  - Evidencia: `npm run test -- tests/unit/application/contactBackendStatus.test.ts` en verde (2026-02-16 18:33 -03:00), `1 file / 2 tests`.
  - Evidencia: `npm run typecheck` en verde (2026-02-16 18:33 -03:00).
  - Evidencia: `npm run lint:security` en verde (2026-02-16 18:33 -03:00).
  - Evidencia: `npm run lint:test-coverage` en verde (2026-02-16 18:33 -03:00), cobertura global `lines=81.40`, `statements=80.67`, `functions=82.90`, `branches=70.30`.
  - Evidencia: `npm run quality:merge` en verde (2026-02-16 18:33 -03:00), incluyendo `quality:gate` + `test:e2e:smoke`.
  - Decision tomada (B): ante evidencia de campo (se crea contacto pero no conversacion), se evaluo mantener submit backend-only de un `POST` vs reactivar ruta especifica Chatwoot Public API para `contact -> conversation -> message`; se elige reactivar flujo de 3 pasos para cumplir visibilidad operativa en Conversations.
  - Avance: `ContactApiGateway` enruta por patron de URL; para Chatwoot Public API ejecuta `create-contact`, `create-conversation` y `create-message`; para endpoint generico mantiene `POST` unico.
  - Evidencia: `src/infrastructure/contact/contactApiGateway.ts` reintroduce selector `isChatwootPublicContactsEndpoint(...)` y llamada `submitChatwootPublicContact(...)`.
  - Evidencia: `tests/unit/infrastructure/contactApiGateway.test.ts` agrega caso de flujo Chatwoot con 3 `POST` y verificacion de endpoints encadenados.
  - Evidencia: `npm run test -- tests/unit/infrastructure/contactApiGateway.test.ts tests/unit/application/contactBackendStatus.test.ts` en verde (2026-02-16 18:37 -03:00), `2 files / 7 tests`.
  - Evidencia: `npm run typecheck` en verde (2026-02-16 18:37 -03:00).
  - Evidencia: `npm run lint:security` en verde (2026-02-16 18:37 -03:00).
  - Evidencia: `npm run lint:test-coverage` en verde (2026-02-16 18:37 -03:00), cobertura global `lines=81.41`, `statements=80.70`, `functions=83.47`, `branches=69.76`.
  - Evidencia: `npm run quality:merge` en verde (2026-02-16 18:38 -03:00), incluyendo `quality:gate` + `test:e2e:smoke`.
  - Decision tomada (A): se confirma estrategia de producto `formulario custom + endpoint operativo de ingesta` (se descarta migracion a widget).
  - Evidencia: decision de usuario registrada en este turno (2026-02-16 18:22 -03:00): mantener formulario custom con endpoint operativo.
  - Evidencia: `npm run smoke:contact:backend -- https://chatwoot.datamaq.com.ar/public/api/v1/inboxes/QYovgpgLB6t8tQwLBzP5UXkD/contacts` (2026-02-16 18:22 -03:00) falla con `404 Not Found`.
  - Decision tomada (C): queda bloqueo operativo externo hasta que el endpoint de ingesta del formulario responda `POST` exitoso.
  - Tipo C: C2.
  - Bloqueador residual: `VITE_INQUIRY_API_URL` actual responde `404`, impidiendo validacion end-to-end del formulario custom.
  - Informacion faltante: URL/ruta operativa final para `VITE_INQUIRY_API_URL` y responsable externo de su publicacion/operacion.
  - Mitigacion interna ejecutada: cierre de definicion de arquitectura (sin C1), smoke tecnico reintentado y frontend mantenido desacoplado/seguro.
  - Tareas externas (solo C2 y acciones fuera del repo): publicar/corregir endpoint operativo de ingesta para el formulario custom y compartir URL final verificable.
  - Siguiente paso: al recibir URL operativa externa, ejecutar smoke y registrar evidencia de `2xx`.
  - Siguiente accion interna ejecutable ahora: correr `npm run smoke:contact:backend -- <INQUIRY_API_URL_OPERATIVA>` apenas se confirme la URL final.

### P2
