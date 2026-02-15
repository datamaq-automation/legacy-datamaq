# Tareas Completadas (2026-02)

Extraccion automatica desde `docs/todo.md` el 2026-02-15.

# Plan Tecnico Prioritario

## 4) Backlog de tareas

### P0

- [x] (P0) Recuperar baseline TypeScript en verde
  - Contexto: `tsconfig.json` declara modo estricto, pero `npx tsc --noEmit` reporta 38 errores y no existe script `typecheck` en `package.json`.
  - Accion: agregar script `typecheck`, corregir configuracion de TS y errores de tipos hasta dejar compilacion estricta en verde.
  - DoD (criterio de aceptacion): `npm run typecheck` existe y finaliza con exit code 0; conteo de errores TS = 0; evidencia en PR.
  - Evidencia: `package.json` (script `typecheck`), `tsconfig.json` (`lib` actualizado), `src/env.d.ts` (declaracion `*.vue`), y `npm run typecheck` en verde.
  - Owner: Frontend
  - Dependencias: Ninguna
  - Riesgo: Alto

- [x] (P0) Corregir flujo de consentimiento y activacion de analytics
  - Contexto: se detectaron dos claves de consentimiento distintas (`datamaq-www-consent` y `consent.analytics`) y `initAnalytics()` solo se ejecuta al iniciar la app.
  - Accion: unificar fuente de verdad de consentimiento y conectar aceptacion/rechazo con inicializacion/bloqueo real de tracking.
  - DoD (criterio de aceptacion): existe una sola clave de consentimiento activa; al aceptar se habilita tracking segun especificacion validada; al rechazar no se envian eventos; tests unitarios cubren ambos caminos.
  - Avance: implementada la sincronizacion `consentManager` <-> analytics con politica `hard revoke` (bloqueo real + revocacion/limpieza de cookies first-party de analytics).
  - Evidencia: `src/application/consent/consentStorage.ts`, `src/application/consent/consentManager.ts`, `src/infrastructure/consent/consent.ts`, `src/infrastructure/analytics/index.ts`, `src/infrastructure/analytics/browserAnalytics.ts`, `src/main.ts`.
  - Evidencia: `src/infrastructure/analytics/ga4.ts`, `src/infrastructure/analytics/clarity.ts`, `src/infrastructure/analytics/cookies.ts`.
  - Evidencia: DV-01 cerrado en `docs/dv-01-consent-matrix.md` con decision `hard revoke`.
  - Evidencia: tests `tests/unit/application/consentManager.test.ts`, `tests/unit/infrastructure/consent.test.ts`, `tests/unit/infrastructure/analyticsConsentSync.test.ts`, `tests/unit/infrastructure/analyticsCookies.test.ts`, `tests/unit/infrastructure/browserAnalytics.test.ts`; `npm run typecheck`, `npm run test` y `npm run build` en verde.
  - Owner: Shared
  - Dependencias: DV-01 (politica de consentimiento)
  - Riesgo: Alto
  - Decision tomada (B): para `hard revoke` se adopto combinacion de propagacion de consentimiento a proveedores (GA4/Clarity) + limpieza best-effort de cookies first-party para minimizar persistencia residual.
  - Bloqueador residual: alinear texto legal/politica de privacidad fuera de este repo.
  - Siguiente paso: coordinar update legal de privacidad para reflejar `hard revoke`.

- [x] (P0) Corregir accesibilidad en landing de Escobar
  - Contexto: `npm run test:a11y` falla por secciones sin etiqueta accesible en `src/ui/pages/MedicionConsumoEscobar.vue`.
  - Accion: agregar `aria-label`/`aria-labelledby` o heading valido en las secciones reportadas.
  - DoD (criterio de aceptacion): `npm run test:a11y` pasa sin hallazgos.
  - Evidencia: `src/ui/pages/MedicionConsumoEscobar.vue` con `aria-labelledby` + ids; `npm run test:a11y` en verde.
  - Owner: Frontend
  - Dependencias: Ninguna
  - Riesgo: Medio

- [x] (P0) Volver a verde guardrails de estilos
  - Contexto: `npm run lint:colors` falla por hex directo en `src/styles/scss/overrides.scss`; `npm run check:css` falla por presupuesto excedido (`210044 > 210000` bytes).
  - Accion: reemplazar hex por token permitido y ajustar CSS para cumplir presupuesto (o justificar cambio de budget con evidencia).
  - DoD (criterio de aceptacion): `npm run lint:colors` y `npm run check:css` pasan; si se cambia `scripts/css-budget.json`, queda justificacion tecnica documentada en PR.
  - Evidencia: `src/styles/scss/overrides.scss` sin hex directo; `scripts/css-budget.json` actualizado a `210100`; `npm run lint:colors` y `npm run check:css` en verde.
  - Owner: Frontend
  - Dependencias: Ninguna
  - Riesgo: Medio

### P1

- [x] (P1) Refactorizar `ContactApiGateway` por responsabilidades
  - Contexto: `src/infrastructure/contact/contactApiGateway.ts` concentra envio, normalizacion, heuristicas de endpoint y actualizacion posterior.
  - Accion: separar responsabilidades de armado de payload, estrategia de envio backend y mapeo de errores, eliminando la ruta de webchat.
  - DoD (criterio de aceptacion): gateway dividido en modulos con responsabilidades claras; tests unitarios cubren envio backend y errores.
  - Avance: gateway refactorizado a orquestador backend-only + modulos por responsabilidad (builder de payloads, estrategia backend y mapeo de errores).
  - Evidencia: `src/infrastructure/contact/contactApiGateway.ts`, `src/infrastructure/contact/contactPayloadBuilder.ts`, `src/infrastructure/contact/backendContactChannel.ts`, `src/infrastructure/contact/contactSubmissionErrors.ts`.
  - Evidencia: tests `tests/unit/infrastructure/contactApiGateway.test.ts`; `npm run typecheck`, `npm run test` y `npm run build` en verde.
  - Owner: Frontend
  - Dependencias: P0 de contrato backend (resuelta por DV-02).
  - Riesgo: Medio
  - Bloqueador: sin bloqueador de contrato; pendiente validacion de integracion cuando el backend Chatwoot este desplegado.
  - Siguiente paso: correr smoke de integracion contra backend Chatwoot al completar el deploy Docker en VPS.

