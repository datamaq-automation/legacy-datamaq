# Plan Tecnico Prioritario

> Archivo de tareas completadas: `docs/todo.done.2026-02.md`.

## 1) Contexto y objetivo
El diagnostico tecnico del frontend Vue/TypeScript muestra una base arquitectonica util (capas `ui/application/domain/infrastructure`) pero con bloqueadores concretos para cambios grandes de UI/UX.
Se confirmo evidencia objetiva de baseline roto en calidad tecnica: `npx tsc --noEmit` fallaba con 38 errores, y tambien fallaban guardrails de CSS/a11y.
El objetivo del plan es sostener un estado seguro y estable para habilitar mejoras de UI/UX sin introducir deuda critica.

## 2) Alcance
Incluye:
- Estabilizacion tecnica frontend en este repositorio (`src`, `scripts`, `docs`, `tests`).
- Correcciones de tipado TypeScript, guardrails de CSS/a11y, y flujo de consentimiento/analytics.
- Limpieza de deuda estructural detectada (duplicados, codigo/documentacion desactualizada, pruebas faltantes en UI).

No incluye:
- Rediseno visual completo UI/UX (solo habilitadores tecnicos previos).
- Implementacion backend completa (solo coordinacion de contrato e integracion necesaria).
- Configuracion de infraestructura externa no versionada en este repo (se releva primero como duda).

## 3) Prioridades
- `P0`: bloquea cambios grandes de UI/UX o expone riesgo alto (seguridad, cumplimiento, baseline roto).
- `P1`: reduce deuda relevante y riesgo de regresion, pero no bloquea de inmediato.
- `P2`: optimizaciones y mejoras de escalabilidad/performance no criticas para iniciar UI/UX.

## 4) Backlog activo

### P0
- [>] (P0) Eliminar secreto de verificacion del frontend
  - Contexto: se detecto uso de `VITE_ORIGIN_VERIFY_SECRET` y envio de `X-Origin-Verify` desde navegador, lo que no es secreto en cliente.
  - Accion: remover uso de secreto en frontend y migrar validacion de origen al backend/proxy.
  - DoD (criterio de aceptacion): no hay referencias a `VITE_ORIGIN_VERIFY_SECRET` ni a `X-Origin-Verify` en frontend; contrato backend validado y funcionando.
  - Avance: removidas las referencias frontend al secreto y al header de verificacion; contrato backend definido con integracion server-to-server a Chatwoot.
  - Evidencia: `src/application/ports/Config.ts`, `src/infrastructure/config/viteConfig.ts`, `src/infrastructure/contact/contactApiGateway.ts`, `src/env.d.ts`, `.env.example`, `tests/unit/infrastructure/contactApiGateway.test.ts`.
  - Evidencia: `docs/dv-02-chatwoot-contract.md`.
  - Evidencia: referencia operativa estimativa de endpoint backend `https://chatwoot.datamaq.com.ar/contact` (puede variar).
  - Evidencia: script de smoke backend `scripts/smoke-contact-backend.mjs` + script npm `smoke:contact:backend`.
  - Evidencia: `npm run smoke:contact:backend -- https://chatwoot.datamaq.com.ar/contact` (2026-02-15) falla con `fetch failed` en estado previo a despliegue backend.
  - Evidencia: `npm run typecheck`, `npm run test` y `npm run build` en verde.
  - Dependencias: DV-02 (contrato backend).
  - Riesgo: Alto.
  - Decision tomada (C): no se implementara backend minimo en este repositorio; el cierre se ejecutara sobre backend de produccion cuando corresponda.
  - Bloqueador residual: falta implementar en backend Docker (VPS) el adaptador Chatwoot y validar E2E en produccion.
  - Siguiente paso: ejecutar `npm run smoke:contact:backend -- https://chatwoot.datamaq.com.ar/contact` (o URL final) y luego validar formulario real -> conversacion en Chatwoot.

- [>] (P0) Definir puerta de calidad obligatoria para merge
  - Contexto: el workflow CI/CD ya esta versionado en repo, pero los checks criticos todavia no estan garantizados como bloqueantes hasta configurar branch protection.
  - Accion: definir y aplicar pipeline minimo con `typecheck`, `test`, `test:a11y`, `check:css`, `lint:colors`.
  - DoD (criterio de aceptacion): politica de merge definida y ejecutable (CI o mecanismo acordado) con esos checks como requisito.
  - Avance: implementado workflow `GitHub Actions + FTPS` con `Quality Gate` y `Smoke E2E`; `quality:gate` incluye `lint:layers`; existe `quality:merge` para control local.
  - Evidencia: `./.github/workflows/ci-cd-ftps.yml`, `package.json` (`quality:gate`, `quality:merge`, `lint:layers`, `ci:remote:status`, `ci:branch-protection:check`), `docs/dv-03-ci-cd-inventory.md`.
  - Evidencia: `npm run quality:gate` en verde (2026-02-15).
  - Evidencia: `npm run quality:merge` en verde (2026-02-15).
  - Evidencia: `npm run ci:remote:status` en verde (2026-02-15) con detalle de runs/jobs remotos.
  - Evidencia: `npm run ci:branch-protection:check` falla sin token (2026-02-15), confirmando bloqueo de autenticacion para validar enforcement.
  - Evidencia: timeout de deploy FTPS aplicado en workflow (`timeout-minutes: 20` y `timeout 900 lftp`) para evitar ejecuciones colgadas >35m.
  - Dependencias: DV-03 (estado real de CI/CD).
  - Riesgo: Alto.
  - Bloqueador residual: falta activar required checks y branch protection en `main`.
  - Siguiente paso: configurar branch protection y exigir `CI/CD FTPS / Quality Gate` + `CI/CD FTPS / Smoke E2E`.
  - Nota C (2026-02-15): bloqueo de configuracion en GitHub (entorno externo al repo).

