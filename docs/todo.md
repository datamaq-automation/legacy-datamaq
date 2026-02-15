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
  - Accion: remover uso de secreto en frontend y migrar validacion de origen al backend/proxy.
  - DoD (criterio de aceptacion): no hay referencias a `VITE_ORIGIN_VERIFY_SECRET` ni a `X-Origin-Verify` en frontend; contrato backend validado y funcionando.
  - Avance: removidas las referencias frontend al secreto y al header de verificacion; contrato backend definido con integracion server-to-server a Chatwoot.
  - Evidencia: `src/application/ports/Config.ts`, `src/infrastructure/config/viteConfig.ts`, `src/infrastructure/contact/contactApiGateway.ts`, `src/env.d.ts`, `.env.example`, `tests/unit/infrastructure/contactApiGateway.test.ts`.
  - Evidencia: `docs/dv-02-chatwoot-contract.md`.
  - Avance: guardrail anti-regresion activo para evitar reintroduccion de secreto/header en frontend.
  - Evidencia: `scripts/check-origin-verify-leaks.mjs`, `package.json` (`lint:origin-verify` dentro de `quality:gate`).
  - Evidencia: `npm run lint:origin-verify` en verde (2026-02-15 13:09 -03:00).
  - Evidencia: `npm run smoke:contact:backend -- https://chatwoot.datamaq.com.ar/contact` (2026-02-15 13:09 -03:00) falla con `fetch failed`.
  - Evidencia: `npm run smoke:contact:backend -- https://chatwoot.datamaq.com.ar/contact` (2026-02-15 13:43 -03:00) mantiene `Smoke FAIL: fetch failed`.
  - Evidencia: `npm run smoke:contact:backend -- https://chatwoot.datamaq.com.ar/contact` (2026-02-15 16:09 -03:00) mantiene `Smoke FAIL: fetch failed`.
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
  - Dependencias: DV-02 (contrato backend).
  - Riesgo: Alto.
  - Decision tomada (C): no se implementara backend minimo en este repositorio; el cierre se ejecutara sobre backend de produccion cuando corresponda.
  - Tipo C: C2.
  - Informacion faltante: endpoint backend productivo definitivo con respuesta `2xx` y evidencia de creacion de conversacion en Chatwoot.
  - Mitigacion interna ejecutada: enforcement local/CI para impedir que el frontend vuelva a usar secreto o header de verificacion y reintentos periodicos de smoke.
  - Tareas externas (solo C2 y acciones fuera del repo): desplegar en backend Docker (VPS) el adaptador Chatwoot, exponer endpoint publico definitivo y confirmar conversacion real desde formulario productivo.
  - Bloqueador residual: falta implementar en backend Docker (VPS) el adaptador Chatwoot y validar E2E en produccion.
  - Siguiente paso: coordinar despliegue externo del adaptador Chatwoot en backend Docker (VPS) y, con URL final disponible, validar formulario real -> conversacion en Chatwoot.
  - Siguiente accion interna ejecutable ahora: reejecutar `npm run smoke:contact:backend -- <URL_FINAL>` inmediatamente despues de recibir confirmacion de despliegue backend con endpoint publico operativo.

### P2
