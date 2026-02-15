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
  - Avance: frentes internos UX-08 y UX-09 cerrados y archivados en este turno; el unico bloqueo activo remanente sigue siendo externo en backend.
  - Evidencia: `docs/todo.done.2026-02.md`, `docs/dv-ux-01-conversion-kpi.md`, `docs/dv-ux-02-trust-inventory.md`.
  - Avance: reintento interno de smoke ejecutado en este turno; el bloqueo externo C2 se mantiene sin endpoint backend operativo.
  - Evidencia: historial detallado de reintentos archivado en `docs/todo.done.2026-02.md`.
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
