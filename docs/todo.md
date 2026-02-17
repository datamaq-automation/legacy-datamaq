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
  - Evidencia: `src/application/contact/contactBackendStatus.ts`.
  - Decision tomada (B-Deploy): se evalua mantener probe `OPTIONS` universal vs omitirlo en endpoint Chatwoot Public (que devuelve `404` esperado y ensucia consola); se elige omitir probe para ese patron para reducir ruido operativo sin afectar estado funcional del canal.
  - Evidencia: `src/application/contact/contactBackendStatus.ts`, `tests/unit/application/contactBackendStatus.test.ts`.
  - Decision tomada (B-Vue): se evalua montar CTA flotante de WhatsApp solo en `HomePage` vs en todas las vistas shell; se elige montarlo en `HomePage`, `MedicionConsumoEscobar` y `ThanksView` para persistencia transversal sin introducir un layout nuevo.
  - Decision tomada (B-Deploy): se evalua configurar `VITE_INQUIRY_API_URL` solo en entorno local de build vs endurecer CI/CD para exigirlo en `deploy-production`; se elige validacion explicita + inyeccion por `environment` secret para evitar builds productivos con `inquiryApiUrl: null`.
  - Mitigacion interna ejecutada: incidente productivo detectado con `VITE_INQUIRY_API_URL` cargada como identificador (`9BkS1a5AsmAtFy7FjwujYcra`) en vez de URL HTTPS; se endurecio el gate de deploy para fallar si el secreto no comienza con `https://`.
  - Decision tomada (B-Vue): se evalua mantener navbar mobile como overlay absoluto vs volver a flujo push-down; se elige push-down con panel solido y scroll interno para evitar superposicion con hero/cards.
  - Decision tomada (B): se evalua mantener mensajes WhatsApp por servicio vs unificar mensaje comercial solicitado; se elige unificar para asegurar consistencia con la instruccion de negocio actual.
  - Decision tomada (B-Vue): se evalua seguir con collapse mobile custom vs migrar a `Offcanvas` nativo de Bootstrap; se elige `Offcanvas` para obtener backdrop + scroll-lock robusto y cierre consistente por `data-bs-dismiss`.
  - Decision tomada (B-Vue): se evalua mantener offcanvas dentro del header vs moverlo a `body`; se elige `Teleport to="body"` para evitar stacking/scroll bugs por contenedores padre y asegurar backdrop + lock consistentes en mobile.
  - Decision tomada (B-Vue): se evalua mantener cierre manual del offcanvas (DOM + clases) vs delegar en Bootstrap `data-bs-dismiss`; se elige delegar en Bootstrap para evitar desincronizacion de estado (menu que abre al segundo click).
  - Decision tomada (B-Testing): se evalua exigir chequeos mobile-first solo por documentacion vs agregar un runner dedicado reutilizando comandos existentes; se elige runner dedicado para reducir omisiones operativas sin introducir dependencias.
  - Decision tomada (B-Testing): se evalua mantener `quality:mobile` desacoplado de `quality:merge` vs integrarlo como segundo paso de merge; se elige integrarlo para evitar omisiones y alinear validacion mobile-first en cierre de turno.
  - Decision tomada (B-Vue): se evalua conservar estado implicito del toggler offcanvas vs sincronizar `aria-expanded` con estado real de apertura; se elige sincronizar para mejorar navegacion asistiva y evitar ambiguedad en mobile.
  - Decision tomada (B-Vue): se evalua recortar subtitulo hero con line-clamp estricto vs mantener texto completo con tipografia/espaciado optimizados en XS; se elige texto completo para legibilidad sin sacrificar fold.
  - Decision tomada (B-Testing): se evalua mantener validacion responsive en un smoke unico vs introducir etapas bloqueantes por viewport; se elige etapas bloqueantes para forzar progresion `XS -> SM -> MD -> LG` sin saltos.
  - Avance: contrato operativo actualizado para exigir validacion secuencial por etapas responsive y bloqueo de avance entre breakpoints.
  - Avance: compactado ruido operativo del tablero activo para mantener `docs/todo.md` enfocado en estado vigente y mover historial repetitivo al archivo mensual.
  - Evidencia: `npm run todo:compact:noise` en verde (2026-02-17 00:14 -03:00), `145 lineas movidas` a `docs/todo.done.2026-02.md`.
  - Avance: guia de inicio para Codex optimizada con prompt operativo reforzado (secuencia responsive `XS -> SM -> MD -> LG`, criterios anti-ruido y cierre merge-ready).
  - Evidencia: `docs/codex-usage.md`.
  - Avance: tests unitarios alineados al contrato backend-only.
  - Mitigacion interna ejecutada: primer `npm run lint:test-coverage` fallo por asercion incompleta en `tests/unit/infrastructure/contactApiGateway.test.ts` (firma de `postJson`); se ajusto expectativa incluyendo tercer argumento `undefined` y se revalido en verde.
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
  - Tareas externas (solo C2 y acciones fuera del repo): cargar secreto `VITE_INQUIRY_API_URL` en `GitHub > Settings > Environments > production` para que el nuevo gate de deploy pueda construir con endpoint real.
  - Siguiente paso: correr bateria completa de calidad y registrar evidencia de merge local para este endurecimiento.
  - Siguiente accion interna ejecutable ahora: ejecutar `npm run typecheck`, `npm run lint:security`, `npm run lint:test-coverage`, `npm run quality:merge` y `npm run lint:todo-sync:merge-ready`.