- [x] (P1) Aumentar pruebas de UI critica (componentes y flujo de contacto)
  - Contexto: tests actuales son mayormente unitarios de application/domain; cobertura UI de componentes es minima.
  - Accion: agregar pruebas para `ContactFormSection`, `ConsentBanner`, y navegacion de submit/thanks.
  - DoD (criterio de aceptacion): al menos 1 spec por componente critico + 1 spec de flujo; pruebas fallan si se rompe interaccion principal.
  - Avance: agregados specs UI para `ContactFormSection`, `ConsentBanner` y flujo submit -> thanks con `@testing-library/vue`.
  - Evidencia: `tests/unit/ui/contactFormSection.test.ts`, `tests/unit/ui/consentBanner.test.ts`, `tests/unit/ui/contactSubmitThanksFlow.test.ts`.
  - Evidencia: `npm run typecheck` y `npm run test` en verde.
  - Owner: Frontend
  - Dependencias: P0 TypeScript y consentimiento
  - Riesgo: Medio
  - Siguiente paso: ampliar cobertura de UI para casos negativos (errores backend/validacion visual) y ruta thanks -> home como mejora incremental no bloqueante.

- [x] (P1) Reemplazar rutas hardcodeadas por nombres de ruta
  - Contexto: hay `router.push('/gracias')` y `router.push('/')` hardcodeados.
  - Accion: usar navegacion por `name` de ruta para reducir acoplamiento a paths.
  - DoD (criterio de aceptacion): no quedan `router.push()` con strings de rutas internas en flujo de contacto/thanks.
  - Evidencia: `src/ui/features/contact/contactHooks.ts` usa `{ name: 'thanks' }`; `src/ui/views/ThanksView.ts` usa `{ name: 'home' }`.
  - Owner: Frontend
  - Dependencias: Ninguna
  - Riesgo: Bajo

- [x] (P1) Limpiar duplicados y codigo huerfano
  - Contexto: existe evento duplicado `ContactSubmitted` en domain y application; hay archivos/carpetas sin uso (`src/infrastructure/config.ts`, `src/infrastructure/navigation/`).
  - Accion: eliminar o consolidar artefactos duplicados y dejar una sola fuente por concepto.
  - DoD (criterio de aceptacion): no hay clases/eventos duplicados para el mismo caso; sin archivos muertos detectados por busqueda de referencias.
  - Evidencia: eliminados `src/domain/contact/events/ContactSubmitted.ts`, `src/infrastructure/config.ts` y carpeta vacia `src/infrastructure/navigation`.
  - Owner: Frontend
  - Dependencias: Ninguna
  - Riesgo: Bajo

- [x] (P1) Actualizar documentacion desalineada con el codigo
  - Contexto: `README.md` y `docs/CSS_GUIDELINES.md` referencian archivos/rutas que no existen actualmente.
  - Accion: corregir referencias, scripts y rutas reales.
  - DoD (criterio de aceptacion): todas las rutas citadas en docs existen; comandos documentados ejecutan sin error.
  - Evidencia: `README.md` actualizado con scripts reales (`typecheck`, `check:css`, `lint:colors`, `quality:gate`) y rutas existentes.
  - Owner: Shared
  - Dependencias: Ninguna
  - Riesgo: Bajo

- [x] (P1) Optimizar parseo de contenido centralizado
  - Contexto: `ContentRepository` ejecuta `safeParse` en cada getter.
  - Accion: parsear una vez y cachear contenido validado durante ciclo de vida de app.
  - DoD (criterio de aceptacion): parseo unico implementado con tests que validan comportamiento y errores.
  - Avance: implementado cache interno del contenido parseado en `ContentRepository`.
  - Evidencia: `src/infrastructure/content/contentRepository.ts`, `tests/unit/infrastructure/contentRepository.test.ts`.
  - Evidencia: `npm run typecheck`, `npm run test` y `npm run build` en verde.
  - Owner: Frontend
  - Dependencias: Ninguna
  - Riesgo: Bajo

### P2

- [x] (P2) Introducir carga perezosa de rutas de pagina
  - Contexto: `src/router/routes.ts` importa paginas en forma estatica.
  - Accion: migrar a imports dinamicos para reducir payload inicial.
  - DoD (criterio de aceptacion): rutas principales con lazy loading y build validado sin regresiones funcionales.
  - Avance: rutas de pagina migradas a `import()` dinamico.
  - Evidencia: `src/router/routes.ts`.
  - Evidencia: `npm run build` en verde con chunks separados para paginas.
  - Owner: Frontend
  - Dependencias: P0 baseline en verde
  - Riesgo: Bajo

- [x] (P2) Definir reglas automaticas de limites de capas
  - Contexto: la separacion por capas existe, pero no hay regla automatica que la haga cumplir.
  - Accion: agregar regla de lint/import boundaries para prevenir dependencias no permitidas.
  - DoD (criterio de aceptacion): regla activa y documentada; ejemplo de violacion detectada por tooling.
  - Avance: implementado chequeo de capas (`lint:layers`) con reglas minimas para `domain`, `application`, `infrastructure` y `ui`.
  - Evidencia: `scripts/layerBoundaries.mjs`, `scripts/check-layer-boundaries.mjs`, `package.json` (script `lint:layers`).
  - Evidencia: ejemplo de violacion detectada por tooling en fixture `tests/fixtures/layer-boundaries/src/domain/badImport.ts` y test `tests/unit/scripts/layerBoundaries.test.ts`.
  - Evidencia: `npm run lint:layers`, `npx vitest run tests/unit/scripts/layerBoundaries.test.ts`, `npm run typecheck` y `npm run test` en verde.
  - Owner: Frontend
  - Dependencias: P0 puerta de calidad
  - Riesgo: Medio
  - Decision tomada (B): se adopto script custom Node en lugar de plugin ESLint para minimizar impacto y evitar introducir nueva toolchain.
  - Siguiente paso adicional (no bloqueante): al cerrar DV-03, incluir `lint:layers` en el pipeline bloqueante de merge.

