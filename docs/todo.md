# Plan Tecnico Prioritario

> Archivo de tareas completadas: `docs/todo.done.2026-02.md`.

## 1) Contexto y objetivo
El diagnostico tecnico del frontend Vue/TypeScript muestra una base arquitectonica util (capas `ui/application/domain/infrastructure`) pero con bloqueadores concretos para cambios grandes de UI/UX.
Se confirmo evidencia objetiva de baseline roto en calidad tecnica: `npx tsc --noEmit` fallaba con 38 errores, y tambien fallaban guardrails de CSS/a11y.
El objetivo del plan es sostener un estado seguro y estable para habilitar mejoras de UI/UX sin introducir deuda critica.

Adicional UI/UX (evidencia visual actual, 2026-02-15):
- Mobile: el hero prioriza ilustracion, empuja H1/valor/CTA abajo; riesgo directo de conversion.
- Desktop: header/nav no esta consolidado, hay mucho espacio “muerto” arriba/izquierda; jerarquia de CTA mejorable.
- Copy: faltan acentos/ortografia (p. ej. “Instalacion”, “diagnostico”, “electrico”, “verificacion”) impacta credibilidad.

## 2) Alcance
Incluye:
- Estabilizacion tecnica frontend en este repositorio (`src`, `scripts`, `docs`, `tests`).
- Correcciones de tipado TypeScript, guardrails de CSS/a11y, y flujo de consentimiento/analytics.
- Limpieza de deuda estructural detectada (duplicados, codigo/documentacion desactualizada, pruebas faltantes en UI).
- Mejoras UI/UX incrementales orientadas a conversion y claridad (layout responsive, jerarquia visual, IA basica, copy, accesibilidad, componentes base/tokens) sin romper baseline.

No incluye:
- Rediseño visual completo de marca (branding desde cero) ni exploraciones amplias sin objetivo medible.
- Implementacion backend completa (solo coordinacion de contrato e integracion necesaria).
- Configuracion de infraestructura externa no versionada en este repo (se releva primero como duda).

## 3) Prioridades
- `P0`: bloquea cambios grandes de UI/UX o expone riesgo alto (seguridad, cumplimiento, baseline roto, conversion claramente degradada).
- `P1`: reduce deuda relevante y riesgo de regresion, mejora UX medible, pero no bloquea de inmediato.
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

- [>] (P0) UX-01 Consolidar header/nav y jerarquia “above the fold” (desktop + mobile)
  - Contexto: evidencia visual actual muestra header/nav no consolidado y mucho espacio “muerto”; en mobile el hero prioriza ilustracion y desplaza el valor/CTA abajo.
  - Accion:
    - Desktop: header fijo/consistente con logo + nav + CTA primario (WhatsApp/Contacto).
    - Mobile: menu hamburguesa accesible; H1 + propuesta de valor + CTA primario visibles sin scroll en viewport 360x740 (o equivalente).
    - Reordenar hero: reducir/recortar ilustracion en mobile (o moverla abajo del copy/CTA).
  - DoD:
    - En 360x740: H1 + texto de apoyo (1–2 lineas) + CTA primario visibles sin scroll.
    - En desktop >= 1280px: header alineado, nav visible, CTA primario destacado y consistente.
    - Sin CLS perceptible al cargar (no “salta” el hero).
    - `npm run test:a11y` sigue en verde.
  - Evidencia: capturas actuales (desktop/mobile) 2026-02-15; comparativa post-fix en PR/issue.

- [>] (P0) UX-02 Accesibilidad interactiva critica (focus, teclado, menu, CTAs)
  - Contexto: ya existen guardrails a11y; falta asegurar experiencia real: foco visible, navegacion por teclado y roles/aria correctos en header/menu/botones.
  - Accion:
    - Focus visible consistente (no solo outline por default) y sin “focus trap”.
    - Menu mobile: `aria-expanded`, `aria-controls`, cierre con `Esc`, bloqueo de scroll del fondo cuando esta abierto.
    - Skip link (`Saltar al contenido`) y orden de headings correcto (un solo H1).
  - DoD:
    - Navegacion completa por teclado (Tab/Shift+Tab/Enter/Esc) sin bloqueos.
    - Contraste minimo AA en texto/botones relevantes (especialmente badges/chips).
    - `npm run test:a11y` en verde + checklist manual (teclado) registrado en PR.
  - Evidencia: registro breve en PR (pasos + resultado) + screenshots.

