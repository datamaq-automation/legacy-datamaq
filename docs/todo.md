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

### P1
- [>] (P1) UX-04 IA y estructura de landing orientada a decision (secciones + anclas)
  - Contexto: hoy el usuario ve hero pero no queda claro el flujo completo (que incluye, como se trabaja, pasos, FAQs).
  - Accion: definir y maquetar secciones (sin rediseño total) con navegacion por anclas:
    - Servicios (cards)
    - Proceso / "Como trabajamos" (pasos, checklist, cierre tecnico)
    - Tarifas base y que incluye/no incluye
    - Cobertura (GBA Norte/zonas) + tiempos
    - FAQ
    - Contacto (WhatsApp + formulario si aplica)
  - DoD:
    - Navegacion por anclas funciona en desktop/mobile.
    - Se puede llegar a Contacto en <= 2 interacciones desde el hero.
    - Headings semanticos correctos (H2 por seccion).
  - Evidencia: URL local + capturas en PR.

- [>] (P1) UX-05 Copy y microcopy de confianza (ortografia + claridad de alcance)
  - Contexto: errores de acentuacion y frases largas restan credibilidad; tambien falta claridad en alcance/condiciones.
  - Accion:
    - Corregir ortografia/acentos (Instalacion, diagnostico, electrico, verificacion, documentacion).
    - Simplificar parrafo de apoyo (frases mas cortas, 1 idea por linea).
    - Aclarar tarifa base: desde cuanto, que incluye, que varia (traslado/distancia/equipo provisto).
  - DoD:
    - Sin errores ortograficos evidentes en hero/servicios.
    - Copy del hero <= 2-3 lineas en desktop y <= 4 lineas en mobile (sin pared de texto).
    - Mensaje de CTA coherente (WhatsApp: "Pedi coordinacion" / "Cotizar por WhatsApp").
  - Evidencia: checklist de copy en PR.

- [>] (P1) UX-06 CTA y conversion tracking (sin romper consentimiento)
  - Contexto: hay CTA WhatsApp y "Ver servicios"; falta jerarquia consistente y medicion.
  - Accion:
    - Definir CTA primario unico por pantalla (WhatsApp/Contacto) + secundario (Servicios).
    - Mensaje prellenado de WhatsApp con contexto (servicio + zona + urgencia).
    - Eventos de analitica solo tras consentimiento (alineado al flujo actual).
  - DoD:
    - CTA primario consistente (mismo label/estilo) en hero, header y footer.
    - Tracking de click CTA y scroll a secciones (si aplica) respetando consentimiento.
  - Riesgo: Medio (acople con analytics/consent).

- [>] (P1) UX-07 Señales de confianza (trust) sin ruido
  - Contexto: servicios industriales requieren reducir incertidumbre (quien, como, evidencia).
  - Accion: incorporar 2-4 señales maximas:
    - "Checklist + verificacion final + documentacion"
    - "Respuesta < 24hs"
    - Cobertura/zonas
    - (Opcional) mini caso/testimonio o logos (si existen)
  - DoD:
    - Trust signals visibles en hero o primera pantalla sin saturar.
    - No compiten visualmente con CTA (jerarquia clara).

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
- Clasificacion C aplicada en: P0 seguridad/frontend-backend (bloqueo externo por despliegue backend).
- Historial detallado de clasificaciones y reintentos: `docs/todo.done.2026-02.md`.

## 7) Proximos pasos
- Ejecutar P0 de seguridad en backend productivo (adaptador Chatwoot + evidencia E2E real).
- Ejecutar UX-04 como siguiente frente interno de mejora UX una vez cerrado bloqueo P0 externo.