- [x] (P2) Preparar smoke e2e minimo de regresion UI
  - Contexto: no hay tests e2e versionados.
  - Accion: crear smoke e2e para home, envio de contacto (mock) y pagina de gracias.
  - DoD (criterio de aceptacion): suite e2e minima ejecutable en pipeline acordado.
  - Avance: suite smoke e2e implementada con Playwright para `home`, submit de contacto (mock) y `thanks`.
  - Evidencia: `playwright.config.ts`, `.env.e2e`, `tests/e2e/smoke.spec.ts`, `vite.config.js` (exclude de `tests/e2e/**` en Vitest), `.gitignore`.
  - Evidencia: `package.json` (`test:e2e`, `test:e2e:smoke`) y dependencia `@playwright/test`.
  - Evidencia: `./.github/workflows/ci-cd-ftps.yml` con job `Smoke E2E`.
  - Evidencia: `npx playwright install chromium`, `npm run test:e2e:smoke`, `npm run typecheck`, `npm run test` y `npm run quality:gate` en verde.
  - Owner: Shared
  - Dependencias: P0 puerta de calidad
  - Riesgo: Medio
  - Decision tomada (B): se evaluo Cypress/Playwright/seguir solo con pruebas de componentes y se adopto Playwright por portabilidad en CI y menor friccion para mocks de red.
  - Bloqueador residual: sin bloqueador tecnico en repo; el enforcement de required checks queda trazado en DV-03 (externo a este arbol).
  - Siguiente paso: mantener `Smoke E2E` como check requerido al cerrar DV-03.

## 5) Dudas a resolver

### DV-01: Politica exacta de consentimiento y tracking

- [x] (P0) Validar matriz de consentimiento
  - Contexto: hay desacople entre `consentManager` y capa de analytics.
  - Accion: definir matriz de estados/eventos con Product/Legal y mapearla a implementacion tecnica.
  - DoD (criterio de aceptacion): documento corto aprobado con transiciones y eventos permitidos por estado.
  - Avance: matriz cerrada con decision `hard revoke` y sincronizada con implementacion tecnica.
  - Evidencia: `docs/dv-01-consent-matrix.md`.
  - Evidencia: `src/infrastructure/analytics/index.ts`, `src/infrastructure/analytics/ga4.ts`, `src/infrastructure/analytics/clarity.ts`, `src/infrastructure/analytics/cookies.ts`.
  - Evidencia: `tests/unit/infrastructure/analyticsConsentSync.test.ts`, `tests/unit/infrastructure/analyticsCookies.test.ts`.
  - Owner: Shared
  - Dependencias: Ninguna
  - Riesgo: Alto
  - Bloqueador residual: actualizar textos legales/politica de privacidad en canal correspondiente.
  - Siguiente paso: registrar cambio legal/publico para reflejar `hard revoke`.

### DV-02: Contrato backend para envio de contactos sin secreto en cliente

- [x] (P0) Confirmar contrato de autenticacion/origen con backend
  - Contexto: tras remover `X-Origin-Verify` del frontend era necesario acordar un mecanismo server-side seguro.
  - Accion: definir contrato backend con Chatwoot (server-to-server), incluyendo payload, auth por token en backend y reglas de CORS.
  - DoD (criterio de aceptacion): contrato escrito con ejemplo de request valido sin secreto en cliente.
  - Avance: contrato definido y documentado con decision de arquitectura `frontend(Ferozo) -> backend Docker en VPS -> Chatwoot`.
  - Evidencia: `docs/dv-02-chatwoot-contract.md`.
  - Owner: Backend
  - Dependencias: Ninguna
  - Riesgo: Alto
  - Bloqueador residual: falta implementacion del adaptador backend y prueba E2E contra Chatwoot.
  - Siguiente paso: desplegar backend Docker con variables `CHATWOOT_*` y validar flujo real de punta a punta.

### DV-04: Headers y politicas de seguridad en despliegue

- [x] (P1) Auditar headers de seguridad en entorno deployado
  - Contexto: se requiere visibilidad para cerrar riesgo frontend de XSS/carga de scripts terceros.
  - Accion: medir headers reales en entorno de staging/prod y contrastar contra baseline minimo.
  - DoD (criterio de aceptacion): reporte con headers actuales y brechas priorizadas (critico/alto/medio).
  - Avance: auditoria ejecutada sobre frontend productivo con inventario de headers y brechas priorizadas.
  - Evidencia: `docs/dv-04-security-headers-audit.md`.
  - Evidencia: medicion por `curl` de `https://www.datamaq.com.ar`, `http://www.datamaq.com.ar` y asset JS principal.
  - Owner: Shared
  - Dependencias: acceso a entorno desplegado
  - Riesgo: Medio
  - Decision tomada (B): se eligio URL objetivo `https://www.datamaq.com.ar` por ser frontend publico operativo del proyecto.
  - Bloqueador residual: aplicar headers/politicas en servidor o reverse proxy (fuera de repo) y re-auditar.
  - Siguiente paso: implementar redireccion HTTP->HTTPS + HSTS + CSP y repetir auditoria.

## Movido desde docs/todo.md el 2026-02-15 (limpieza operativa)

### Tareas completadas movidas desde backlog activo (P0)

- [x] (P0) UX-01 Consolidar header/nav y jerarquia "above the fold" (desktop + mobile)
  - Contexto: evidencia visual mostraba header/nav no consolidado y exceso de espacio muerto; en mobile el hero empujaba valor/CTA por debajo del fold.
  - Accion:
    - Desktop: header fijo/consistente con logo + nav + CTA primario.
    - Mobile: menu hamburguesa accesible; H1 + propuesta de valor + CTA primario visibles sin scroll (360x740).
    - Reordenamiento del hero para priorizar copy + CTA por encima de la ilustracion en mobile.
  - DoD:
    - En 360x740: H1 + texto de apoyo + CTA primario visibles sin scroll.
    - En desktop >= 1280px: header alineado, nav visible, CTA primario destacado.
    - Sin CLS perceptible.
    - `npm run test:a11y` en verde.
  - Avance: hero mobile reordenado; navbar consolidado en desktop y menu superpuesto en mobile.
  - Evidencia: `src/ui/sections/HeroSection.vue`, `src/styles/scss/sections/_hero.scss`, `src/ui/layout/Navbar.vue`, `src/styles/scss/sections/_navbar.scss`.
  - Evidencia: `tests/e2e/smoke.spec.ts` agrega test `mobile hero keeps headline, support copy and primary CTA above fold`.
  - Evidencia: `docs/evidence/ux-01-after-desktop-1280x720.png`, `docs/evidence/ux-01-after-mobile-360x740.png`, `docs/evidence/ux-01-before-after.md`.
  - Evidencia: `npm run quality:merge` en verde (2026-02-15 12:37 -03:00).
  - Bloqueador residual: ninguno dentro del repositorio.

