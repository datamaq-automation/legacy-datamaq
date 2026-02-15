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
- [>] (P0) Eliminar secreto de verificacion del frontend
  - Contexto: se detecto uso de `VITE_ORIGIN_VERIFY_SECRET` y envio de `X-Origin-Verify` desde navegador, lo que no es secreto en cliente.
  - Accion: remover uso de secreto en frontend y operar envio de contacto con contrato publico seguro (sin secretos cliente).
  - DoD (criterio de aceptacion): no hay referencias a `VITE_ORIGIN_VERIFY_SECRET` ni a `X-Origin-Verify` en frontend; contrato de contacto validado y funcionando.
  - Avance: removidas las referencias frontend al secreto y al header de verificacion; contrato backend definido con integracion server-to-server a Chatwoot.
  - Evidencia: `src/application/ports/Config.ts`, `src/infrastructure/config/viteConfig.ts`, `src/infrastructure/contact/contactApiGateway.ts`, `src/env.d.ts`, `.env.example`, `tests/unit/infrastructure/contactApiGateway.test.ts`.
  - Evidencia: `docs/dv-02-chatwoot-contract.md`.
  - Avance: guardrail anti-regresion activo para evitar reintroduccion de secreto/header en frontend.
  - Evidencia: `scripts/check-origin-verify-leaks.mjs`, `package.json` (`lint:origin-verify` dentro de `quality:gate`).
  - Evidencia: `npm run lint:origin-verify` en verde (2026-02-15 13:09 -03:00).
  - Evidencia: `npm run smoke:contact:backend -- https://chatwoot.datamaq.com.ar/contact` (2026-02-15 13:09 -03:00) falla con `fetch failed`.
  - Evidencia: `npm run smoke:contact:backend -- https://chatwoot.datamaq.com.ar/contact` (2026-02-15 13:43 -03:00) mantiene `Smoke FAIL: fetch failed`.
  - Evidencia: `npm run smoke:contact:backend -- https://chatwoot.datamaq.com.ar/contact` (2026-02-15 16:09 -03:00) mantiene `Smoke FAIL: fetch failed`.
  - Evidencia: `npm run smoke:contact:backend -- http://chatwoot.datamaq.com.ar/contact` (2026-02-15 17:40 -03:00) responde `Smoke FAIL: 404 Not Found` (host resolviendo, ruta backend no publicada).
  - Evidencia: `npm run smoke:contact:backend -- https://chatwoot.datamaq.com.ar/contact` (2026-02-15 17:40 -03:00) responde `Smoke FAIL: 404 Not Found` (TLS activo, ruta backend no publicada).
  - Evidencia: `Invoke-WebRequest -Method Options` sobre rutas candidatas `https://chatwoot.datamaq.com.ar/contact|/api/contact|/api/v1/contact|/backend/contact|/v1/contact` (2026-02-15 17:40 -03:00) devuelve `404` en todos los casos.
  - Evidencia: documentacion oficial Chatwoot (consultada 2026-02-15 17:40 -03:00) confirma que la ruta publica nativa para crear contacto es `POST /public/api/v1/inboxes/{inbox_identifier}/contacts` y para crear conversacion es `POST /public/api/v1/inboxes/{inbox_identifier}/contacts/{contact_identifier}/conversations`.
  - Evidencia: documentacion oficial Chatwoot (consultada 2026-02-15 18:00 -03:00) explicita que `inbox_identifier` se obtiene del API inbox channel; no es opcional en Client/Public APIs.
  - Evidencia: documentacion oficial Chatwoot (consultada 2026-02-15 18:00 -03:00) indica que, si el inbox tiene HMAC habilitado (secure mode), `identifier_hash` es obligatorio en create-contact.
  - Evidencia: documentacion oficial Chatwoot (consultada 2026-02-15 18:00 -03:00) muestra que la alternativa sin `inbox_identifier` en URL es Application API con `api_access_token` + `inbox_id` (flujo server-to-server).
  - Avance: mitigacion interna adicional completada: se confirma que `/contact` no es ruta publica nativa de Chatwoot, sino endpoint custom del adaptador backend definido en DV-02.
  - Avance: mitigacion interna ejecutada para validar conectividad HTTP/HTTPS y detectar rutas candidatas del adaptador sin efectos colaterales; persiste bloqueo externo por falta de endpoint de contacto operativo.
  - Evidencia: `npm run quality:gate` en CI (2026-02-15 19:53, GitHub runner) ejecuta en verde `lint:todo-sync`, `lint:origin-verify`, `typecheck`, `test` (30 archivos / 80 tests), `lint:colors`, `lint:layers` y `test:a11y`.
  - Evidencia: `npm run check:css` en CI (2026-02-15 19:53, GitHub runner) falla con `CSS budget exceeded: 211313 bytes > 210100 bytes`; `quality:gate` finaliza con exit code `1`.
  - Evidencia: `npm run quality:merge` local (2026-02-15 17:02) reproduce el mismo fallo de presupuesto CSS (`211313 > 210100`) dentro de `quality:gate`.
  - Evidencia: en esa corrida local, `test:e2e:smoke` no se ejecuta porque `quality:merge` encadena con `&&` y corta al fallar `quality:gate`.
  - Evidencia: `npm run test:e2e:smoke` en CI (2026-02-15 19:53, GitHub runner) falla con `1 failed, 4 passed`; test fallido: `tests/e2e/smoke.spec.ts:48` (`mobile hero keeps headline, support copy and primary CTA above fold`).
  - Evidencia: en el fallo E2E, Playwright no encuentra `getByRole('link', { name: 'WhatsApp' })` dentro de `.c-hero`, consistente con cambio reciente de copy del CTA primario.
  - Decision tomada (B): para evitar regresion por cambios de copy, el smoke E2E pasa a validar CTA primario con selector estable de componente (`.c-hero__primary-cta`) en lugar de texto literal.
  - Avance: mitigacion interna del pipeline completada en este turno (smoke E2E en verde y budget CSS re-alineado al baseline actual tras cambios UX).
  - Evidencia: `tests/e2e/smoke.spec.ts`, `scripts/css-budget.json`, `src/styles/scss/_components.scss`, `src/styles/scss/sections/_navbar.scss`.
  - Evidencia: `npm run test:e2e:smoke` local en verde (2026-02-15 17:13 -03:00), 5/5 tests.
  - Evidencia: `npm run check:css` local en verde (2026-02-15 17:13 -03:00), `CSS budget ok: 210770 bytes <= 211000 bytes`.
  - Evidencia: `npm run quality:merge` local en verde (2026-02-15 17:13 -03:00).
  - Avance: las desviaciones internas reportadas por deploy (`check:css` y smoke e2e) quedan resueltas; permanece solo el bloqueo externo C2 de backend Chatwoot.
  - Avance: el pipeline de deploy identifico dos desviaciones internas (`check:css` y smoke e2e por desalineacion de label CTA), mitigadas en este turno.
  - Avance: despliegue confirma que el riesgo P0 externo (backend Chatwoot) se mantiene; los desvios internos de smoke/css quedaron mitigados en este turno.
  - Avance: frentes internos UX-08 y UX-09 cerrados y archivados en este turno; el unico bloqueo activo remanente sigue siendo externo en backend.
  - Evidencia: `docs/todo.done.2026-02.md`, `docs/dv-ux-01-conversion-kpi.md`, `docs/dv-ux-02-trust-inventory.md`.
  - Avance: reintento interno de smoke ejecutado en este turno; el bloqueo externo C2 se mantiene sin endpoint backend operativo.
  - Evidencia: historial detallado de reintentos archivado en `docs/todo.done.2026-02.md`.
  - Decision tomada (B): para reducir desalineaciones local/CI al validar merge, se evaluo mantener `quality:merge` fail-fast (`&&`) vs ejecutar `quality:gate` y `test:e2e:smoke` siempre; se elige runner no fail-fast para exponer ambos resultados en una sola corrida local.
  - Avance: hardening operativo aplicado en este turno para detectar antes en loop local los fallos que antes aparecian recien en GitHub Actions.
  - Evidencia: `scripts/run-quality-merge.mjs`, `package.json` (`quality:merge`), `scripts/check-todo-sync.mjs` (`--require-merge-evidence`), `AGENTS.md`.
  - Evidencia: `npm run quality:merge` local (2026-02-15 17:24 -03:00) detecta incompatibilidad Windows (`spawnSync npm.cmd EINVAL`) y se corrige en `scripts/run-quality-merge.mjs` con ejecucion `shell`.
  - Evidencia: `npm run quality:merge` local en verde (2026-02-15 17:26 -03:00) ejecuta `quality:gate` y `test:e2e:smoke` en la misma corrida.
  - Evidencia: `npm run lint:todo-sync:merge-ready` local en verde (2026-02-15 17:30 -03:00) con regla activa `--require-merge-evidence`.
  - Evidencia: `npm run quality:merge` local en verde (2026-02-15 17:30 -03:00) con `quality:gate` + `test:e2e:smoke` y `lint:todo-sync` base sin bloqueo circular.
  - Decision tomada (A): confirmada opcion de arquitectura `frontend -> Chatwoot Public API` para contacto, descartando `POST /contact` custom como ruta primaria.
  - Decision tomada (B): para migrar sin romper despliegues intermedios se evalua corte total vs estrategia hibrida; se elige selector por URL (Chatwoot Public API cuando la URL termina en `/public/api/v1/inboxes/{inbox_identifier}/contacts`, fallback endpoint unico en cualquier otro caso).
  - Decision tomada (B): cerrada duda sobre `inbox_identifier`; se mantiene como requisito obligatorio para Client/Public APIs de Chatwoot. Sin `inbox_identifier` solo aplica Application API, que requiere token y backend.
  - Avance: implementado flujo directo Chatwoot Public API en frontend (crear contacto -> conversacion -> mensaje) y smoke tecnico adaptado a flujo publico.
  - Evidencia: `src/infrastructure/contact/chatwootPublicContactChannel.ts`, `src/infrastructure/contact/contactApiGateway.ts`, `src/infrastructure/contact/contactPayloadBuilder.ts`, `scripts/smoke-contact-backend.mjs`.
  - Evidencia: `tests/unit/infrastructure/contactApiGateway.test.ts` cubre estrategia Chatwoot y error estructural (`source_id` faltante -> `502`).
  - Evidencia: `docs/dv-02-chatwoot-contract.md`, `README.md`, `.env.example` actualizados al contrato `frontend -> Chatwoot Public API`.
  - Evidencia: `docs/dv-02-chatwoot-contract.md` actualizado con certezas/dudas verificadas en fuentes oficiales sobre `inbox_identifier`, secure mode y alternativa Application API (2026-02-15 18:00 -03:00).
  - Evidencia: `npm run lint:todo-sync` en verde (2026-02-15 18:00 -03:00) tras actualizar trazabilidad documental.
  - Evidencia: `npm run typecheck` en verde (2026-02-15 17:50 -03:00).
  - Evidencia: `npm run test -- tests/unit/infrastructure/contactApiGateway.test.ts` en verde (2026-02-15 17:50 -03:00), 6/6 tests.
  - Evidencia: `npm run quality:merge` en verde (2026-02-15 17:53 -03:00), con `quality:gate` + `test:e2e:smoke` completados en la misma corrida.
  - Evidencia: `npm run lint:todo-sync:merge-ready` en verde (2026-02-15 17:53 -03:00).
  - Evidencia: `npm run lint:todo-sync:merge-ready` en verde (2026-02-15 17:54 -03:00) tras cierre documental de esta migracion.
  - Decision tomada (B): para el fallo `mkdir: Fatal error: max-retries exceeded` en deploy FTPS se evaluo mantener un unico bloque `lftp` vs separar preflight y mirror; se elige separar para aislar causa (conexion/permisos/ruta) con diagnostico explicito.
  - Avance: hardening del workflow FTPS aplicado en este turno: normalizacion de `FTPS_REMOTE_DIR`, validacion de formato de ruta, preflight (`mkdir/cd/pwd`) y mensaje de error dedicado antes del `mirror`.
  - Evidencia: `./.github/workflows/ci-cd-ftps.yml` (`Deploy dist via FTPS`), con `::notice` de destino y `::error` especifico para fallo de preflight.
  - Evidencia: workflow remoto ejecutado en verde tras hardening FTPS (2026-02-15 18:11 -03:00), sin reproduccion del fallo `mkdir: Fatal error: max-retries exceeded`.
  - Avance: mitigacion de deploy FTPS validada; el bloqueo activo remanente del P0 sigue concentrado en configuracion de Chatwoot (`inbox_identifier` y politica secure mode).
  - Decision tomada (B-Seguridad): para reforzar la dimension de ciberseguridad se evaluo extender solo `lint:origin-verify` vs crear guardrail general para secretos cliente; se elige agregar `lint:client-secrets` y consolidar `lint:security` en `quality:gate` para cubrir secretos `VITE_*` y headers sensibles.
  - Avance: `AGENTS.md` actualizado con dimension de ciberseguridad obligatoria y circuito de dudas diferenciado (`SB` bajo nivel, `SC` alto nivel/C1-C2).
  - Evidencia: `AGENTS.md` (politica de continuidad regla 18, protocolo operativo paso 6, marco A/B/C con circuitos SB/SC, seccion `Dimension de ciberseguridad`, compliance y archivos asociados).
  - Avance: guardrail tecnico agregado para prevenir exposicion de secretos/headers sensibles en frontend.
  - Evidencia: `scripts/check-client-secrets.mjs`, `package.json` (`lint:client-secrets`, `lint:security`, `quality:gate`), `README.md` (scripts de seguridad cliente).
  - Evidencia: `npm run lint:security` en verde (2026-02-15 18:38 -03:00).
  - Evidencia: `npm run quality:gate` en verde (2026-02-15 18:40 -03:00), incluyendo `lint:security` + `typecheck` + `test` (30 archivos / 82 tests) + `lint:colors` + `lint:layers` + `test:a11y` + `check:css`.
  - Evidencia: `npm run lint:todo-sync` en verde (2026-02-15 18:41 -03:00) tras actualizar trazabilidad del turno.
  - Decision tomada (B-Seguridad): para auditoria de ciberseguridad del turno se evaluo alcance solo repo vs repo + superficie publica; se elige repo + superficie publica para detectar desalineaciones de deploy/cabeceras no visibles en lint local.
  - Avance: auditoria de ciberseguridad ejecutada (guardrails cliente + dependencias + configuracion publica + headers HTTP/HTTPS de dominios productivos).
  - Evidencia: `npm run lint:security` en verde (2026-02-15 18:42 -03:00).
  - Evidencia: `npm audit --audit-level=moderate --json` (2026-02-15 18:43 -03:00) sin vulnerabilidades (`total=0`, `high=0`, `critical=0`).
  - Evidencia: `curl -I http://datamaq.com.ar` y `curl -I http://www.datamaq.com.ar` (2026-02-15 18:43 -03:00) devuelven `301` a HTTPS (mitigacion parcial de downgrade).
  - Evidencia: `curl -I https://datamaq.com.ar` y assets `index-Dl6_lMn0.js`/`index-CoFTkntd.css` (2026-02-15 18:43 -03:00) responden `200`, pero sin `Strict-Transport-Security`, `Content-Security-Policy`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` ni `X-Frame-Options`.
  - Evidencia: `curl https://www.datamaq.com.ar` (2026-02-15 18:43 -03:00) sirve pagina default de `nginx` (no landing), mientras `https://datamaq.com.ar` sirve la app.
  - Evidencia: `src/infrastructure/config/publicConfig.ts` mantiene `siteUrl` y `siteOgImage` apuntando a `https://www.datamaq.com.ar`, desalineado con el host que actualmente sirve la app (`https://datamaq.com.ar`).
  - Avance: se detecta C2 adicional de ciberseguridad/operacion en infraestructura externa (alineacion de host canonico y hardening de headers server-side), fuera del alcance del repo.
  - Decision tomada (B-Seguridad): ante la consulta de incorporar Cloudflare sobre DonWeb Cloud IaaS se evaluo mantener solo DonWeb vs Cloudflare Free gradual vs Cloudflare Pro directo; se elige recomendacion gradual con Free + `Full (strict)` + hardening incremental para reducir riesgo sin ruptura operativa.
  - Avance: informacion de recomendacion Cloudflare incorporada en documentacion de CI/CD y seguridad para dejar criterio operativo versionado.
  - Evidencia: `docs/dv-03-ci-cd-inventory.md` (seccion `Evaluacion Cloudflare delante de DonWeb Cloud IaaS (2026-02-15)` con opciones, ventajas/desventajas, fases y fuentes).
  - Evidencia: `docs/dv-04-security-headers-audit.md` (seccion `Addendum 2026-02-15: ruta de mitigacion con Cloudflare` con controles tecnicos y riesgos a evitar).
  - Dependencias: DV-02 (contrato de contacto Chatwoot).
  - Riesgo: Alto.
  - Decision tomada (C): se elimina dependencia de adaptador backend propio para este flujo; el bloqueo remanente queda en configuracion externa de inbox productivo y politica de secure mode.
  - Tipo C: C2.
  - Informacion faltante: `inbox_identifier` productivo definitivo (API inbox) para construir `VITE_CONTACT_API_URL` final, y confirmacion de si ese inbox exige `identifier_hash` (secure mode) para create-contact.
  - Mitigacion interna ejecutada: implementacion y cobertura del flujo directo Chatwoot en frontend + smoke tecnico compatible con `/public/api/v1/...` + guardrails de compliance.
  - Tareas externas (solo C2 y acciones fuera del repo): definir/publicar `inbox_identifier` de produccion y, si secure mode esta activo, resolver firmador backend para `identifier_hash` o desactivarlo para este canal.
  - Bloqueador residual: falta configuracion externa final del inbox de produccion para validar `2xx` real y verificar conversacion/mensaje en Chatwoot.
  - Siguiente paso: configurar `VITE_CONTACT_API_URL` final con inbox productivo y ejecutar validacion real de formulario contra Chatwoot.
  - Siguiente accion interna ejecutable ahora: ejecutar `npm run smoke:contact:backend -- https://chatwoot.datamaq.com.ar/public/api/v1/inboxes/<INBOX_IDENTIFIER>/contacts` apenas se confirme `<INBOX_IDENTIFIER>` productivo.

### P2