### P1
- [>] (P1) UX-03 Normalizar tipografia, espaciado y componentes base (design tokens minimo)
  - Contexto: mejoras UX sustentables requieren consistencia (botones, badges, cards, spacing, tipo).
  - Accion:
    - Definir tokens minimos (CSS variables) para: font-size/line-height, spacing, radius, sombras, colores semanticos (bg/surface/text/primary).
    - Unificar componentes base: `Button`, `Badge/Chip`, `Card` (estados hover/focus/disabled).
  - DoD:
    - No hay estilos “ad-hoc” repetidos para CTA/badges/cards (refactor visible).
    - Tokens documentados en `docs/` (breve) y consumidos por componentes.
    - `check:css` y `lint:colors` siguen en verde.
  - Riesgo: Medio (cambios transversales).

- [>] (P1) UX-04 IA y estructura de landing orientada a decision (secciones + anclas)
  - Contexto: hoy el usuario ve hero pero no queda claro el flujo completo (que incluye, como se trabaja, pasos, FAQs).
  - Accion: definir y maquetar secciones (sin rediseño total) con navegación por anclas:
    - Servicios (cards)
    - Proceso / “Como trabajamos” (pasos, checklist, cierre tecnico)
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
    - Corregir ortografia/acentos (Instalación, diagnóstico, eléctrico, verificación, documentación).
    - Simplificar parrafo de apoyo (frases mas cortas, 1 idea por linea).
    - Aclarar tarifa base: desde cuanto, que incluye, que varia (traslado/distancia/equipo provisto).
  - DoD:
    - Sin errores ortograficos evidentes en hero/servicios.
    - Copy del hero <= 2–3 lineas en desktop y <= 4 lineas en mobile (sin “pared de texto”).
    - Mensaje de CTA coherente (WhatsApp: “Pedí coordinación” / “Cotizar por WhatsApp”).
  - Evidencia: checklist de copy en PR.

- [>] (P1) UX-06 CTA y conversion tracking (sin romper consentimiento)
  - Contexto: hay CTA WhatsApp y “Ver servicios”; falta jerarquia consistente y medicion.
  - Accion:
    - Definir CTA primario unico por pantalla (WhatsApp/Contacto) + secundario (Servicios).
    - Mensaje prellenado de WhatsApp con contexto (servicio + zona + urgencia).
    - Eventos de analitica solo tras consentimiento (alineado al flujo actual).
  - DoD:
    - CTA primario consistente (mismo label/estilo) en hero, header y footer.
    - Tracking de click CTA y scroll a secciones (si aplica) respetando consentimiento.
  - Riesgo: Medio (acople con analytics/consent).

- [>] (P1) UX-07 Señales de confianza (trust) sin “ruido”
  - Contexto: servicios industriales requieren reducir incertidumbre (quien, como, evidencia).
  - Accion: incorporar 2–4 señales maximas:
    - “Checklist + verificación final + documentación”
    - “Respuesta < 24hs”
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

### DV-UX-01: Objetivo de conversion y KPI minimo
Duda:
- Cual es el objetivo primario medible de la landing (click a WhatsApp, envio de formulario, scroll a tarifas, etc.) y que evento define “lead valido”.

Tarea de verificacion:
- [>] (P1) Definir KPI y evento canonico de conversion
  - Accion: acordar 1 KPI primario + 1 secundario y mapear eventos (respetando consentimiento).
  - DoD: definicion escrita en `docs/` + eventos implementados/validados (si aplica).

### DV-UX-02: Inventario de contenido “real” disponible para trust
Duda:
- Existen testimonios, casos, certificaciones, fotos reales, marcas atendidas, matricula/habilitaciones, etc.

Tarea de verificacion:
- [>] (P1) Relevar assets de confianza disponibles
  - Accion: listado de assets y decision de que entra en landing sin saturar.
  - DoD: inventario en `docs/` + decision registrada.

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
- Ejecutar P0 UX (header/nav + above-the-fold + accesibilidad interactiva) para destrabar iteraciones de UI/UX.
- Mantener `npm run quality:merge` como control operativo manual hasta cerrar enforcement externo.