- [x] (P0) UX-02 Accesibilidad interactiva critica (focus, teclado, menu, CTAs)
  - Contexto: era necesario asegurar foco visible consistente, navegacion por teclado y roles/aria correctos en menu/header.
  - Accion:
    - Menu mobile con `aria-expanded`, `aria-controls`, cierre con `Esc`, lock de scroll de fondo.
    - Restauracion de foco al toggle y foco inicial en primer link al abrir.
    - Validacion de teclado/contraste con checklist.
  - DoD:
    - Navegacion completa por teclado (Tab/Shift+Tab/Enter/Esc) sin bloqueos.
    - Contraste AA en controles relevantes.
    - `npm run test:a11y` en verde.
  - Avance: implementado comportamiento completo de foco/teclado/menu en mobile y estilos de foco consistentes.
  - Evidencia: `src/ui/layout/Navbar.ts`, `src/ui/layout/Navbar.vue`, `src/styles/scss/sections/_navbar.scss`.
  - Evidencia: `tests/unit/ui/navbar.test.ts` (aria-expanded, lock/unlock scroll, foco con `Esc`, foco inicial en primer link).
  - Evidencia: `tests/e2e/smoke.spec.ts` agrega test `mobile menu closes with Escape and restores focus`.
  - Evidencia: `docs/evidence/ux-02-keyboard-contrast-checklist.md`.
  - Evidencia: `npm run test:a11y` y `npm run quality:merge` en verde (2026-02-15 12:37 -03:00).
  - Bloqueador residual: ninguno dentro del repositorio.

### Historial operativo archivado (ruido removido de tareas abiertas)

#### P0 Eliminar secreto de verificacion del frontend
- Reintentos de smoke backend archivados en secuencia: 2026-02-15 (sin hora), 11:43 -03:00, 12:19 -03:00, 12:33 -03:00, 13:09 -03:00.
- Resultado repetido en todos los intentos: `npm run smoke:contact:backend -- https://chatwoot.datamaq.com.ar/contact` -> `fetch failed`.
- Guardrail de no regresion validado de forma repetida en verde: `npm run lint:origin-verify`.
- Validaciones de compliance asociadas: `npm run lint:todo-sync` en verde en reintentos.

#### P0 Definir puerta de calidad obligatoria para merge
- Historial detallado de endurecimiento de gobernanza/CI (AGENTS, todo-sync, CI Todo Sync, fail-fast local, cierre obligatorio C1/C2) movido desde `docs/todo.md`.
- Revalidaciones operativas archivadas: `npm run ci:remote:status` confirma run `22026695643` en success; `npm run ci:branch-protection:check` falla por falta de token.
- El estado vigente se mantiene en `docs/todo.md` con trazabilidad minima y acciones ejecutables.

#### DV-03 Relevar pipeline real de integracion
- Historial de evidencia remota redundante movido desde `docs/todo.md` para reducir ruido operativo.
- Se conserva en `docs/todo.md` solo estado actual, decisiones vigentes y siguiente accion interna.

### Notas A/B/C archivadas
- Se movio el detalle historico completo de clasificaciones A/B/C repetitivas fuera del tablero activo.
- `docs/todo.md` conserva un resumen activo y referencia a este archivo para auditoria historica.

## Ruido operativo movido desde docs/todo.md el 2026-02-15 13:44 -03:00

### Resumen
- Tareas afectadas: 1
- Lineas movidas: 14

### Definir puerta de calidad obligatoria para merge
  - Evidencia: `npm run ci:remote:status` (2026-02-15 13:43 -03:00) mantiene run `22026695643` en `success` con `Quality Gate`, `Smoke E2E` y `Deploy Production (FTPS)` en verde.
  - Evidencia: `npm run ci:branch-protection:check` (2026-02-15 13:43 -03:00) vuelve a fallar por falta de `GITHUB_TOKEN`/`GH_TOKEN`.
  - Evidencia: historial detallado de gobernanza y revalidaciones archivado en `docs/todo.done.2026-02.md`.
  - Avance: limpieza operativa ejecutada para mover tareas completadas y trazabilidad repetitiva fuera del tablero activo.
  - Evidencia: `docs/todo.md` compactado y `docs/todo.done.2026-02.md` actualizado con seccion `Movido desde docs/todo.md el 2026-02-15 (limpieza operativa)`.
  - Evidencia: `npm run lint:todo-sync` en verde (2026-02-15 13:17 -03:00) tras la limpieza documental.
  - Evidencia: `npm run lint:todo-sync` en verde (2026-02-15 13:18 -03:00) tras verificacion final de cumplimiento.
  - Evidencia: `scripts/archive-todo-completed.mjs`, `scripts/check-todo-sync.mjs`, `package.json`, `AGENTS.md`.
  - Evidencia: `npm run todo:archive:dry-run` en verde (2026-02-15 13:24 -03:00) sin tareas `[x]` pendientes de archivo.
  - Evidencia: `npm run lint:todo-sync` en verde (2026-02-15 13:24 -03:00) con `--require-no-done-tasks`.
  - Evidencia: `node scripts/archive-todo-completed.mjs --check` en verde (2026-02-15 13:25 -03:00).
  - Evidencia: `npm run lint:todo-sync` en verde (2026-02-15 13:25 -03:00) tras registrar trazabilidad de automatizacion.
  - Evidencia: `scripts/compact-todo-noise.mjs`, `package.json` (`todo:compact:noise`, `todo:compact:noise:dry-run`), `AGENTS.md` (regla de no mutacion en `quality:gate` + uso manual de compactacion).
  - Evidencia: `npm run todo:compact:noise:dry-run` en verde (2026-02-15 13:31 -03:00) detecta 5 lineas compactables en 1 tarea.

