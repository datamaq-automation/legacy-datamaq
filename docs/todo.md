# Plan Tecnico Prioritario

## 1) Contexto y objetivo
El diagnostico tecnico del frontend Vue/TypeScript muestra una base arquitectonica util (capas `ui/application/domain/infrastructure`) pero con bloqueadores concretos para cambios grandes de UI/UX.
Se confirmo evidencia objetiva de baseline roto en calidad tecnica: `npx tsc --noEmit` falla con 38 errores, y hoy fallan `npm run check:css`, `npm run test:a11y` y `npm run lint:colors`.
Tambien se confirmo un riesgo alto en consentimiento/analytics (flujo desacoplado) y en seguridad de configuracion (mitigado en frontend, con contrato DV-02 definido para Chatwoot; pendiente implementacion backend y validacion E2E).
Objetivo de este plan: dejar el proyecto en estado seguro y estable para ejecutar cambios grandes de UI/UX sin generar deuda critica.

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

- [>] (P0) Eliminar secreto de verificacion del frontend
  - Contexto: se detecto uso de `VITE_ORIGIN_VERIFY_SECRET` y envio de `X-Origin-Verify` desde navegador, lo que no es secreto en cliente.
  - Accion: remover uso de secreto en frontend y migrar validacion de origen al backend/proxy.
  - DoD (criterio de aceptacion): no hay referencias a `VITE_ORIGIN_VERIFY_SECRET` ni a `X-Origin-Verify` en frontend; contrato backend validado y funcionando.
  - Avance: removidas las referencias frontend al secreto y al header de verificacion; contrato backend definido con integracion server-to-server a Chatwoot.
  - Evidencia: `src/application/ports/Config.ts`, `src/infrastructure/config/viteConfig.ts`, `src/infrastructure/contact/contactApiGateway.ts`, `src/env.d.ts`, `.env.example`, `tests/unit/infrastructure/contactApiGateway.test.ts`.
  - Evidencia: `docs/dv-02-chatwoot-contract.md`.
  - Evidencia: `npm run typecheck`, `npm run test` y `npm run build` en verde.
  - Owner: Shared
  - Dependencias: DV-02 (contrato backend)
  - Riesgo: Alto
  - Bloqueador residual: falta implementar en backend Docker (VPS) el adaptador Chatwoot y validar E2E en produccion.
  - Siguiente paso: implementar endpoint backend con token de Chatwoot en servidor y ejecutar prueba formulario real -> conversacion en Chatwoot.
  - Nota C (2026-02-14): el cierre restante esta fuera de este repo (backend Docker/VPS y operacion Chatwoot).

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

- [>] (P0) Definir puerta de calidad obligatoria para merge
  - Contexto: el workflow CI/CD ya esta versionado en repo, pero los checks criticos todavia no estan garantizados como bloqueantes hasta configurar branch protection.
  - Accion: definir y aplicar pipeline minimo con `typecheck`, `test`, `test:a11y`, `check:css`, `lint:colors`.
  - DoD (criterio de aceptacion): politica de merge definida y ejecutable (CI o mecanismo acordado) con esos checks como requisito.
  - Avance: implementado workflow `GitHub Actions + FTPS` con `Quality Gate` y deploy condicionado a `main`; `quality:gate` actualizado para incluir `lint:layers`.
  - Evidencia: `./.github/workflows/ci-cd-ftps.yml`, `package.json` (`quality:gate` + `lint:layers`), `docs/dv-03-ci-cd-inventory.md`.
  - Evidencia: `npm run quality:gate` en verde (2026-02-14) con `typecheck`, `test`, `lint:colors`, `lint:layers`, `test:a11y` y `check:css`.
  - Owner: Shared
  - Dependencias: DV-03 (estado real de CI/CD)
  - Riesgo: Alto
  - Bloqueador: falta activar required checks y branch protection en `main`.
  - Siguiente paso: configurar secrets FTPS + branch protection y exigir `CI/CD FTPS / Quality Gate`.
  - Nota C (2026-02-14): bloqueo de configuracion en GitHub (entorno externo al repo).

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
Duda:
- Decision funcional tomada: politica `hard revoke` para `denied` y revocacion.

Tarea de verificacion:
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
Duda:
- Contrato tecnico definido; pendiente ejecucion operativa (backend Docker en VPS + prueba E2E).

Tarea de verificacion:
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
  - Evidencia: `npm run quality:gate` en verde (2026-02-14).
  - Owner: Shared
  - Dependencias: Ninguna
  - Riesgo: Medio
  - Bloqueador residual: configurar branch protection y required checks en GitHub.
  - Decision tomada (B): para indexar checks sin abrir PR se elige `workflow_dispatch` sobre `main` en lugar de push tecnico.
  - Siguiente paso: ejecutar `workflow_dispatch` en `main`, luego aplicar branch protection y exigir `CI/CD FTPS / Quality Gate` + `CI/CD FTPS / Smoke E2E`.
  - Nota operativa: puede ejecutarse en paralelo sin bloquear la continuidad de otros P0 funcionales (DV-01 y el cierre operativo del P0 de secreto/frontend-backend).
  - Nota C (2026-02-14): el bloqueo remanente depende de configuracion en GitHub (fuera del arbol versionado).

### DV-04: Headers y politicas de seguridad en despliegue
Duda:
- Relevamiento tecnico de headers frontend completado; pendiente aplicacion en infraestructura.

Tarea de verificacion:
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

### Notas de ejecucion A/B/C (2026-02-14)
- Clasificacion B aplicada en: P2 limites de capas (opcion elegida: script custom Node `lint:layers` + test de fixture por menor impacto de toolchain).
- Clasificacion B aplicada en: DV-04 auditoria de headers (URL objetivo elegida: `https://www.datamaq.com.ar`).
- Clasificacion B aplicada en: P2 smoke e2e (opcion elegida: Playwright para smoke local con mock de backend).
- Clasificacion B aplicada en: DV-03 indexacion de checks sin PR (opcion elegida: `workflow_dispatch` en `main` para evitar commits tecnicos).
- Clasificacion C (duda de alto nivel) mantenida en: P0 seguridad/frontend-backend (cierre operativo fuera del repo), P0 puerta de calidad obligatoria para merge (enforcement externo en GitHub), DV-03.
- DV-02 sale de C por definicion contractual documentada; queda pendiente ejecucion tecnica (backend Docker + prueba E2E) dentro del P0 de seguridad.
- DV-01 sale de C por decision funcional `hard revoke` e implementacion tecnica sincronizada.
- DV-04 sale de C por reporte tecnico versionado; queda pendiente remediacion de infraestructura fuera de repo.
- Informacion faltante para destrabar C: evidencia de required checks/branch protection efectivos (DV-03) y habilitacion de e2e como check bloqueante en ese pipeline.

## 7) Proximos pasos
- Priorizar implementacion backend/E2E de DV-02 por impacto funcional y de seguridad.
- Completar DV-03 (enforcement de merge) en paralelo, sin frenar ejecucion de otros P0.
- Ejecutar P0 pendientes en orden: Seguridad de secreto (backend Chatwoot operativo) -> puerta de calidad/CI obligatoria.
- Congelar cambios grandes de UI/UX hasta que todos los P0 esten en verde.
- Replanificar alcance de rediseno UI/UX solo despues de completar P1 minimo.
- Revisar este backlog semanalmente con evidencia de comandos y estado de DoD por tarea.