### P1
- Sin tareas activas en este momento.

### P2
- Sin tareas activas en este momento.

## 5) Dudas activas

### DV-03: Estado real de CI/CD y reglas de merge
Duda:
- El pipeline principal ya se implemento en repo, pero falta confirmar enforcement final (required checks + branch protection).

Tarea de verificacion:
- [>] (P0) Relevar pipeline real de integracion
  - Contexto: los checks criticos no estan garantizados por evidencia local.
  - Accion: inventariar estado real y decidir implementacion en repo o fuera del repo.
  - DoD (criterio de aceptacion): inventario de checks actuales + decision de implementacion en repo o fuera del repo.
  - Avance: inventario completado y decision ejecutada: `GitHub Actions + FTPS` en repo, con jobs de `Quality Gate` y `Smoke E2E`.
  - Evidencia: `docs/dv-03-ci-cd-inventory.md`.
  - Evidencia: `./.github/workflows/ci-cd-ftps.yml`.
  - Evidencia: `npm run test:e2e:smoke` en verde (local).
  - Evidencia: parametros FTPS confirmados (`FTPS_REMOTE_DIR=/public_html`, `FTPS_PORT=21`).
  - Evidencia: `npm run quality:gate` y `npm run quality:merge` en verde (2026-02-15).
  - Evidencia: `npm run ci:remote:status` en verde (2026-02-15) con detalle de runs/jobs remotos.
  - Evidencia: GitHub API publica confirma runs `22026083056` (`workflow_dispatch`) y `22026104230` (`push`) con jobs `Quality Gate` y `Smoke E2E` exitosos.
  - Evidencia: run `22026104230` mostro deploy FTPS colgado ~41m y cancelado por `concurrency`; mitigado con timeout en `./.github/workflows/ci-cd-ftps.yml`.
  - Riesgo: Medio.
  - Bloqueador residual: configurar branch protection y required checks en GitHub.
  - Decision tomada (B): para indexar checks sin abrir PR se elige `workflow_dispatch` sobre `main` en lugar de push tecnico.
  - Decision tomada (B): exigir solo checks del flujo FTPS vigente (`Quality Gate` + `Smoke E2E`) y no checks legacy (`Cloudflare Pages`) para evitar acoplamiento a pipeline no vigente.
  - Siguiente paso: ejecutar `workflow_dispatch` en `main`, luego aplicar branch protection y exigir `CI/CD FTPS / Quality Gate` + `CI/CD FTPS / Smoke E2E`.
  - Nota C (2026-02-15): el bloqueo remanente depende de configuracion en GitHub (fuera del arbol versionado).

## 6) Notas de ejecucion A/B/C (actualizado 2026-02-15)
- Clasificacion B aplicada en: DV-03 indexacion de checks sin PR (`workflow_dispatch` en `main`).
- Clasificacion B aplicada en: DV-03 seleccion de required checks (solo `Quality Gate` + `Smoke E2E`).
- Clasificacion B aplicada en: DV-03 automatizacion de verificacion de branch protection (`ci:branch-protection:check` con token).
- Clasificacion B aplicada en: DV-03 timeout de deploy FTPS (timeout de job + timeout de comando `lftp`).
- Clasificacion B aplicada en: DV-02 endpoint backend estimativo (`https://chatwoot.datamaq.com.ar/contact`) manteniendo `VITE_CONTACT_API_URL` parametrizada.
- Clasificacion B aplicada en: P0 puerta de calidad (mitigacion local `npm run quality:merge` mientras enforcement externo sigue pendiente).
- Clasificacion C aplicada en: P0 secreto/frontend-backend (sin backend minimo en este repo; implementacion directa en backend de produccion).
- Clasificacion C mantenida en: P0 seguridad/frontend-backend y DV-03 por depender de entornos externos.

## 7) Proximos pasos
- Ejecutar P0 de seguridad en backend productivo (adaptador Chatwoot + evidencia E2E real).
- Completar DV-03 en GitHub (branch protection + required checks) usando los checks del flujo FTPS vigente.
- Mantener `npm run quality:merge` como control operativo manual hasta cerrar enforcement externo.