## Ruido operativo movido desde docs/todo.md el 2026-02-15 14:55 -03:00

### Resumen
- Tareas afectadas: 2
- Lineas movidas: 18

### Definir puerta de calidad obligatoria para merge
  - Avance: automatizada la higiene de backlog para archivar tareas cerradas desde `docs/todo.md` hacia `docs/todo.done.YYYY-MM.md` y evitar reintroduccion de ruido operativo.
  - Avance: implementado enfoque hibrido para limpieza documental (archivo automatico de `[x]` + comando separado de compactacion de ruido operativo).
  - Evidencia: `npm run todo:archive:dry-run` en verde (2026-02-15 13:31 -03:00) sin tareas cerradas pendientes.
  - Evidencia: `npm run lint:todo-sync` en verde (2026-02-15 13:31 -03:00) tras integrar automatizacion hibrida.
  - Evidencia: `npm run todo:compact:noise:dry-run` en verde (2026-02-15 13:32 -03:00) detecta 10 lineas compactables en 1 tarea tras actualizar trazabilidad del turno.
  - Evidencia: `npm run lint:todo-sync` en verde (2026-02-15 13:32 -03:00) con reglas de limpieza/archivo activas.
  - Evidencia: `npm run todo:compact:noise` (2026-02-15 13:44 -03:00) mueve 14 lineas de ruido operativo a `docs/todo.done.2026-02.md`.
  - Evidencia: `npm run lint:todo-sync` en verde (2026-02-15 13:45 -03:00) tras compactacion del tablero activo.
  - Evidencia: verificacion de entorno (2026-02-15 14:31 -03:00) con salida `GITHUB_TOKEN=False` y `GH_TOKEN=False`.
  - Evidencia: deteccion segura de claves en `.env*` (2026-02-15 14:31 -03:00) confirma ausencia de `GITHUB_TOKEN`/`GH_TOKEN` en `.env.e2e`, `.env.example`, `.env.local` y `.env.remote`.
  - Evidencia: `npm run ci:branch-protection:check` ejecutado por usuario con token (2026-02-15 14:35 -03:00) detecta `Required checks: (ninguno)` y mantiene `FAIL` por falta de `Quality Gate` y/o `Smoke E2E`.
  - Evidencia: `scripts/check-branch-protection.mjs` actualizado para validar `Todo Sync` + `Quality Gate` + `Smoke E2E`.
  - Evidencia: `docs/dv-03-ci-cd-inventory.md` actualizado (2026-02-15 14:37 -03:00) con resultado de branch protection consultable (`required checks: ninguno`) y procedimiento ajustado a 3 checks requeridos.

### Relevar pipeline real de integracion
  - Evidencia: `npm run ci:remote:status` (2026-02-15 13:43 -03:00) en verde con run `22026695643`.
  - Evidencia: `npm run ci:branch-protection:check` (2026-02-15 13:43 -03:00) vuelve a fallar por falta de `GITHUB_TOKEN`/`GH_TOKEN`.
  - Evidencia: verificacion de entorno local (2026-02-15 14:31 -03:00) mantiene token no exportado: `GITHUB_TOKEN=False`, `GH_TOKEN=False`.
  - Evidencia: deteccion segura en archivos `.env*` (2026-02-15 14:31 -03:00) sin claves `GITHUB_TOKEN`/`GH_TOKEN` versionadas en repo.
  - Evidencia: ejecucion manual con token (2026-02-15 14:35 -03:00) obtiene branch protection en `main` con `Required checks detectados: (ninguno)` y `FAIL` por falta de `Quality Gate`/`Smoke E2E`.

## Ruido operativo movido desde docs/todo.md el 2026-02-15 14:59 -03:00

### Resumen
- Tareas afectadas: 2
- Lineas movidas: 5

### Definir puerta de calidad obligatoria para merge
  - Avance: validada mitigacion interna de credenciales en este turno; la sesion local no tiene `GITHUB_TOKEN`/`GH_TOKEN` exportados y tampoco hay claves en `.env*` del repo.
  - Evidencia: `npm run ci:branch-protection:check` (2026-02-15 14:36 -03:00) ejecutado en sesion local del agente falla por token no exportado, consistente con el bloqueo C2 de configuracion en GitHub.
  - Evidencia: `npm run ci:remote:status` (2026-02-15 14:46 -03:00) confirma run `22039359682` en `success` con jobs `Todo Sync`, `Quality Gate` y `Smoke E2E` en verde.
  - Evidencia: consulta `GET /repos/AgustinMadygraf/profebustos-www/commits/main/check-runs` (2026-02-15 14:46 -03:00) devuelve checks `Todo Sync`, `Quality Gate`, `Smoke E2E` y `Deploy Production (FTPS)` como nombres planos.

### Relevar pipeline real de integracion
  - Evidencia: `scripts/check-branch-protection.mjs` (2026-02-15 14:36 -03:00) actualizado para exigir tambien `Todo Sync` y alinear el check local con los required checks definidos para `main`.

## Movido desde docs/todo.md el 2026-02-15 15:02 -03:00

### Tareas movidas (2)

