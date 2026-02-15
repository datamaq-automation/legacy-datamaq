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
- [>] (P2) UX-08 Performance percibida (LCP/imagenes/CLS)
  - Contexto: ilustracion hero grande en mobile puede penalizar LCP; cambios de layout pueden generar CLS.
  - Accion:
    - Optimizar assets del hero (SVG si posible, lazy-load donde aplique).
    - Reservar espacio para evitar CLS (width/height, aspect-ratio).
    - Revisar fonts (preload o swap segun corresponda).
  - DoD:
    - Sin CLS perceptible en hero.
    - Mejora observable en Lighthouse (al menos LCP/CLS) en mobile.

- [>] (P2) UX-09 Microinteracciones discretas (solo si no afecta performance)
  - Accion: hover/focus refinados, transiciones suaves en botones/cards, animacion de apertura de menu sin mareo.
  - DoD: respeta `prefers-reduced-motion`.

## 5) Dudas activas

### DV-UX-01: Objetivo de conversion y KPI minimo
Duda:
- Cual es el objetivo primario medible de la landing (click a WhatsApp, envio de formulario, scroll a tarifas, etc.) y que evento define "lead valido".

Tarea de verificacion:
- [>] (P1) Definir KPI y evento canonico de conversion
  - Accion: acordar 1 KPI primario + 1 secundario y mapear eventos (respetando consentimiento).
  - DoD: definicion escrita en `docs/` + eventos implementados/validados (si aplica).
  - Evidencia: `docs/dv-ux-01-kpi-proposal.md`.
  - Decision tomada (C): la seleccion final del KPI primario impacta definicion comercial de "lead valido", por lo que no se fuerza una eleccion tecnica unilateral.
  - Tipo C: C1.
  - Bloqueador residual: falta confirmar KPI primario oficial de conversion para cerrar mapeo canonico de eventos.
  - Informacion faltante: prioridad comercial entre WhatsApp vs formulario como conversion principal.
  - Mitigacion interna ejecutada: propuesta cerrada A/B/C documentada con recomendacion tecnica y reutilizacion de eventos ya instrumentados (`contact`, `generate_lead`, `scroll_to_section`).
  - Pregunta cerrada pendiente (solo C1): Para DV-UX-01, elegis KPI primario A/B/C? (A: WhatsApp primario, B: Formulario primario, C: Conversion compuesta).
  - Siguiente paso: aplicar la opcion elegida, actualizar documento canonico de conversion y ajustar tracking si corresponde.
  - Siguiente accion interna ejecutable ahora: apenas se confirme A/B/C, implementar mapeo final en `docs/` y validar eventos en entorno local.

### DV-UX-02: Inventario de contenido real disponible para trust
Duda:
- Existen testimonios, casos, certificaciones, fotos reales, marcas atendidas, matricula/habilitaciones, etc.

Tarea de verificacion:
- [>] (P1) Relevar assets de confianza disponibles
  - Accion: listado de assets y decision de que entra en landing sin saturar.
  - DoD: inventario en `docs/` + decision registrada.

## 6) Notas de ejecucion A/B/C (resumen activo 2026-02-15)
- Clasificacion A aplicada en: UX-01 y UX-02 (completadas y archivadas en `docs/todo.done.2026-02.md`).
- Clasificacion B aplicada en: decisiones de gobernanza (`workflow_dispatch`, required checks del flujo FTPS vigente, y limpieza operativa de `todo.md`).
- Clasificacion B aplicada en: automatizacion de limpieza documental (`todo:archive` + `lint:todo-sync --require-no-done-tasks`) para mantener `docs/todo.md` sin tareas `[x]`.
- Clasificacion B aplicada en: dudas de bajo nivel resueltas para higiene documental (enfoque hibrido con `todo:compact:noise` manual y `quality:gate` sin mutaciones).
- Clasificacion B aplicada en: alineacion del guardrail `ci:branch-protection:check` para exigir `Todo Sync` ademas de `Quality Gate` y `Smoke E2E`.
- Avance: UX-03 archivada en `docs/todo.done.2026-02.md` y tablero activo reordenado con seccion `### P1` tras `todo:archive`.
- Clasificacion B aplicada en: UX-04, implementando secciones ancladas en bloque dedicado para reducir impacto en componentes existentes.
- Clasificacion B aplicada en: UX-05, normalizando copy y CTA con convenio ASCII para evitar ruido de encoding sin perder claridad comercial.
- Clasificacion B aplicada en: UX-06, tracking de scroll por `hashchange` para reducir acople y mantener consentimiento centralizado en `TrackingFacade`.
- Clasificacion B aplicada en: UX-07, reforzando trust en hero mediante chips existentes para no competir con CTA.
- Clasificacion C aplicada en: P0 seguridad/frontend-backend (bloqueo externo por despliegue backend).
- Clasificacion C aplicada en: DV-UX-01 (C1 pendiente de definicion comercial de KPI primario).
- Historial detallado de clasificaciones y reintentos: `docs/todo.done.2026-02.md`.

## 7) Proximos pasos
- Ejecutar P0 de seguridad en backend productivo (adaptador Chatwoot + evidencia E2E real).
- Resolver DV-UX-01 (KPI/evento canonico) y DV-UX-02 (inventario trust) para habilitar decisiones cerradas de conversion en UX.
