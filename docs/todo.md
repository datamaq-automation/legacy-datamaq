# Plan Tecnico Prioritario

> Baseline operativo: `docs/dv-00-operating-baseline.md`.
> Archivo de tareas completadas: `docs/todo.done.2026-02.md`.

## Backlog activo

### P0
- [>] (P0) Endurecer frontend a contrato backend-only para respuesta email en Chatwoot
  - Contexto: evidencia operativa de produccion confirma que el flujo iniciado en `Channel::Api` no garantiza salida SMTP como `Channel::Email`; para respuesta por email confiable el frontend debe integrarse a backend propio que asegure vinculacion al inbox email.
  - Decision tomada (B-Arquitectura): se evaluo mantener compatibilidad directa con endpoint publico Chatwoot vs forzar contrato backend-only en cliente; se elige backend-only para reducir acoplamiento al canal API y evitar falsos positivos de entrega por correo.
  - Avance: `ContactApiGateway` consolidado a `submitBackendContact` (POST unico), sin ramificacion especial por patron Chatwoot Public API.
  - Evidencia: `src/infrastructure/contact/contactApiGateway.ts`.
  - Avance: `ContactBackendMonitor` vuelve a probe generico por `OPTIONS` para cualquier `inquiryApiUrl`, sin bypass Chatwoot.
  - Evidencia: `src/application/contact/contactBackendStatus.ts`.
  - Decision tomada (B-Deploy): se evalua mantener probe `OPTIONS` universal vs omitirlo en endpoint Chatwoot Public (que devuelve `404` esperado y ensucia consola); se elige omitir probe para ese patron para reducir ruido operativo sin afectar estado funcional del canal.
  - Avance: restaurado short-circuit de disponibilidad en `ContactBackendMonitor` cuando `inquiryApiUrl` coincide con `/public/api/v1/inboxes/{id}/contacts`.
  - Evidencia: `src/application/contact/contactBackendStatus.ts`, `tests/unit/application/contactBackendStatus.test.ts`.
  - Decision tomada (B-Vue): se evalua montar CTA flotante de WhatsApp solo en `HomePage` vs en todas las vistas shell; se elige montarlo en `HomePage`, `MedicionConsumoEscobar` y `ThanksView` para persistencia transversal sin introducir un layout nuevo.
  - Avance: agregado componente `WhatsAppFab` reutilizando el href centralizado de WhatsApp y handler compartido `openWhatsApp`.
  - Evidencia: `src/ui/features/contact/WhatsAppFab.vue`, `src/ui/controllers/contactController.ts`.
  - Avance: FAB montado en vistas shell y estilado con offset dinamico cuando `body.has-consent-banner` esta activo para evitar solape con banner de consentimiento.
  - Evidencia: `src/ui/pages/HomePage.vue`, `src/ui/pages/MedicionConsumoEscobar.vue`, `src/ui/views/ThanksView.vue`, `src/styles/scss/sections/_whatsapp-fab.scss`, `src/styles/main.scss`.
  - Avance: cobertura automatica agregada para FAB (unit + e2e smoke responsive/no-solape).
  - Evidencia: `tests/unit/ui/whatsappFab.test.ts`, `tests/e2e/smoke.spec.ts`.
  - Mitigacion interna ejecutada: `quality:merge` detecto solape FAB/banner en mobile (assert E2E `fabRect.bottom <= bannerRect.top`); se ajusto offset del FAB en estado `body.has-consent-banner` hasta eliminar interseccion.
  - Evidencia: `src/styles/scss/sections/_whatsapp-fab.scss` (offset con `max(..., 13rem) + 0.75rem`).
  - Evidencia: `npm run typecheck` en verde (2026-02-16 20:45 -03:00).
  - Evidencia: `npm run lint:security` en verde (2026-02-16 20:45 -03:00).
  - Evidencia: `npm run lint:test-coverage` en verde (2026-02-16 20:47 -03:00), cobertura global `lines=81.12`, `statements=80.40`, `functions=82.97`, `branches=69.92`.
  - Evidencia: `npm run quality:merge` en verde (2026-02-16 20:54 -03:00), incluye `quality:gate` + `test:e2e:smoke` (`8 passed`) con validacion del FAB.
  - Evidencia: `npm run typecheck` en verde (2026-02-16 20:39 -03:00).
  - Evidencia: `npm run lint:security` en verde (2026-02-16 20:39 -03:00).
  - Evidencia: `npm run lint:test-coverage` en verde (2026-02-16 20:40 -03:00), cobertura global `lines=81.07`, `statements=80.33`, `functions=82.83`, `branches=69.95`.
  - Evidencia: `npm run quality:merge` en verde (2026-02-16 20:42 -03:00), incluye `quality:gate` + `test:e2e:smoke` (`8 passed`).
  - Avance: tests unitarios alineados al contrato backend-only.
  - Evidencia: `tests/unit/infrastructure/contactApiGateway.test.ts`, `tests/unit/application/contactBackendStatus.test.ts`.
  - Mitigacion interna ejecutada: primer `npm run lint:test-coverage` fallo por asercion incompleta en `tests/unit/infrastructure/contactApiGateway.test.ts` (firma de `postJson`); se ajusto expectativa incluyendo tercer argumento `undefined` y se revalido en verde.
  - Evidencia: `npm run typecheck` en verde (2026-02-16 20:31 -03:00).
  - Evidencia: `npm run lint:security` en verde (2026-02-16 20:31 -03:00).
  - Evidencia: `npm run lint:test-coverage` en verde (2026-02-16 20:34 -03:00), cobertura global `lines=80.95`, `statements=80.21`, `functions=82.75`, `branches=70.40`.
  - Evidencia: `npm run quality:merge` en verde (2026-02-16 20:36 -03:00), incluye `quality:gate` + `test:e2e:smoke` (`8 passed`).
  - Evidencia: `npm run lint:todo-sync:merge-ready` en verde (2026-02-16 20:36 -03:00).
  - Decision tomada (C): resolucion funcional completa depende de servicio backend externo que ejecute `upsert contact + ensure ContactInbox Email + create/reuse conversation Email`.
  - Tipo C: C2
  - Bloqueador residual: falta despliegue/operacion del endpoint backend productivo que implemente el ruteo email en Chatwoot.
  - Informacion faltante: URL canonica del backend de ingesta en produccion y evidencia de que aplica vinculacion a inbox Email (no solo API).
  - Mitigacion interna ejecutada: frontend desacoplado del flujo Chatwoot Public API para evitar que el cliente modele conversaciones API como si fueran email-ready.
  - Tareas externas (solo C2 y acciones fuera del repo): implementar/validar `ensure_email_routable_contact` en backend, configurar `email_inbox_id` y `api_inbox_id` por entorno, y verificar trazas `SendReplyJob` + Exim.
  - Siguiente paso: correr bateria completa de calidad y registrar evidencia de merge local para este endurecimiento.
  - Siguiente accion interna ejecutable ahora: ejecutar `npm run typecheck`, `npm run lint:security`, `npm run lint:test-coverage`, `npm run quality:merge` y `npm run lint:todo-sync:merge-ready`.