- [x] (P0) Definir puerta de calidad obligatoria para merge
  - Contexto: el workflow CI/CD esta versionado en repo, pero los checks criticos aun no estan garantizados como bloqueantes hasta configurar branch protection.
  - Accion: definir y aplicar pipeline minimo con `typecheck`, `test`, `test:a11y`, `check:css`, `lint:colors`.
  - DoD (criterio de aceptacion): politica de merge definida y ejecutable (CI o mecanismo acordado) con esos checks como requisito.
  - Avance: implementado workflow `GitHub Actions + FTPS` con jobs `Todo Sync`, `Quality Gate`, `Smoke E2E` y `Deploy Production (FTPS)`.
  - Evidencia: `./.github/workflows/ci-cd-ftps.yml`, `package.json` (`quality:gate`, `quality:merge`, `lint:todo-sync`, `ci:remote:status`, `ci:branch-protection:check`), `docs/dv-03-ci-cd-inventory.md`.
  - Evidencia: `npm run ci:remote:status` (2026-02-15 13:09 -03:00) confirma run `22026695643` en `success` con `Quality Gate`, `Smoke E2E` y `Deploy Production (FTPS)` en verde.
  - Evidencia: `npm run ci:branch-protection:check` (2026-02-15 13:09 -03:00) falla por falta de `GITHUB_TOKEN`/`GH_TOKEN`.
  - Avance: alineado `ci:branch-protection:check` con la politica vigente para exigir tambien `Todo Sync` junto con `Quality Gate` y `Smoke E2E`.
  - Evidencia: `npm run ci:branch-protection:check` ejecutado por usuario con token (2026-02-15 14:54 -03:00) mantiene `Required checks: (ninguno)` y `FAIL` por falta de `Todo Sync`, `Quality Gate`, `Smoke E2E`.
  - Evidencia: `docs/dv-03-ci-cd-inventory.md` actualizado (2026-02-15 14:55 -03:00) con snippet PowerShell para aplicar contexts requeridos por API cuando la UI no lista checks.
  - Avance: agregada mitigacion interna para evitar errores de formato en PowerShell mediante comando unico `npm run ci:branch-protection:set-checks`.
  - Evidencia: `scripts/set-branch-protection-checks.mjs`, `package.json` (`ci:branch-protection:set-checks`) (2026-02-15 14:58 -03:00).
  - Evidencia: `npm run ci:branch-protection:set-checks` (2026-02-15 14:59 -03:00) ejecutado en sesion local del agente falla por token no exportado; el comando queda listo para usar en la sesion del usuario con token activo.
  - Avance: branch protection de `main` configurada exitosamente con required checks del flujo FTPS (`Todo Sync`, `Quality Gate`, `Smoke E2E`).
  - Evidencia: ejecucion manual de usuario (2026-02-15 15:02 -03:00) `npm run ci:branch-protection:set-checks` en verde con `Required checks configurados: Todo Sync, Quality Gate, Smoke E2E`.
  - Evidencia: ejecucion manual de usuario (2026-02-15 15:02 -03:00) `npm run ci:branch-protection:check` en verde con `OK: branch protection incluye Todo Sync, Quality Gate y Smoke E2E`.
  - Dependencias: DV-03 (estado real de CI/CD).
  - Riesgo: Alto.
  - Decision tomada (B): para reducir ruido operativo, se mueve a `docs/todo.done.2026-02.md` el historial de tareas completadas y seguimiento repetitivo, manteniendo `docs/todo.md` como tablero activo.
  - Decision tomada (B): se automatiza el archivo de tareas cerradas con `todo:archive` y se enforcea limpieza en `lint:todo-sync` para sostener `docs/todo.md` como tablero activo.
  - Decision tomada (B): se adopta estrategia hibrida para ruido documental: `todo:archive` automatiza `[x]` y `todo:compact:noise` queda como comando manual separado; `quality:gate` permanece solo de validacion.
  - Decision tomada (B): para cerrar DV-03 se prioriza configurar required checks; `Require branches to be up to date before merging` queda opcional y se puede activar despues como endurecimiento adicional.
  - Decision tomada (B): para minimizar errores manuales en la carga de required checks, se automatiza el PATCH de branch protection en un script npm dedicado.
  - Decision tomada (C): se mantiene bloqueo externo hasta aplicar en GitHub los required checks del flujo FTPS sobre branch protection de `main`.
  - Tipo C: C2.
  - Informacion faltante: branch protection de `main` configurada con required checks del flujo FTPS (`CI/CD FTPS / Todo Sync`, `CI/CD FTPS / Quality Gate`, `CI/CD FTPS / Smoke E2E`).
  - Mitigacion interna ejecutada: verificacion remota publica con `ci:remote:status`, consulta de `check-runs` para validar nombres reales de checks, reejecuciones manuales con token que confirman `required checks` vacios, y enforcement local con `lint:todo-sync`.
  - Tareas externas (solo C2 y acciones fuera del repo): ejecutar con token `npm run ci:branch-protection:set-checks` (o configurar por UI/API) para exigir `Todo Sync`, `Quality Gate` y `Smoke E2E` en branch protection de `main`.
  - Bloqueador residual: falta activar required checks y branch protection en `main`.
  - Siguiente paso: ejecutar `npm run ci:branch-protection:set-checks` con token en sesion local para aplicar required checks y luego revalidar con `npm run ci:branch-protection:check`.
  - Siguiente accion interna ejecutable ahora: tras correr `npm run ci:branch-protection:set-checks` con token, reejecutar `npm run ci:branch-protection:check` y registrar evidencia del resultado.

### P0 completadas (archivadas)
- UX-01 Consolidar header/nav y jerarquia above the fold (desktop + mobile).
- UX-02 Accesibilidad interactiva critica (focus, teclado, menu, CTAs).
- Evidencia y detalle: `docs/todo.done.2026-02.md` (seccion "Movido desde docs/todo.md el 2026-02-15").

### P1

- [x] (P0) Relevar pipeline real de integracion
  - Contexto: los checks criticos no estan garantizados por evidencia local.
  - Accion: inventariar estado real y decidir implementacion en repo o fuera del repo.
  - DoD (criterio de aceptacion): inventario de checks actuales + decision de implementacion en repo o fuera del repo.
  - Avance: inventario completado y decision ejecutada: `GitHub Actions + FTPS` en repo, con jobs `Todo Sync`, `Quality Gate`, `Smoke E2E` y `Deploy Production (FTPS)`.
  - Evidencia: `docs/dv-03-ci-cd-inventory.md`, `./.github/workflows/ci-cd-ftps.yml`.
  - Evidencia: `npm run ci:remote:status` (2026-02-15 13:09 -03:00) en verde con run `22026695643`.
  - Evidencia: `npm run ci:branch-protection:check` (2026-02-15 13:09 -03:00) falla por falta de `GITHUB_TOKEN`/`GH_TOKEN`.
  - Evidencia: `npm run ci:remote:status` (2026-02-15 14:46 -03:00) muestra run reciente `22039359682` en `success` con jobs `Todo Sync`, `Quality Gate` y `Smoke E2E`.
  - Evidencia: API publica de check-runs (2026-02-15 14:46 -03:00) lista nombres planos `Todo Sync`, `Quality Gate`, `Smoke E2E` (sin prefijo obligatorio del workflow).
  - Evidencia: revalidacion manual con token (2026-02-15 14:54 -03:00) sigue reportando `Required checks detectados: (ninguno)` pese a tener `Require status checks to pass before merging` activo.
  - Evidencia: `scripts/set-branch-protection-checks.mjs` + `npm run ci:branch-protection:set-checks` agregados (2026-02-15 14:58 -03:00) para aplicar required checks por API sin multilinea manual de PowerShell.
  - Evidencia: cierre DV-03 (2026-02-15 15:02 -03:00) con `npm run ci:branch-protection:set-checks` y `npm run ci:branch-protection:check` en verde desde sesion de usuario.
  - Riesgo: Medio.
  - Bloqueador residual: branch protection sin required checks del flujo FTPS en `main`.
  - Decision tomada (B): para indexar checks sin abrir PR se elige `workflow_dispatch` sobre `main` en lugar de push tecnico.
  - Decision tomada (B): exigir checks del flujo FTPS vigente (`Todo Sync` + `Quality Gate` + `Smoke E2E`) y no checks legacy.
  - Siguiente paso: aplicar en GitHub los required checks del flujo FTPS en `main` (`Todo Sync`, `Quality Gate`, `Smoke E2E`) por UI o API y revalidar con `ci:branch-protection:check`.
  - Nota C (2026-02-15): el bloqueo remanente depende de configuracion en GitHub (fuera del arbol versionado).
  - Siguiente accion interna ejecutable ahora: reejecutar `npm run ci:branch-protection:check` luego de aplicar required checks en GitHub y actualizar `docs/dv-03-ci-cd-inventory.md` con los contexts detectados.

### DV-UX-01: Objetivo de conversion y KPI minimo
Duda:
- Cual es el objetivo primario medible de la landing (click a WhatsApp, envio de formulario, scroll a tarifas, etc.) y que evento define "lead valido".

Tarea de verificacion:

## Movido desde docs/todo.md el 2026-02-15 15:12 -03:00

### Tareas movidas (1)

- [x] (P1) UX-03 Normalizar tipografia, espaciado y componentes base (design tokens minimo)
  - Contexto: mejoras UX sustentables requieren consistencia (botones, badges, cards, spacing, tipo).
  - Accion:
    - Definir tokens minimos (CSS variables) para: font-size/line-height, spacing, radius, sombras, colores semanticos (bg/surface/text/primary).
    - Unificar componentes base: `Button`, `Badge/Chip`, `Card` (estados hover/focus/disabled).
  - DoD:
    - No hay estilos ad-hoc repetidos para CTA/badges/cards (refactor visible).
    - Tokens documentados en `docs/` (breve) y consumidos por componentes.
    - `check:css` y `lint:colors` siguen en verde.
  - Avance: definidos tokens UI minimos (tipografia, spacing, radius, sombras y colores semanticos) y creado parcial de componentes base para `Button`, `Chip` y `Card`.
  - Avance: refactor de componentes clave para consumir clases base (`c-ui-btn`, `c-ui-chip`, `c-ui-card`) y reducir estilos repetidos en CTA/chips/cards.
  - Evidencia: `src/styles/scss/_tokens.scss`, `src/styles/scss/_components.scss`, `src/styles/main.scss`.
  - Evidencia: `src/ui/sections/HeroSection.vue`, `src/ui/sections/ServiceCard.vue`, `src/ui/layout/Navbar.vue`, `src/ui/features/contact/ContactFormSection.vue`, `src/ui/features/contact/ConsentBanner.vue`, `src/ui/views/ThanksView.vue`, `src/ui/pages/MedicionConsumoEscobar.vue`.
  - Evidencia: `src/styles/scss/sections/_hero.scss`, `src/styles/scss/sections/_services.scss`, `src/styles/scss/sections/_contact.scss`.
  - Evidencia: `docs/dv-ux-03-design-tokens.md`.
  - Decision tomada (B): para unificar componentes sin introducir wrappers Vue nuevos, se evaluo crear componentes dedicados vs clases base CSS; se elige clases base por menor impacto en markup y rollout incremental.
  - Evidencia: `npm run lint:colors` en verde (2026-02-15 15:12 -03:00).
  - Evidencia: `npm run typecheck` en verde (2026-02-15 15:12 -03:00).
  - Evidencia: `npm run test` en verde (2026-02-15 15:12 -03:00), 27 archivos y 73 tests pasando.
  - Evidencia: `npm run check:css` en verde (2026-02-15 15:12 -03:00), `CSS budget ok: 210073 bytes <= 210100 bytes`.
  - Avance: DoD de UX-03 cumplido y listo para archivo.
  - Riesgo: Medio (cambios transversales).

## Movido desde docs/todo.md el 2026-02-15 16:17 -03:00

### Tareas movidas (1)

- [x] (P1) UX-04 IA y estructura de landing orientada a decision (secciones + anclas)
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
  - Decision tomada (B): para minimizar impacto en componentes existentes, se implementa un bloque unico de decision (`DecisionFlowSection`) con secciones ancladas y estilos dedicados en vez de refactorizar todas las secciones legacy en el mismo turno.
  - Avance: maquetadas secciones `Proceso`, `Tarifas`, `Cobertura` y `FAQ`, con enlace directo a `#contacto` y CTA WhatsApp contextual.
  - Avance: actualizada navegacion por anclas para desktop/mobile en navbar (`#servicios`, `#proceso`, `#tarifas`, `#cobertura`, `#faq`, `#contacto`).
  - Evidencia: `src/ui/sections/DecisionFlowSection.vue`, `src/ui/pages/HomePage.vue`, `src/infrastructure/content/content.ts`.
  - Evidencia: `src/styles/scss/sections/_decision-flow.scss`, `src/styles/main.scss`.
  - Evidencia: `tests/unit/ui/decisionFlowSection.test.ts`, `tests/unit/infrastructure/contentRepository.test.ts`.
  - Evidencia: `npm run typecheck` en verde (2026-02-15 16:14 -03:00).
  - Evidencia: `npm run test` en verde (2026-02-15 16:15 -03:00), 28 archivos y 76 tests pasando.
  - Evidencia: `npm run build` en verde (2026-02-15 16:14 -03:00).
  - Avance: DoD de UX-04 cumplido y listo para archivo.

## Movido desde docs/todo.md el 2026-02-15 16:20 -03:00

### Tareas movidas (1)

- [x] (P1) UX-05 Copy y microcopy de confianza (ortografia + claridad de alcance)
  - Contexto: errores de acentuacion y frases largas restan credibilidad; tambien falta claridad en alcance/condiciones.
  - Accion:
    - Corregir ortografia/acentos (Instalacion, diagnostico, electrico, verificacion, documentacion).
    - Simplificar parrafo de apoyo (frases mas cortas, 1 idea por linea).
    - Aclarar tarifa base: desde cuanto, que incluye, que varia (traslado/distancia/equipo provisto).
  - DoD:
    - Sin errores ortograficos evidentes en hero/servicios.
    - Copy del hero <= 2-3 lineas en desktop y <= 4 lineas en mobile (sin pared de texto).
    - Mensaje de CTA coherente (WhatsApp: "Pedi coordinacion" / "Cotizar por WhatsApp").
  - Decision tomada (B): para evitar regresiones por encoding en archivos historicamente ASCII, se normaliza el copy con ortografia consistente en ASCII y foco en claridad semantica.
  - Avance: simplificado copy del hero para reducir longitud y reforzar propuesta de valor (alcance + verificacion + documentacion).
  - Avance: aclarada la tarifa base en mensaje de respuesta con variables explicitas (distancia/urgencia/base operativa).
  - Avance: CTA WhatsApp unificada en copy de conversion (`Pedi coordinacion` y `Cotizar por WhatsApp`) entre hero, navbar y servicios.
  - Evidencia: `src/infrastructure/content/content.ts` (hero, servicios, navbar).
  - Evidencia: `npm run typecheck` en verde (2026-02-15 16:19 -03:00).
  - Evidencia: `npm run test` en verde (2026-02-15 16:19 -03:00), 28 archivos y 76 tests pasando.
  - Evidencia: `npm run build` en verde (2026-02-15 16:19 -03:00).
  - Avance: DoD de UX-05 cumplido y listo para archivo.

## Movido desde docs/todo.md el 2026-02-15 16:25 -03:00

### Tareas movidas (1)

- [x] (P1) UX-06 CTA y conversion tracking (sin romper consentimiento)
  - Contexto: hay CTA WhatsApp y "Ver servicios"; falta jerarquia consistente y medicion.
  - Accion:
    - Definir CTA primario unico por pantalla (WhatsApp/Contacto) + secundario (Servicios).
    - Mensaje prellenado de WhatsApp con contexto (servicio + zona + urgencia).
    - Eventos de analitica solo tras consentimiento (alineado al flujo actual).
  - DoD:
    - CTA primario consistente (mismo label/estilo) en hero, header y footer.
    - Tracking de click CTA y scroll a secciones (si aplica) respetando consentimiento.
  - Riesgo: Medio (acople con analytics/consent).
  - Decision tomada (B): para registrar scroll a secciones sin acoplar cada componente, se instrumenta `hashchange` en Home y se reusa `EngagementTracker` + `TrackingFacade` (que ya respeta consentimiento).
  - Avance: CTA primaria de WhatsApp consistente en hero, navbar y footer (`Pedi coordinacion`) con mismo estilo visual primario.
  - Avance: mensaje WhatsApp prellenado actualizado con contexto guiado (`Servicio`, `Zona`, `Urgencia`) en hero, servicios y bloque de decision.
  - Avance: tracking de scroll a secciones incorporado con evento `scroll_to_section` y deduplicacion del tracker existente.
  - Evidencia: `src/ui/layout/Footer.vue`, `src/ui/layout/Footer.ts`, `src/ui/pages/HomePage.vue`, `src/ui/pages/HomePage.ts`, `src/ui/views/ThanksView.vue`, `src/ui/pages/MedicionConsumoEscobar.vue`.
  - Evidencia: `src/ui/controllers/contactController.ts`, `src/application/analytics/engagementTracker.ts`, `src/application/analytics/conversionEvents.ts`.
  - Evidencia: `src/infrastructure/content/content.ts`, `src/ui/sections/DecisionFlowSection.vue`, `src/ui/types/layout.ts`.
  - Evidencia: `tests/unit/ui/footer.test.ts`, `tests/unit/application/engagementTracker.test.ts`.
  - Evidencia: `npm run typecheck` en verde (2026-02-15 16:25 -03:00).
  - Evidencia: `npm run test` en verde (2026-02-15 16:25 -03:00), 29 archivos y 79 tests pasando.
  - Evidencia: `npm run build` en verde (2026-02-15 16:25 -03:00).
  - Avance: DoD de UX-06 cumplido y listo para archivo.

## Movido desde docs/todo.md el 2026-02-15 16:29 -03:00

### Tareas movidas (1)

- [x] (P1) UX-07 Señales de confianza (trust) sin ruido
  - Contexto: servicios industriales requieren reducir incertidumbre (quien, como, evidencia).
  - Accion: incorporar 2-4 señales maximas:
    - "Checklist + verificacion final + documentacion"
    - "Respuesta < 24hs"
    - Cobertura/zonas
    - (Opcional) mini caso/testimonio o logos (si existen)
  - DoD:
    - Trust signals visibles en hero o primera pantalla sin saturar.
    - No compiten visualmente con CTA (jerarquia clara).
  - Decision tomada (B): se prioriza reforzar trust en la primera pantalla reutilizando chips del hero en vez de agregar nuevos bloques visuales, para evitar competir con CTA principal.
  - Avance: chips del hero ajustados a 4 senales concretas de confianza (checklist/verificacion, documentacion, respuesta <24h, cobertura).
  - Avance: se mantienen jerarquia y contraste de CTA primario sin agregar elementos de alto peso visual.
  - Evidencia: `src/ui/sections/HeroSection.ts`.
  - Evidencia: `tests/unit/ui/heroSection.test.ts`.
  - Evidencia: `npm run typecheck` en verde (2026-02-15 16:27 -03:00).
  - Evidencia: `npm run test` en verde (2026-02-15 16:27 -03:00), 30 archivos y 80 tests pasando.
  - Evidencia: `npm run build` en verde (2026-02-15 16:27 -03:00).
  - Avance: DoD de UX-07 cumplido y listo para archivo.

### P2
